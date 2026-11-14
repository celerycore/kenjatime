"""End-to-end smoke test for the isolated PR17 benchmark UI and CSV capture."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import csv, functools, http.server, io, json, shutil, threading

ROOT = Path(__file__).resolve().parents[2]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT / 'dist-core')))
threading.Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}/core/index.html'
summary = {'preview': 'r8-benchmark-pr17', 'checks': {}}
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=shutil.which('chromium') or p.chromium.executable_path,
            headless=True,
            args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        page = browser.new_page(viewport={'width': 1100, 'height': 850}, accept_downloads=True)
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base)
        page.wait_for_function("document.querySelector('#status')?.textContent === 'Ready when you are.'", timeout=30000)
        assert page.title() == 'Kenjatime Core · PR #17 R8 Benchmark'
        assert page.locator('#kenjatime-r8-benchmark').count() == 1
        # The HUD must not obscure archive/file chooser controls during setup.
        assert not page.locator('#kenjatime-r8-benchmark details').evaluate('(el) => el.open')
        assert page.locator('#core-qa-guide').count() == 1
        assert page.locator('#endless-mode').count() == 1
        assert not page.locator('#endless-mode').is_checked()
        assert page.locator('#browse').count() == 1
        assert page.locator('#browse-split').count() == 1
        assert page.locator('#browse-all').count() == 1
        assert page.locator('#direct-archive-file').count() == 1
        assert page.locator('#direct-archive-file').is_visible()
        assert page.locator('#direct-archive-file').get_attribute('accept') is None
        assert page.locator('#archive-url').count() == 1
        assert page.locator('#import-archive-url').count() == 1
        # The primary archive chooser must no longer request unrestricted
        # multi-selection, which can open Android's photo/gallery providers.
        for button, multi, generic in [
            ('#browse', False, False),
            ('#browse-split', True, False),
            ('#browse-all', False, True),
        ]:
            with page.expect_file_chooser() as chooser_event:
                page.locator(button).click()
            chooser = chooser_event.value
            assert chooser.is_multiple() is multi, button
            accept = page.locator('#engine-archive-file').get_attribute('accept')
            assert (accept == '*/*') is generic, (button, accept)
            if not generic:
                assert all(ext in accept for ext in ['.zip', '.rar', '.7z'])
            # Simulate user cancellation without importing an actual archive.
            page.locator('#engine-archive-file').evaluate(
                '(el) => el.dispatchEvent(new Event("cancel"))')
            page.wait_for_function("!document.querySelector('#engine-archive-file')")
            page.wait_for_function("!document.querySelector('#browse').disabled")
        summary['checks']['androidDocumentPicker'] = True
        summary['checks']['isolatedLabel'] = True

        cache=page.locator('#sprite-cache-mode')
        assert cache.count() == 1
        assert cache.input_value() == 'extended'
        assert {x['value'] for x in cache.locator('option').evaluate_all(
            '(options) => options.map(x => ({value:x.value}))')} == {
            'legacy','balanced','extended','maximum'}
        assert page.locator('#gameplay-first-mode').count() == 1
        assert page.locator('#gameplay-first-mode').input_value() == 'gameplay'
        assert page.locator('#gameplay-first-mode option').count() == 2
        page.locator('#arena-mode').select_option('cpu')
        page.locator('#endless-mode').check()
        assert page.locator('#endless-mode').is_checked()
        page.locator('#fight-now').click()
        page.wait_for_function('window.__kenjatimeCoreBattle?.gpu()?.frames > 10', timeout=90000)
        assert page.locator('.kenjatime-now-loading').count() == 1
        assert page.locator('.kenjatime-now-loading').is_hidden()
        assert page.locator('.kenjatime-now-loading .kenjatime-loading-title').text_content() == 'NOW LOADING'
        # Open after match starts, so recording remains reachable.
        assert page.locator('#kenjatime-r8-benchmark details').evaluate('(el) => el.open')
        assert page.locator('#kenjatime-r8-benchmark details').evaluate(
            '(el) => getComputedStyle(el).overflowY == "auto" && el.clientHeight <= window.innerHeight')
        page.locator('[data-r8-start]').click()
        page.wait_for_function('window.__kenjatimeR8Benchmark.snapshot().samples >= 3', timeout=20000)
        snapshot = page.evaluate('window.__kenjatimeR8Benchmark.snapshot()')
        gpu = page.evaluate('window.__kenjatimeCoreBattle.gpu()')
        assert snapshot['recording'] and snapshot['samples'] >= 3
        assert 'indexedTextureBytes' in gpu and 'paletteTextureBytes' in gpu
        assert 'videoTextureBytes' in gpu and 'deferredVideoFrames' in gpu
        assert 'recycledTextures' in gpu and gpu['recycledTextures'] >= 0
        assert all(key in gpu and gpu[key] >= 0 for key in [
            'framePacketBuildMs','frameSpriteRestoreCpuMs','frameRendererCpuMs'])
        assert page.locator('[data-r8="packetCpu"]').count() == 1
        assert page.locator('[data-r8="restoreCpu"]').count() == 1
        assert page.locator('[data-r8="recycled"]').count() == 1
        assert page.locator('[data-r8="cachesavings"]').count() == 1
        assert gpu['textureBytes'] >= sum(gpu[key] for key in
            ['indexedTextureBytes','paletteTextureBytes','truecolorTextureBytes','videoTextureBytes'])
        assert gpu['deferredVideoFrames'] >= 0
        assert page.locator('[data-r8="videomem"]').count() == 1
        assert page.locator('[data-r8="videodeferred"]').count() == 1
        assert gpu['textureEvictions'] >= 0
        state = page.evaluate('window.__kenjatimeCoreBattle.snapshot()')
        assert state['endlessMode'] is True and state['roundTimeLeft'] == -1, state
        assert state['simulationHz'] == 60, state
        assert state['gameplayFirstFrameskip'] is True, state
        assert isinstance(state['simulationDebtChangeHz'],(int,float)), state
        assert 0 < state['renderTargetFps'] <= 60, state
        assert state['spritePreload']['mode'] == 'extended', state
        assert state['spritePreload']['loaded'] > 0, state
        assert 0 < state['spritePreload']['bytes'] <= 128*1024*1024, state
        assert state['spriteRestoreCache']['budgetBytes'] == 128*1024*1024, state
        assert state['spriteRestoreCache']['hotBudgetBytes'] == 48*1024*1024, state
        assert 0 <= state['spriteRestoreCache']['hotBytes'] <= 48*1024*1024, state
        assert state['spritePreload']['gpuLoaded'] > 0, state
        assert state['spritePreload']['gpuBytes'] > 0, state
        assert gpu['gpuPreloadUploads'] > 0, gpu
        assert gpu['gpuPreloadBytes'] > 0, gpu
        assert page.locator('[data-r8="hotcache"]').count() == 1
        assert page.locator('[data-r8="gpuwarm"]').count() == 1
        assert gpu['textureBudgetBytes'] == 128*1024*1024, gpu
        assert page.locator('[data-r8="preload"]').count() == 1
        assert state['simulationTicks'] >= 10, state
        assert state['simulationBacklogTicks'] >= 0, state
        assert state['compatibility']['id'] == 'mugen-1.1', state
        assert state['compatibility']['certified'] is False
        assert all(isinstance(p['stateOwnerId'], int) and isinstance(p['animationOwnerId'],int)
                   and p['animElem'] >= 1 for p in state['players'])
        assert page.locator('[data-r8="borrowed"]').count() == 1
        assert page.locator('[data-r8="targets"]').count() == 1
        assert page.locator('[data-r8="facing"]').count() == 1
        assert page.locator('[data-r8="movetype"]').count() == 1
        assert page.locator('[data-r8="pendinghits"]').count() == 1
        assert all(p['moveType'] in ('I','H','A') and p['hitPauseTime'] >= 0
                   and (p['pendingStateNo'] is None or isinstance(p['pendingStateNo'],int))
                   for p in state['players'])
        assert all(p['facing'] in (-1, 1) and p['liveTargets'] >= 0 for p in state['players'])
        assert all('duplicateGlobalStates' in c for c in state['compatibility']['characters'])
        assert page.locator('[data-r8="globaldupes"]').count() == 1
        assert state['helperStats']['attempted'] >= state['helperStats']['created']
        assert state['helperStats']['rejected'] >= 0
        assert state['helperFrameStats']['alive'] >= state['helperFrameStats']['submitted']
        assert isinstance(state['helpers'], list)
        assert page.locator('[data-r8="helpers"]').count() == 1
        assert page.locator('[data-r8="helperdraws"]').count() == 1
        summary['checks']['mugen11Helpers'] = {
            'target': state['compatibility']['id'],
            'spawnAttempts': state['helperStats']['attempted'],
            'active': state['helperFrameStats']['alive'],
        }
        summary['checks']['deterministicClock'] = {
            'simulationHz': state['simulationHz'],
            'simulationTicks': state['simulationTicks'],
            'simulationBacklogTicks': state['simulationBacklogTicks'],
        }
        summary['checks']['endlessRules'] = {'enabled':state['endlessMode'], 'round':state['roundNo'], 'timeLeft':state['roundTimeLeft']}
        summary['checks']['r8Telemetry'] = {
            'samples': snapshot['samples'],
            'gpuRawResidentBytes': gpu['textureBytes'],
            'indexedBytes': gpu['indexedTextureBytes'],
            'paletteBytes': gpu['paletteTextureBytes'],
        }
        page.locator('[data-r8-stop]').click()
        assert page.locator('[data-r8-export]').is_enabled()
        csv_text = page.evaluate('window.__kenjatimeR8Benchmark.csv()')
        assert 'r8_index_mib' in csv_text and 'missing_palette_draws' in csv_text and 'endless_mode' in csv_text and 'round_number' in csv_text and 'simulation_hz' in csv_text and 'simulation_ticks' in csv_text and 'simulation_backlog_ticks' in csv_text and 'helpers_alive' in csv_text and 'helpers_missing_state' in csv_text and 'helper_state_map' in csv_text and 'mugen11_p1_duplicate_globals' in csv_text and 'mugen11_p2_duplicate_globals' in csv_text and 'p1_state_owner_id' in csv_text and 'p2_state_owner_id' in csv_text and 'p1_animation_owner_id' in csv_text and 'p2_animation_owner_id' in csv_text and len(csv_text.splitlines()) >= 4
        parsed_csv = list(csv.reader(io.StringIO(csv_text)))
        assert len(parsed_csv) >= 4
        assert len(parsed_csv[0]) == len(parsed_csv[1]) == len(parsed_csv[-1]), (
            'CSV header and sample column counts differ', len(parsed_csv[0]), len(parsed_csv[1]), len(parsed_csv[-1]))
        assert 'p2_state_owner_id' in parsed_csv[0] and 'p2_animation_owner_id' in parsed_csv[0]
        assert 'video_gpu_mib' in parsed_csv[0] and 'video_deferred_frames' in parsed_csv[0]
        assert all(key in parsed_csv[0] for key in [
            'gpu_texture_reuses','sprite_restore_compressed_entries',
            'sprite_restore_saved_raw_mib','sprite_restore_decompressions',
            'frame_packet_build_ms','frame_sprite_restore_ms',
            'frame_renderer_cpu_ms',
            'sprite_preload_mode','sprite_preload_candidates',
            'sprite_preload_attempted','sprite_preload_loaded',
            'sprite_preload_duration_ms','sprite_preload_resident_mib',
            'sprite_cpu_cache_budget_mib',
            'sprite_hot_cache_resident_mib','sprite_hot_cache_budget_mib',
            'sprite_hot_cache_hits','sprite_hot_cache_evictions',
            'sprite_hot_cache_entries','sprite_hot_cache_stores',
            'gpu_preload_uploads','gpu_preload_resident_mib',
            'gpu_preload_duration_ms','gpu_adaptive_cache_upgrades',
            'gameplay_first_frameskip','simulation_debt_change_hz',
            'sprite_hot_admissions_deferred','sprite_hot_promotions',
            'sprite_hot_probation_entries','expression_fallback_executors',
            'expression_fallback_cache_hits'])
        assert all(key in parsed_csv[0] for key in
                   ['p1_facing','p2_facing','p1_live_targets','p2_live_targets',
                    'p1_movetype','p2_movetype','p1_hitpause_ticks','p2_hitpause_ticks',
                    'p1_pending_state_no','p2_pending_state_no',
                    'p1_pending_state_owner_id','p2_pending_state_owner_id'])
        with page.expect_download() as downloaded:
            page.locator('[data-r8-export]').click()
        item = downloaded.value
        assert item.suggested_filename.startswith('kenjatime-r8-pr17-benchmark-')
        summary['checks']['csvExport'] = True
        assert not errors, errors
        page.locator('[data-menu]').click()
        browser.close()
    print(json.dumps(summary, indent=2))
finally:
    server.shutdown()
