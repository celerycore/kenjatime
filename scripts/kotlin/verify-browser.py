"""Verify actual Kotlin/Wasm-combat browser UI, not a JavaScript fallback."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import csv, io, functools, http.server, shutil, threading, json, math, base64, re

ROOT=Path(__file__).resolve().parents[2]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=http.server.ThreadingHTTPServer(("127.0.0.1",0),
    functools.partial(Quiet,directory=str(ROOT/"dist-kotlin")))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f"http://127.0.0.1:{server.server_port}/kotlin/index.html"
result={"source":"kenjatime-kotlin-standard","url":base}
try:
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(
            executable_path=shutil.which("chromium") or playwright.chromium.executable_path,
            headless=True,args=["--no-sandbox","--enable-unsafe-swiftshader"])
        page=browser.new_page(viewport={"width":1000,"height":780},accept_downloads=True)
        errors=[]
        page.on("pageerror",lambda error:errors.append(str(error)))
        page.goto(base,wait_until="domcontentloaded",timeout=30000)
        page.wait_for_function("""() =>
          document.querySelector('#version')?.textContent?.includes('kotlin-wasm-standard') &&
          !document.querySelector('#start')?.disabled
        """,timeout=120000)
        assert "Kotlin" in page.title()
        assert page.locator("#archive").count()==1
        assert page.locator("#p1-select option").count()>=1
        assert page.locator("#p2-select option").count()>=1
        assert page.locator("#preset").is_disabled(), "Missing third-party archives cannot appear installed"
        assert page.locator("#cpu").is_checked()
        assert page.locator("#endless").is_checked()
        assert page.locator(".arena-preview").is_visible()
        assert page.locator("#preview-name-1").inner_text() == "Kung Fu Man"
        page.locator("#start").click()
        page.wait_for_function("""() =>
          document.querySelector('#banner')?.textContent?.includes('60 Hz combat') &&
          document.querySelector('#hz')?.textContent?.includes('Hz')
        """,timeout=120000)
        # Rendering must show actual SFF sprites; the previous Kotlin build
        # always drew rectangular placeholders despite passing engine tests.
        page.wait_for_function("window.__kenjatimeKotlinQA?.spritePaints > 5",
            timeout=30000)
        page.wait_for_function("""() =>
          window.__kenjatimeKotlinQA?.paintedRenderPlan?.frame >= 28 &&
          window.__kenjatimeKotlinQA.paintedRenderPlan.draws
            .filter(draw => draw.kind === 'fighter').every(draw => draw.axisY >= 0 && draw.axisY < 540)
        """)
        plan=page.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        assert plan["targetFps"] in [12,20,30,60],plan
        assert plan["backlog"]>=0,plan
        assert len(plan["health"])==2,plan
        assert len(plan["draws"])>=2,plan
        assert all("spriteScaleX" in draw and "spriteScaleY" in draw
                   for draw in plan["draws"]),plan
        assert page.evaluate("window.__kenjatimeKotlinQA.missingSpriteDraws") < (
            page.evaluate("window.__kenjatimeKotlinQA.spritePaints") * 2)
        assert not page.locator(".arena-preview").is_visible()
        page.locator("#record").click()
        # Editing the next setup must leave the active benchmark's mode intact.
        page.locator("#endless").uncheck()
        page.locator("#ai-level").select_option("8")
        page.wait_for_timeout(2300)
        page.locator("#stop-record").click()
        assert page.locator("#csv").is_enabled()
        with page.expect_download() as download_event:
            page.locator("#csv").click()
        download=download_event.value
        assert download.suggested_filename.startswith("kenjatime-kotlin-wasm-")
        csv_text=Path(download.path()).read_text()
        data=list(csv.DictReader(io.StringIO(csv_text)))
        assert len(data)>=2,data
        assert all(row["endless_mode"]=="1" and row["cpu_level"]=="4" for row in data), data
        page.locator("#endless").check()
        page.locator("#ai-level").select_option("4")
        assert all(row["engine_backend"]=="Kotlin/WASM" for row in data)
        assert all(row["engine_version"].endswith("kotlin-wasm-standard") for row in data)
        assert all(row["simulation_ticks"] for row in data)
        assert max(float(r["simulation_ticks"]) for r in data)>=50
        assert all(row["device_os"]!="Unknown" for row in data)
        assert all(row["browser_name"]!="Unknown" for row in data)
        assert all(row["p1_character"]==row["p2_character"] for row in data)
        visuals = [json.loads(row["visual_diagnostics"]) for row in data if row["visual_diagnostics"]]
        assert visuals and all(0 < v["frame"] and 0 < v["cameraZoom"] <= 1 for v in visuals), visuals
        assert any(len(v["fighters"]) == 2 and all(
            f["width"] > 0 and f["height"] > 0 and isinstance(f["state"], int)
            for f in v["fighters"]
        ) for v in visuals), visuals
        assert not errors,errors
        # Exercise the REAL Wasm-backed RAR decoder, including split Nu-13-style
        # script and SFF archives; avoid a mock-file shortcut that cannot catch
        # the Android "both async and sync fetching of wasm failed" bug.
        page.locator("#reset").click()
        page.wait_for_function("""() =>
          document.querySelector('#banner').dataset.phase === 'ready' &&
          !document.querySelector('#arena-box').classList.contains('has-frame') &&
          window.__kenjatimeKotlinQA.lastVisualFrame === 0
        """)
        page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-script.rar"))
        page.wait_for_function("""()=>
          document.querySelector('#setup-status')?.textContent?.includes('incomplete') &&
          !document.querySelector('#archive')?.disabled
        """, timeout=45000)
        page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-sprite.rar"))
        page.wait_for_function("""()=>
          window.__kenjatimeKotlinQA?.importedCount > 0 &&
          !document.querySelector('#archive')?.disabled
        """, timeout=45000)
        assert "Import failed" not in page.locator("#setup-status").inner_text()
        assert "wasm failed" not in page.locator("#setup-status").inner_text().lower()
        assert page.evaluate("window.__kenjatimeKotlinQA.importedCount")>=1
        result["rarCompanionImport"]="passed"
        page.locator("#p1-select").select_option(label="Kung Fu Man · Imported combined character archives")
        page.locator("#start").click()
        page.wait_for_function("window.__kenjatimeKotlinQA.lastVisualFrame > 20",timeout=30000)
        result["importedCharacterRendered"]=True
        imported_plan=page.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        assert len(imported_plan["draws"])>=2,imported_plan
        assert imported_plan["draws"][0]["spriteScaleX"]>0
        assert imported_plan["draws"][0]["spriteScaleY"]>0
        result["kotlinRenderPlan"]=True

        preset = browser.new_page(viewport={"width": 1000, "height": 780})
        preset.goto(base, wait_until="domcontentloaded", timeout=30000)
        preset.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        fixture_dir = ROOT / "test-output"
        preset.locator("#archive").set_input_files(str(fixture_dir / "kotlin-nu13-preset.zip"))
        preset.wait_for_function("""() => !document.querySelector('#archive').disabled &&
          document.querySelector('#setup-status').textContent.includes('Installed: Nu-13')""", timeout=45000)
        assert preset.locator("#preset").is_disabled()
        assert preset.locator("#preset-status").inner_text() == "Import Tomoka Minato to enable this preset."
        preset.locator("#p2-select").select_option("installed:nu13/nu13.def")

        preset.locator("#archive").set_input_files(str(fixture_dir / "kotlin-tomoka-preset-scripts.zip"))
        preset.wait_for_function("""() => !document.querySelector('#archive').disabled &&
          document.querySelector('#setup-status').textContent.includes('Tomoka training fixture is incomplete')""",
          timeout=45000)
        assert preset.locator("#preset").is_disabled()
        assert "tomoka.sff" in preset.locator("#setup-status").inner_text()

        preset.locator("#archive").set_input_files(str(fixture_dir / "kotlin-tomoka-preset-sff.zip"))
        preset.wait_for_function("!document.querySelector('#preset')?.disabled", timeout=45000)
        preset.locator("#endless").uncheck()
        preset.locator("#cpu").uncheck()
        preset.locator("#preset").click()
        assert preset.locator("#p1-select").input_value() == "installed:tomoka/tomoka.def"
        assert preset.locator("#p2-select").input_value() == "installed:nu13/nu13.def"
        assert preset.locator("#endless").is_checked() and preset.locator("#cpu").is_checked()
        preset.locator("#start").click()
        preset.wait_for_function("window.__kenjatimeKotlinQA?.lastVisualFrame>30", timeout=15000)
        result["presetMissingArchiveThenAuthoredIdentity"] = "passed"
        preset.close()

        idle = browser.new_page(viewport={"width": 390, "height": 844})
        idle.goto(base, wait_until="domcontentloaded", timeout=30000)
        idle.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        idle.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-idle-scale.zip"))
        idle.wait_for_function("window.__kenjatimeKotlinQA?.importedCount===1", timeout=45000)
        idle.locator("#p1-select").select_option("installed:idle-scale/idle-scale.def")
        idle.locator("#cpu").uncheck()
        idle.locator("#start").click()
        idle.wait_for_function("window.__kenjatimeKotlinQA?.paintedRenderPlan?.frame >= 220", timeout=20000)
        painted = idle.evaluate("""() => {
          const qa = window.__kenjatimeKotlinQA;
          return {draw: qa.paintedRenderPlan.draws.find(d => d.side === 0 && d.kind === 'fighter'),
            transform: qa.lastActorTransformPaint};
        }""")
        assert painted["draw"]["spriteScaleX"] <= 1.42 * (320 / 1008) + 1e-9, painted
        assert math.isclose(painted["transform"]["a"], painted["draw"]["transformA"], abs_tol=1e-6), painted
        result["idleScaleResetsAcrossCycles"] = "passed"
        idle.close()

        pcx = browser.new_page(viewport={"width": 390, "height": 844})
        pcx.goto(base, wait_until="domcontentloaded", timeout=30000)
        pcx.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        pcx.locator("#archive").set_input_files(str(fixture_dir / "kotlin-pcx-prefix.zip"))
        pcx.wait_for_function("window.__kenjatimeKotlinQA?.importedCount===1", timeout=45000)
        for side in (1, 2):
            pcx.locator(f"#p{side}-select").select_option("installed:pcx-prefix/pcx-prefix.def")
        pcx.locator("#cpu").uncheck()
        pcx.locator("#start").click()
        pcx.wait_for_function("""() => {
          const qa = window.__kenjatimeKotlinQA;
          const draws = qa?.lastSpritePaintOrder?.draws ?? [];
          return qa?.paintedRenderPlan?.frame > 5 && draws.filter(d => d.kind === 'fighter').length === 2;
        }""", timeout=10000)
        assert pcx.evaluate("window.__kenjatimeKotlinQA.missingSpriteDraws") == 0
        result["incompletePcxPrefixPainted"] = "passed"
        pcx.close()

        helpers = browser.new_page(viewport={"width": 1000, "height": 780}, accept_downloads=True)
        helpers.goto(base, wait_until="domcontentloaded", timeout=30000)
        helpers.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        helpers.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-helper-loop.zip"))
        helpers.wait_for_function("window.__kenjatimeKotlinQA?.importedCount===1", timeout=45000)
        helpers.locator("#p1-select").select_option("installed:helper-loop/helper-loop.def")
        helpers.locator("#start").click()
        helpers.wait_for_function("window.__kenjatimeKotlinQA?.renderPlan?.frame>=45", timeout=15000)
        helper_plan = helpers.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        assert helper_plan["helpers"] == 2
        assert all(d["spriteScaleX"] == 1 for d in helper_plan["draws"] if d["kind"] == "fighter"), helper_plan
        assert sum(d["spriteScaleX"] > 2 for d in helper_plan["draws"] if d["kind"] == "helper") == 2, helper_plan
        assert helpers.evaluate("""() => {
          const qa=window.__kenjatimeKotlinQA;
          const canvas=document.querySelector('#arena');
          const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
          for(let i=0;i<pixels.length;i+=4){
            if(pixels[i]===166 && pixels[i+1]===221 && pixels[i+2]===132)return false;
            if(pixels[i]===140 && pixels[i+1]===196 && pixels[i+2]===234)return false;
          }
          return qa.missingSpriteDraws>0 && qa.spritePaints>0;
        }"""), "Missing helper sprites must not paint colored rectangles"
        helpers.locator("#record").click()
        helpers.wait_for_function("""() =>
          /Recording [2-9] samples/.test(document.querySelector('#record-status').textContent)
        """, timeout=15000)
        helpers.locator("#stop-record").click()
        with helpers.expect_download() as helper_csv:
            helpers.locator("#csv").click()
        helper_rows = list(csv.DictReader(io.StringIO(Path(helper_csv.value.path()).read_text())))
        assert len(helper_rows) >= 2 and all(row["helpers_alive"] == "2" for row in helper_rows)
        assert int(helper_rows[-1]["simulation_ticks"]) > int(helper_rows[0]["simulation_ticks"])
        for row in helper_rows:
            diagnostics = json.loads(row["helper_diagnostics"])
            assert diagnostics["blockedSpawns"] == 0, diagnostics
            assert {item["id"] for item in diagnostics["active"]} == {71, 72}, diagnostics
            assert isinstance(json.loads(row["engine_issues"]), list)
            assert row["source_commit"]
        helpers.locator("#pause").click()
        helpers.wait_for_function("""() =>
          document.querySelector('#banner').dataset.phase === 'paused' &&
          window.__kenjatimeKotlinQA.paintedRenderPlan?.frame === window.__kenjatimeKotlinQA.lastVisualFrame
        """)
        paints = helpers.evaluate("window.__kenjatimeKotlinQA.spritePaints")
        helpers.wait_for_timeout(200)
        assert helpers.evaluate("window.__kenjatimeKotlinQA.spritePaints") == paints
        helpers.close()
        result["rootHelperWatchersAndUniqueBenchmarkFrames"] = "passed"

        # A separate context imports public KFM art with a synthetic Explod
        # controller, then requires decoded effect sprites to reach Canvas.
        effects=browser.new_page(viewport={"width":1000,"height":780})
        effect_errors=[]
        effects.on("pageerror",lambda error:effect_errors.append(str(error)))
        effects.goto(base,wait_until="domcontentloaded",timeout=30000)
        effects.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        effects.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-explod.zip"))
        effects.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=effects.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        effects.locator("#p1-select").select_option(value=installed)
        effects.locator("#start").click()
        effects.wait_for_function("window.__kenjatimeKotlinQA?.explodPaints>5",timeout=30000)
        effect_plan=effects.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        effect=next(d for d in effect_plan["draws"] if d["kind"]=="explod")
        assert effect["effectId"]==701,effect
        assert effect["side"]==0,effect
        assert effect["spriteScaleX"]==0.5 and effect["spriteScaleY"]==0.5,effect
        assert effect["sprpriority"]<0,effect
        painted=effects.evaluate("window.__kenjatimeKotlinQA.lastExplodPaint")
        assert abs(painted["scaleX"]-painted["plannedScaleX"])<0.00001,painted
        assert abs(painted["scaleY"]-painted["plannedScaleY"])<0.00001,painted
        assert not effect_errors,effect_errors
        result["realExplodSpritePaints"]=effects.evaluate("window.__kenjatimeKotlinQA.explodPaints")
        effects.close()

        priority_page=browser.new_page(viewport={"width":1000,"height":780})
        priority_errors=[]
        priority_page.on("pageerror",lambda error:priority_errors.append(str(error)))
        priority_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        priority_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        priority_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-priority.zip"))
        priority_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=priority_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        priority_page.locator("#p1-select").select_option(value=installed)
        priority_page.locator("#cpu").uncheck()
        priority_page.locator("#start").click()
        for actor_priority in [-4,5]:
            priority_page.wait_for_function("""priority => {
              const draws=window.__kenjatimeKotlinQA?.lastSpritePaintOrder?.draws||[];
              return draws.some(d=>d.kind==='fighter'&&d.side===0&&d.priority===priority)&&
                draws.some(d=>d.kind==='helper'&&d.priority===-3)&&
                draws.some(d=>d.kind==='projectile'&&d.priority===0)&&
                draws.some(d=>d.kind==='explod'&&d.priority===2);
            }""",arg=actor_priority,timeout=30000)
            painted=priority_page.evaluate("window.__kenjatimeKotlinQA.lastSpritePaintOrder")
            values=[d["priority"] for d in painted["draws"]]
            assert values==sorted(values),painted
            actor_index=next(i for i,d in enumerate(painted["draws"]) if d["kind"]=="fighter" and d["side"]==0)
            effect_index=next(i for i,d in enumerate(painted["draws"]) if d["kind"]=="explod")
            assert (actor_index<effect_index) if actor_priority<2 else (actor_index>effect_index),painted
        assert not priority_errors,priority_errors
        result["spritePriorityCanvasOrder"]="passed"
        priority_page.close()

        angles=browser.new_page(viewport={"width":1000,"height":780})
        angle_errors=[]
        angles.on("pageerror",lambda error:angle_errors.append(str(error)))
        angles.goto(base,wait_until="domcontentloaded",timeout=30000)
        angles.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        angles.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-angle.zip"))
        angles.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=angles.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        angles.locator("#p1-select").select_option(value=installed)
        angles.locator("#cpu").uncheck()
        angles.locator("#start").click()
        for facing,rotation in [(1,90),(-1,-210)]:
            painted=angles.wait_for_function("""expected => {
              const paint=window.__kenjatimeKotlinQA?.lastActorTransformPaint;
              return paint?.angleDraw&&paint.facing===expected.facing&&
                paint.rotationDegrees===expected.rotation ? paint : false;
            }""",arg={"facing":facing,"rotation":rotation},timeout=30000).json_value()
            c,s=math.cos(math.radians(rotation)),math.sin(math.radians(rotation))
            zoom=painted["cameraZoom"]
            expected={"a":c*2*1.4*facing*zoom,"b":-s*2*1.1*facing*zoom,
                      "c":s*(-.5)*1.4*zoom,"d":c*(-.5)*1.1*zoom}
            for axis,value in expected.items():
                assert abs(painted[axis]-value)<1e-5,painted
                assert abs(painted[axis]-painted["planned"+axis.upper()])<1e-5,painted
            for axis in ["x","y"]:
                assert abs(painted[axis]-painted["planned"+axis.upper()])<1e-4,painted
        assert not angle_errors,angle_errors
        result["angleDrawCanvasTransform"]="passed"
        angles.close()

        bodies=browser.new_page(viewport={"width":1000,"height":780})
        body_errors=[]
        bodies.on("pageerror",lambda error:body_errors.append(str(error)))
        bodies.goto(base,wait_until="domcontentloaded",timeout=30000)
        bodies.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        bodies.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-body-space.zip"))
        bodies.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=bodies.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        for selector in ["#p1-select","#p2-select"]:
            bodies.locator(selector).select_option(value=installed)
        bodies.locator("#cpu").uncheck()
        bodies.locator("#start").click()
        for gap in [10,70,30]:
            observed=bodies.wait_for_function("""gap => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastActorTransformPaint;
              const roots=plan?.draws.filter(d=>d.kind==='fighter')||[];
              if(roots.length!==2||roots.some(d=>d.action!==706)||paint?.frame!==plan.frame)return false;
              const distance=Math.abs(roots[1].x-roots[0].x)/(1.4*plan.cameraZoom);
              return Math.abs(distance-gap)<1e-6 ? {plan,paint} : false;
            }""",arg=gap,timeout=30000).json_value()
            plan,paint=observed["plan"],observed["paint"]
            actor=next(d for d in plan["draws"] if d["kind"]=="fighter" and d["side"]==0)
            assert abs(paint["x"]-actor["x"])<1e-4,observed
            assert abs(paint["a"]-1.4*plan["cameraZoom"])<1e-5,observed
            assert abs(paint["d"]-1.1*plan["cameraZoom"])<1e-5,observed
        assert not body_errors,body_errors
        result["playerPushWidthCanvasSpacing"]="passed"
        bodies.close()

        proximity=browser.new_page(viewport={"width":1000,"height":780})
        proximity_errors=[]
        proximity.on("pageerror",lambda error:proximity_errors.append(str(error)))
        proximity.goto(base,wait_until="domcontentloaded",timeout=30000)
        proximity.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        proximity.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-guard-distance.zip"))
        proximity.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=proximity.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        for selector in ["#p1-select","#p2-select"]:
            proximity.locator(selector).select_option(value=installed)
        proximity.locator("#cpu").uncheck()
        proximity.locator("#start").click()
        for action in [708,709,708]:
            proximity.wait_for_function("""action => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paints=qa?.lastSpritePaintOrder;
              return !!plan&&!!paints&&paints.frame===plan.frame&&
                paints.draws.some(d=>d.kind==='fighter'&&d.side===1)&&
                plan.draws.some(d=>d.kind==='fighter'&&d.side===1&&d.action===action);
            }""",arg=action,timeout=30000)
        assert not proximity_errors,proximity_errors
        result["guardDistanceCnsAnimation"]="passed"
        proximity.close()

        maps_page=browser.new_page(viewport={"width":1000,"height":780})
        map_errors=[]
        maps_page.on("pageerror",lambda error:map_errors.append(str(error)))
        maps_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        maps_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        maps_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-named-maps.zip"))
        maps_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=maps_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        maps_page.locator("#p1-select").select_option(value=installed)
        maps_page.locator("#cpu").uncheck()
        maps_page.locator("#start").click()
        for action in [710,711,710]:
            maps_page.wait_for_function("""action => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastActorTransformPaint;
              return !!plan&&!!paint&&paint.frame===plan.frame&&
                plan.draws.some(d=>d.kind==='helper')&&
                plan.draws.some(d=>d.kind==='fighter'&&d.side===0&&d.action===action);
            }""",arg=action,timeout=30000)
        assert not map_errors,map_errors
        result["namedMapCnsRootCounter"]="passed"
        maps_page.close()

        environment_page=browser.new_page(viewport={"width":1000,"height":780})
        environment_errors=[]
        environment_page.on("pageerror",lambda error:environment_errors.append(str(error)))
        environment_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        environment_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        environment_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-environment.zip"))
        environment_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=environment_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        environment_page.locator("#p1-select").select_option(value=installed)
        environment_page.locator("#cpu").uncheck()
        environment_page.locator("#start").click()
        for mode in ["under","over","expired"]:
            observed=environment_page.wait_for_function("""mode => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastEnvironmentPaint;
              if(!plan||!paint||paint.frame!==plan.frame||qa.lastSpritePaintOrder?.frame!==plan.frame)return false;
              const color=plan.environment?.color;
              if(mode==='under'&&(!color?.under||Math.abs(plan.stageOffsetY)<1||qa.lastActorTransformPaint?.frame!==plan.frame))return false;
              if(mode==='under'&&!plan.draws.some(d=>d.kind==='fighter'&&d.side===0&&d.action===712))return false;
              if(mode==='over'&&(!color||color.under))return false;
              if(mode==='expired'&&(color||plan.environment?.shake))return false;
              const canvas=document.querySelector('#arena'),ctx=canvas.getContext('2d'),scale=canvas.width/960;
              const pixel=Array.from(ctx.getImageData(Math.round(10*scale),Math.round(100*scale),1,1).data);
              let foregroundPixels=0;
              if(mode==='over'){
                const region=ctx.getImageData(Math.round(450*scale),Math.round(100*scale),Math.round(60*scale),Math.round(390*scale)).data;
                for(let i=0;i<region.length;i+=4)if(region[i]!==12||region[i+1]!==34||region[i+2]!==56)foregroundPixels++;
                if(foregroundPixels===0)return false;
              }
              return {plan,paint,pixel,foregroundPixels,draws:qa.lastSpritePaintOrder.draws,actor:qa.lastActorTransformPaint};
            }""",arg=mode,timeout=30000).json_value()
            plan=observed["plan"]
            assert observed["pixel"]==([16,35,56,255] if mode=="expired" else [12,34,56,255]),observed
            if mode=="under":
                assert any(d["kind"]=="fighter" for d in observed["draws"]),observed
                expected_y=435-plan["cameraY"]*1.1*plan["cameraZoom"]+plan["stageOffsetY"]
                assert abs(observed["actor"]["y"]-expected_y)<1e-4,observed
            elif mode=="over":
                assert len(plan["draws"])==1 and plan["draws"][0]["effectId"]==712,observed
                assert len(observed["draws"])==1 and observed["draws"][0]["kind"]=="explod",observed
                assert observed["foregroundPixels"]>0,observed
            else:
                assert plan["stageOffsetY"]==0,observed
        assert not environment_errors,environment_errors
        result["environmentCanvasPixelsAndShake"]="passed"
        environment_page.close()

        fall_shake_page=browser.new_page(viewport={"width":1000,"height":780})
        fall_shake_errors=[]
        fall_shake_page.on("pageerror",lambda error:fall_shake_errors.append(str(error)))
        fall_shake_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        fall_shake_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        fall_shake_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-fall-shake.zip"))
        fall_shake_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=fall_shake_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        fall_shake_page.locator("#p1-select").select_option(value=installed)
        fall_shake_page.locator("#cpu").uncheck()
        fall_shake_page.locator("#start").click()
        for mode in ["impact","fall","expired"]:
            observed=fall_shake_page.wait_for_function("""mode => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastEnvironmentPaint,actor=qa?.lastActorTransformPaint;
              if(!plan||!paint||!actor||paint.frame!==plan.frame||actor.frame!==plan.frame)return false;
              const victim=plan.draws.find(d=>d.kind==='fighter'&&d.side===1);
              if(!victim)return false;
              const expected=mode==='impact'?6:mode==='fall'?12:0;
              if(plan.environment?.offsetY!==expected)return false;
              if(victim.action!==(mode==='impact'?715:716))return false;
              if(mode==='expired'&&plan.environment.shake)return false;
              const canvas=document.querySelector('#arena'),ctx=canvas.getContext('2d'),scale=canvas.width/960;
              const line=Array.from(ctx.getImageData(Math.round(10*scale),Math.round((438+plan.stageOffsetY)*scale),1,1).data);
              return {plan,paint,actor,line};
            }""",arg=mode,timeout=30000).json_value()
            plan=observed["plan"]
            offset={"impact":6,"fall":12,"expired":0}[mode]
            assert abs(plan["stageOffsetY"]-offset*1.1*plan["cameraZoom"])<1e-8,observed
            expected_y=435-(plan["cameraY"]+45)*1.1*plan["cameraZoom"]+plan["stageOffsetY"]
            assert abs(observed["actor"]["y"]-expected_y)<1e-4,observed
            assert observed["line"]==[83,123,117,255],observed
        assert not fall_shake_errors,fall_shake_errors
        result["impactAndDeferredFallShakeCanvas"]="passed"
        fall_shake_page.close()

        bounds_page=browser.new_page(viewport={"width":1000,"height":780})
        bounds_errors=[]
        bounds_page.on("pageerror",lambda error:bounds_errors.append(str(error)))
        bounds_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        bounds_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        bounds_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-screen-bound.zip"))
        bounds_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=bounds_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        for select in ["#p1-select","#p2-select"]:
            bounds_page.locator(select).select_option(value=installed)
        bounds_page.locator("#cpu").uncheck()
        bounds_page.locator("#start").click()
        frozen=None
        for mode in ["unbound","tracking","frozen"]:
            observed=bounds_page.wait_for_function("""mode => {
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastActorTransformPaint;
              if(!plan||plan.frame<1||!paint||paint.frame!==plan.frame)return false;
              const actor=plan.draws.find(d=>d.kind==='fighter'&&d.side===0);
              if(actor?.action!==({unbound:717,tracking:718,frozen:719}[mode]))return false;
              if(mode==='tracking'&&plan.cameraY>=-95)return false;
              return {plan,paint,actor};
            }""",arg=mode,timeout=30000).json_value()
            plan=observed["plan"]
            assert plan["cameraX"]==0 and plan["cameraZoom"]==1,observed
            expected_x=900 if mode=="unbound" else 830
            assert abs(observed["paint"]["x"]-expected_x)<1e-4,observed
            air_offset=0 if mode=="unbound" else -45
            actor_y=0 if mode=="unbound" else -120
            expected_y=435+(actor_y+air_offset-plan["cameraY"])*1.1
            assert abs(observed["paint"]["y"]-expected_y)<1e-4,observed
            if mode=="unbound":
                assert plan["cameraY"]==0,observed
            if mode=="frozen":
                frozen=plan
        later=bounds_page.wait_for_function("""frame=>{
          const p=window.__kenjatimeKotlinQA?.renderPlan;return p?.frame>frame+12?p:false;
        }""",arg=frozen["frame"],timeout=10000).json_value()
        assert later["cameraY"]==frozen["cameraY"] and later["cameraX"]==frozen["cameraX"],(frozen,later)
        assert later["cameraZoom"]==frozen["cameraZoom"],(frozen,later)
        assert not bounds_errors,bounds_errors
        result["screenBoundEdgesAndCameraCanvas"]="passed"
        bounds_page.close()

        input_page=browser.new_page(viewport={"width":1000,"height":780})
        input_errors=[]
        input_page.on("pageerror",lambda error:input_errors.append(str(error)))
        input_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        input_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        input_page.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-assert-input.zip"))
        input_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=input_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        input_page.locator("#p1-select").select_option(value=installed)
        input_page.locator("#cpu").uncheck()
        input_page.locator("#start").click()
        for action in [721,722,723]:
            observed=input_page.wait_for_function("""action=>{
              const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastActorTransformPaint;
              if(!plan||!paint||paint.frame!==plan.frame||qa.lastSpritePaintOrder?.frame!==plan.frame)return false;
              const root=plan.draws.find(d=>d.kind==='fighter'&&d.side===0);
              const helper=plan.draws.find(d=>d.kind==='helper'&&d.side===0);
              if(root?.action!==action||helper?.action!==726)return false;
              return {plan,paint,root,helper,draws:qa.lastSpritePaintOrder.draws};
            }""",arg=action,timeout=30000).json_value()
            assert observed["root"]["number"]=={721:0,722:1,723:2}[action],observed
            assert observed["helper"]["number"]==1,observed
            assert any(d["kind"]=="helper" for d in observed["draws"]),observed
            assert abs(observed["paint"]["x"]-observed["root"]["x"])<1e-4,observed
            assert abs(observed["paint"]["y"]-observed["root"]["y"])<1e-4,observed
        assert not input_errors,input_errors
        result["assertInputCommandAndHelperCanvas"]="passed"
        input_page.close()

        # Independent RGB equations exercise the real host painter, including
        # transparent holes, untouched pixels, mirroring and context restoration.
        blend_source=base64.b64encode((ROOT/"src/kotlin/sprite-blend.js").read_bytes()).decode()
        pixel_matrix=page.evaluate("""async module=>{
          const {paintBlendedSprite}=await import(module),s=document.createElement('canvas');s.width=3;s.height=1;
          const sc=s.getContext('2d');sc.putImageData(new ImageData(new Uint8ClampedArray([100,30,50,255,200,80,80,255,0,0,0,0]),3,1),0,0);
          const mask=document.createElement('canvas');mask.width=3;mask.height=1;
          const mc=mask.getContext('2d');mc.drawImage(s,0,0);mc.globalCompositeOperation='source-in';mc.fillStyle='#fff';mc.fillRect(0,0,3,1);
          const modes=[{mode:'normal',source:256,destination:0},{mode:'sub',source:256,destination:256}];
          for(const source of [0,64,128,256])for(const destination of [0,64,128,256])modes.push({mode:'add',source,destination});
          const rows=[];
          for(const mode of modes)for(const mirror of [false,true]){
            const c=document.createElement('canvas');c.width=4;c.height=1;const x=c.getContext('2d',{alpha:false});
            x.fillStyle='rgb(40,70,120)';x.fillRect(0,0,4,1);x.globalAlpha=.5;
            if(mirror){x.translate(4,0);x.scale(-1,1)}
            paintBlendedSprite(x,s,0,0,mode,()=>mask);
            rows.push({mode,mirror,pixels:[...x.getImageData(0,0,4,1).data],alpha:x.globalAlpha,composite:x.globalCompositeOperation});
          }return rows;
        }""","data:text/javascript;base64,"+blend_source)
        background=[40,70,120]
        for row in pixel_matrix:
            expected=[]
            for source in [[100,30,50],[200,80,80],None,None]:
                if source is None:
                    color=background
                elif row["mode"]["mode"]=="normal":
                    color=source
                elif row["mode"]["mode"]=="sub":
                    color=[max(d-s,0) for s,d in zip(source,background)]
                else:
                    color=[min(255,round(s*row["mode"]["source"]/256+d*row["mode"]["destination"]/256)) for s,d in zip(source,background)]
                expected.append(color+[255])
            if row["mirror"]:
                expected=list(reversed(expected))
            assert all(abs(a-b)<=1 for a,b in zip(row["pixels"],[v for pixel in expected for v in pixel])),row
            assert row["alpha"]==.5 and row["composite"]=="source-over",row
        result["spriteBlendRgbMatrix"]=len(pixel_matrix)

        blend_page=browser.new_page(viewport={"width":1000,"height":780})
        blend_errors=[]
        blend_page.on("pageerror",lambda error:blend_errors.append(str(error)))
        blend_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        blend_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        blend_page.locator("#archive").set_input_files(str(ROOT/"test-output/kotlin-kfm-trans.zip"))
        blend_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=blend_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        blend_page.locator("#p1-select").select_option(value=installed)
        blend_page.locator("#cpu").uncheck();blend_page.locator("#start").click()
        samples=json.loads((ROOT/"test-output/kotlin-trans-samples.json").read_text())
        modes=[("normal",256,0),("add",256,256),("add",256,0),("add",256,128),("add",128,128),
               ("sub",256,256),("add",64,192),("add",64,192),("add",0,256),("add",0,0)]
        for phase,(mode,source_alpha,destination_alpha) in enumerate(modes):
            observed=blend_page.wait_for_function("""({phase,fixture})=>{
              const qa=window.__kenjatimeKotlinQA,p=qa?.paintedRenderPlan,paint=qa?.lastActorTransformPaint;
              if(!p||p.frame<1||!paint||paint.frame!==p.frame||qa.lastSpritePaintOrder?.frame!==p.frame)return false;
              const actor=p.draws.find(d=>d.kind==='fighter'&&d.side===0);
              if(actor?.action!==728||actor.sprpriority!==phase-5||p.environment?.color?.red!==40)return false;
              const c=document.querySelector('#arena'),x=c.getContext('2d'),scale=c.width/960;
              const pixels=fixture.samples.map(s=>{
                const sx=s.x-fixture.axisX+.5,sy=s.y-fixture.axisY+.5;
                const px=actor.x+actor.transformA*sx+actor.transformC*sy,py=actor.y+actor.transformB*sx+actor.transformD*sy;
                return [...x.getImageData(Math.floor(px*scale),Math.floor(py*scale),1,1).data];
              });
              return {actor,pixels,paint:qa.lastSpritePaintOrder.draws.find(d=>d.kind==='fighter'&&d.side===0)};
            }""",arg={"phase":phase,"fixture":samples},timeout=30000).json_value()
            assert observed["actor"]["blend"]=={"mode":mode,"source":source_alpha,"destination":destination_alpha},observed
            for sample,pixel in zip(samples["samples"],observed["pixels"]):
                source=sample["rgba"][:3]
                if sample["rgba"][3]==0:
                    expected=background
                elif mode=="normal":
                    expected=source
                elif mode=="sub":
                    expected=[max(d-s,0) for s,d in zip(source,background)]
                else:
                    expected=[min(255,round(s*source_alpha/256+d*destination_alpha/256)) for s,d in zip(source,background)]
                assert all(abs(a-b)<=2 for a,b in zip(pixel,expected+[255])),(phase,sample,pixel,expected,observed)
            assert observed["paint"]["blendPasses"]==(3 if mode=="sub" else 1 if mode=="normal" else int(destination_alpha<256)+int(source_alpha>0)),observed
        assert not blend_errors,blend_errors
        result["transAirAndCnsCanvasPixels"]="passed"
        blend_page.close()

        clipboard_page=browser.new_page(viewport={"width":1000,"height":780})
        clipboard_errors=[]
        clipboard_page.on("pageerror",lambda error:clipboard_errors.append(str(error)))
        clipboard_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        clipboard_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        clipboard_page.locator("#archive").set_input_files(str(ROOT/"test-output/kotlin-kfm-clipboard.zip"))
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=clipboard_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        clipboard_page.locator("#p1-select").select_option(value=installed)
        clipboard_page.locator("#cpu").uncheck();clipboard_page.locator("#start").click()
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA?.renderPlan?.frame>2",timeout=30000)
        assert clipboard_page.evaluate("window.__kenjatimeKotlinQA.clipboards") is None
        assert not clipboard_page.locator("#cns-debug").evaluate("el=>el.open")
        clipboard_page.locator("#cns-debug summary").click()
        message=clipboard_page.wait_for_function("""()=>{
          const p=window.__kenjatimeKotlinQA?.clipboards;
          return p?.rows[0]?.text.includes('root=42 f=1.25')&&p.rows.some(r=>r.id!==r.rootId&&r.text==='helper=0')?p:false;
        }""",timeout=30000).json_value()
        assert '\n    quote="; 猫 <img id=clipboard-injected' in message["rows"][0]["text"],message
        assert '100%' in message["rows"][0]["text"],message
        assert clipboard_page.locator("#clipboard-injected").count()==0
        assert 'Player 1' in clipboard_page.locator("#clipboard-output").inner_text()
        assert 'Helper ' in clipboard_page.locator("#clipboard-output").inner_text()
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA?.clipboards?.rows[0]?.text.endsWith('\\nline=30')",timeout=30000)
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA?.clipboards?.rows[0]?.text===''",timeout=30000)
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA?.clipboards?.rows[0]?.text==='after clear'",timeout=30000)
        old_frame=clipboard_page.evaluate("window.__kenjatimeKotlinQA.clipboards.frame")
        clipboard_page.locator("#cns-debug summary").click()
        clipboard_page.wait_for_function("frame=>window.__kenjatimeKotlinQA.renderPlan.frame>frame+20",arg=old_frame,timeout=10000)
        assert clipboard_page.evaluate("window.__kenjatimeKotlinQA.clipboards.frame")==old_frame
        clipboard_page.locator("#cns-debug summary").click()
        clipboard_page.wait_for_function("frame=>window.__kenjatimeKotlinQA.clipboards?.frame>frame",arg=old_frame,timeout=10000)
        assert "clipboards" not in clipboard_page.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        clipboard_page.locator("#reset").click()
        clipboard_page.wait_for_function("window.__kenjatimeKotlinQA.clipboards===null",timeout=10000)
        assert clipboard_page.locator("#clipboard-output").inner_text()=="Match stopped."
        assert not clipboard_errors,clipboard_errors
        result["actorClipboardDebugPanel"]="passed"
        clipboard_page.close()

        def palette_rgb(source,layers):
            rgb=list(source)
            for layer in layers:
              for _ in range(layer.get("repeat",1)):
                grey=(rgb[0]*299+rgb[1]*587+rgb[2]*114)/1000
                mixed=[v*layer["color"]/256+grey*(256-layer["color"])/256 for v in rgb]
                if layer["invert"]:
                    mixed=[255-v for v in mixed]
                rgb=[max(0,min(255,(v+a)*m/256+p)) for v,a,m,p in zip(mixed,layer["add"],layer["mul"],layer.get("post",[0,0,0]))]
            return [max(0,min(255,math.floor(v+1e-9))) for v in rgb]
        def palette_layer(add=(0,0,0),mul=(256,256,256),color=256,invert=False):
            return {"add":list(add),"mul":list(mul),"color":color,"invert":invert}
        palette_layers=[[],[palette_layer(add=(20,-50,100))],[palette_layer(mul=(128,512,0))],
            [palette_layer(color=0)],[palette_layer(invert=True)],[palette_layer(color=128)],
            [palette_layer(add=(10,0,-10),mul=(256,128,512),color=0,invert=True)],
            [palette_layer(add=(20,0,0)),palette_layer(mul=(128,256,256),invert=True)],
            [palette_layer(mul=(128,256,256),invert=True),palette_layer(add=(20,0,0))],
            [{**palette_layer(add=(10,20,30),mul=(128,256,512),color=128,invert=True),"post":[5,0,10]}],
            [{**palette_layer(add=(10,0,20),mul=(166.4,192,128)),"repeat":58}]]
        palette_module="data:text/javascript;base64,"+base64.b64encode((ROOT/"src/kotlin/sprite-palette.js").read_bytes()).decode()
        palette_matrix=page.evaluate("""async({module,layers})=>{
          const {paletteRgba}=await import(module),source=new Uint8ClampedArray([100,30,50,255,250,0,200,128,0,0,0,0,17,88,240,255]);
          return {rows:layers.map(list=>[...paletteRgba(source,list)]),source:[...source]};
        }""",{"module":palette_module,"layers":palette_layers})
        raw_rgba=[100,30,50,255,250,0,200,128,0,0,0,0,17,88,240,255]
        assert palette_matrix["source"]==raw_rgba
        for layers,row in zip(palette_layers,palette_matrix["rows"]):
            expected=[]
            for offset in range(0,len(raw_rgba),4):
                rgba=raw_rgba[offset:offset+4]
                expected+=(palette_rgb(rgba[:3],layers) if rgba[3] else rgba[:3])+[rgba[3]]
            assert all(abs(a-b)<=1 for a,b in zip(row,expected)),(layers,row,expected)
            assert row[3::4]==raw_rgba[3::4]
        result["paletteRgbaMathMatrix"]=len(palette_matrix["rows"])

        palette_page=browser.new_page(viewport={"width":1000,"height":780})
        palette_errors=[]
        palette_page.on("pageerror",lambda error:palette_errors.append(str(error)))
        palette_page.goto(base,wait_until="domcontentloaded",timeout=30000)
        palette_page.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        palette_page.locator("#archive").set_input_files(str(ROOT/"test-output/kotlin-kfm-palette.zip"))
        palette_page.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=palette_page.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        for select in ["#p1-select","#p2-select"]:
            palette_page.locator(select).select_option(value=installed)
        palette_page.locator("#cpu").uncheck();palette_page.locator("#start").click()
        for phase in range(10):
            observed=palette_page.wait_for_function("""({phase,fixture})=>{
              const qa=window.__kenjatimeKotlinQA,p=qa?.paintedRenderPlan;
              if(!p||p.frame<1||qa.lastSpritePaintOrder?.frame!==p.frame)return false;
              const first=p.draws.find(d=>d.kind==='fighter'&&d.side===0),second=p.draws.find(d=>d.kind==='fighter'&&d.side===1);
              const shared=p.draws.find(d=>d.kind==='helper'&&d.action===732),own=p.draws.find(d=>d.kind==='helper'&&d.action===733);
              if(first?.action!==731||first.sprpriority!==phase-5||!second||!shared||!own)return false;
              if(phase===5&&!first.palFX[0]?.add[0])return false;
              const c=document.querySelector('#arena'),ctx=c.getContext('2d'),scale=c.width/960;
              const sample=(x,y)=>[...ctx.getImageData(Math.floor(x*scale),Math.floor(y*scale),1,1).data];
              const actors=[first,second,shared,own].map(actor=>({actor,pixels:fixture.samples.map(s=>{
                const x=s.x-fixture.axisX+.5,y=s.y-fixture.axisY+.5;
                return sample(actor.x+actor.transformA*x+actor.transformC*y,actor.y+actor.transformB*x+actor.transformD*y);
              })}));
              return {frame:p.frame,actors,backdrop:sample(10,100),hud:sample(30,30),colors:p.paletteColors,caches:qa.spriteCaches};
            }""",arg={"phase":phase,"fixture":samples},timeout=30000).json_value()
            local=[];global_layers=[];background_layers=[]
            if phase==1:local=[palette_layer(add=(20,-30,10))]
            elif phase==2:local=[palette_layer(mul=(128,256,0))]
            elif phase==3:local=[palette_layer(color=0)]
            elif phase==4:local=[palette_layer(invert=True)]
            elif phase==5:
                age=(observed["frame"]-1)%600-300
                wave=math.sin(2*math.pi*age/16)
                local=[palette_layer(add=(math.trunc(64*wave),0,math.trunc(-64*wave)))]
            elif phase==6:background_layers=[palette_layer(add=(15,20,-10))]
            elif phase==7:global_layers=[palette_layer(invert=True)]
            elif phase==8:
                local=[palette_layer(add=(10,0,0))];background_layers=[palette_layer(add=(0,20,0))];global_layers=[palette_layer(mul=(128,128,128))]
            backdrop=palette_rgb([16,35,56],background_layers+global_layers)
            hud=palette_rgb([149,215,143],background_layers+global_layers)
            assert observed["backdrop"]==backdrop+[255],(phase,observed)
            assert observed["hud"]==hud+[255],(phase,observed)
            for index,row in enumerate(observed["actors"]):
                layers=(local if index in [0,2] else [])+global_layers
                assert row["actor"]["palFX"]==layers,(phase,index,row,layers)
                for point,pixel in zip(samples["samples"],row["pixels"]):
                    expected=palette_rgb(point["rgba"][:3],layers) if point["rgba"][3] else backdrop
                    assert all(abs(a-b)<=2 for a,b in zip(pixel,expected+[255])),(phase,index,point,pixel,expected)
            assert all(c["bytes"]<=32*1024*1024 and c["entries"]<=256 for c in observed["caches"]),observed
        assert not palette_errors,palette_errors
        result["paletteScopesOwnershipSineAndCanvasPixels"]="passed"
        palette_page.close()

        remap = browser.new_page(viewport={"width": 1000, "height": 780})
        remap_errors = []
        remap.on("pageerror", lambda error: remap_errors.append(str(error)))
        remap.goto(base, wait_until="domcontentloaded", timeout=30000)
        remap.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        remap.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-remappal.zip"))
        remap.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0", timeout=45000)
        installed = remap.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value"
        )
        for select in ["#p1-select", "#p2-select"]:
            remap.locator(select).select_option(value=installed)
        remap.locator("#cpu").uncheck()
        remap.locator("#start").click()
        for phase, target, colors in [
            (0, None, None),
            (1, [1, 2], [None, [231, 234, 247], [181, 172, 206]]),
            (2, [1, 3], [None, [255, 253, 117], [210, 192, 44]]),
            (3, None, None), (4, None, None),
        ]:
            observed = remap.wait_for_function("""({phase, fixture}) => {
              const qa = window.__kenjatimeKotlinQA, plan = qa?.paintedRenderPlan;
              if (!plan || qa.lastSpritePaintOrder?.frame !== plan.frame) return false;
              const root = plan.draws.find(d => d.kind === 'fighter' && d.side === 0);
              const rival = plan.draws.find(d => d.kind === 'fighter' && d.side === 1);
              const shared = plan.draws.find(d => d.kind === 'helper' && d.action === 732);
              const independent = plan.draws.find(d => d.kind === 'helper' && d.action === 733);
              if (root?.action !== 731 || root.sprpriority !== phase || !rival || !shared || !independent) return false;
              const canvas = document.querySelector('#arena'), context = canvas.getContext('2d'), scale = canvas.width / 960;
              return [root, shared, independent, rival].map(actor => ({
                palette: actor.remapPalette ?? null,
                pixels: fixture.samples.map(point => {
                  const x = point.x - fixture.axisX + .5, y = point.y - fixture.axisY + .5;
                  return [...context.getImageData(
                    Math.floor(scale * (actor.x + actor.transformA * x + actor.transformC * y)),
                    Math.floor(scale * (actor.y + actor.transformB * x + actor.transformD * y)), 1, 1
                  ).data];
                }),
              }));
            }""", arg={"phase": phase, "fixture": samples}, timeout=20000).json_value()
            for index, actor in enumerate(observed):
                assert actor["palette"] == (target if index < 2 else None), observed
                for sample_index, (point, pixel) in enumerate(zip(samples["samples"], actor["pixels"])):
                    expected = ([16, 35, 56] if not point["rgba"][3] else
                                (colors[sample_index] if index < 2 and colors else point["rgba"][:3]))
                    assert all(abs(a-b) <= 2 for a, b in zip(pixel, expected + [255])), (phase, actor, point, pixel)
        assert not remap_errors, remap_errors
        result["paletteRemapSffPixelsAndSharedOwnership"] = "passed"
        remap.close()

        paused = browser.new_page(viewport={"width": 1000, "height": 780})
        pause_errors = []
        paused.on("pageerror", lambda error: pause_errors.append(str(error)))
        paused.goto(base, wait_until="domcontentloaded", timeout=30000)
        paused.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        paused.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-superpause.zip"))
        paused.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0", timeout=45000)
        installed = paused.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value"
        )
        for select in ["#p1-select", "#p2-select"]:
            paused.locator(select).select_option(value=installed)
        paused.locator("#cpu").uncheck()
        paused.locator("#start").click()
        frozen = paused.wait_for_function("""() => {
          const qa = window.__kenjatimeKotlinQA, plan = qa?.paintedRenderPlan;
          if (!plan || plan.frame < 4 || !plan.pause?.darken || qa.lastSpritePaintOrder?.frame !== plan.frame) return false;
          const flash = plan.draws.find(d => d.kind === 'superpause');
          if (flash?.action !== 772 || !qa.lastSpritePaintOrder.draws.some(d => d.kind === 'superpause')) return false;
          const canvas = document.querySelector('#arena');
          return {
            positions: plan.draws.filter(d => d.kind === 'fighter').map(d => d.x),
            pixel: [...canvas.getContext('2d').getImageData(10, 100, 1, 1).data],
          };
        }""", timeout=15000).json_value()
        assert all(abs(a-b) <= 1 for a, b in zip(frozen["pixel"], [7, 16, 26, 255])), frozen
        resumed = paused.wait_for_function("""() => {
          const plan = window.__kenjatimeKotlinQA?.paintedRenderPlan;
          if (!plan || plan.frame < 67 || plan.pause?.darken || plan.draws.some(d => d.kind === 'superpause')) return false;
          const canvas = document.querySelector('#arena');
          return {
            positions: plan.draws.filter(d => d.kind === 'fighter').map(d => d.x),
            pixel: [...canvas.getContext('2d').getImageData(10, 100, 1, 1).data],
          };
        }""", timeout=15000).json_value()
        assert resumed["pixel"] == [16, 35, 56, 255] and resumed["positions"] != frozen["positions"], resumed
        assert not pause_errors, pause_errors
        result["superPauseDarkensAndRendersAuthoredFlash"] = "passed"
        paused.close()

        shared = browser.new_page(viewport={"width": 1000, "height": 780})
        shared_errors = []
        shared.on("pageerror", lambda error: shared_errors.append(str(error)))
        shared.add_init_script("""(() => {
          const calls = window.rumbleCalls = [];
          const pad = index => ({index, connected: true, mapping: "standard", vibrationActuator: {
            playEffect: (type, motors) => {calls.push({index, type, ...motors}); return Promise.resolve("complete");},
            reset: () => {calls.push({index, reset: true}); return Promise.resolve("complete");}
          }});
          const first = pad(2), second = pad(5);
          Object.defineProperty(navigator, "getGamepads", {value: () => [null, null, first, null, null, second]});
        })()""")
        shared.goto(base, wait_until="domcontentloaded", timeout=30000)
        shared.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-fightfx.zip"))
        shared.wait_for_function("""() => !document.querySelector("#archive").disabled &&
          document.querySelector("#setup-status")?.textContent.includes("Installed common fightfx")""", timeout=45000)
        shared.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-common-sound.zip"))
        shared.wait_for_function("""() => !document.querySelector("#archive").disabled &&
          document.querySelector("#setup-status")?.textContent.includes("fightfx artwork and sound")""", timeout=45000)
        shared.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-shared-effects.zip"))
        shared.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0", timeout=45000)
        installed = shared.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value"
        )
        shared.locator("#p1-select").select_option(value=installed)
        shared.locator("#cpu").uncheck()
        shared.locator("#sound").check()
        shared.bring_to_front()
        shared.locator("#start").click()
        shared.wait_for_function("""() => {
          const qa = window.__kenjatimeKotlinQA, plan = qa?.paintedRenderPlan;
          const draw = qa?.lastSpritePaintOrder;
          if (!plan || draw?.frame !== plan.frame) return false;
          const effects = plan.draws.filter(d => d.kind === "gameanim");
          if (effects.length !== 3 || effects.some(d => d.group !== 777 || d.spriteScaleX !== 0.5)) return false;
          return draw.draws.map(d => d.kind).join(",") === "gameanim,gameanim,fighter,fighter,gameanim" &&
            effects.map(d => d.action).join(",") === "120,120,52";
        }""", timeout=15000)
        recorded = shared.wait_for_function("""() => {
          const calls = window.rumbleCalls;
          return calls.some(c => c.reset) && calls;
        }""", timeout=15000).json_value()
        assert all(event["index"] == 5 for event in recorded), recorded
        strengths = [event["strongMagnitude"] for event in recorded if not event.get("reset")]
        assert len(strengths) == 20 and abs(strengths[0] - 140/255) < 1e-10, recorded
        assert abs(strengths[-1] - 235/255) < 1e-10 and recorded[-1]["reset"], recorded
        assert all(event["strongMagnitude"] == event["weakMagnitude"] for event in recorded if not event.get("reset")), recorded
        shared.wait_for_function("""() => {
          const plan = window.__kenjatimeKotlinQA?.paintedRenderPlan;
          return plan?.frame >= 60 && plan.draws.every(d => d.kind !== "gameanim");
        }""", timeout=15000)
        shared.wait_for_function("""() => {
          const qa = window.__kenjatimeKotlinQA, plan = qa?.paintedRenderPlan;
          const draw = qa?.lastSpritePaintOrder;
          if (!plan || draw?.frame !== plan.frame) return false;
          const explod = plan.draws.find(d => d.kind === "explod" && d.effectId === 777);
          return explod?.common && explod.group === 777 &&
            explod.spriteScaleX === 0.75 && explod.spriteScaleY === 1 &&
            draw.draws.some(d => d.kind === "explod") &&
            qa.audio.voices.some(v => v.common && v.group === 777 && v.channel === 7 && v.started);
        }""", timeout=15000)
        shared.wait_for_function("""() => {
          const qa = window.__kenjatimeKotlinQA, plan = qa?.paintedRenderPlan;
          const draw = qa?.lastSpritePaintOrder;
          if (!plan?.pause?.darken || draw?.frame !== plan.frame) return false;
          const flash = plan.draws.find(d => d.kind === "superpause");
          return flash?.action === 30 && flash.common && flash.group === 777 &&
            draw.draws.at(-1)?.kind === "superpause" && qa.audio.counts.started >= 2;
        }""", timeout=15000)
        assert not shared_errors, shared_errors
        result["commonFightFxDrawingAndForceFeedback"] = "passed"
        result["commonExplodAndSuperPauseWithImportedSound"] = "passed"
        shared.close()

        trails=browser.new_page(viewport={"width":1000,"height":780})
        trail_errors=[]
        trails.on("pageerror",lambda error:trail_errors.append(str(error)))
        trails.goto(base,wait_until="domcontentloaded",timeout=30000)
        trails.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        trails.locator("#archive").set_input_files(str(ROOT/"test-output/kotlin-kfm-afterimage.zip"))
        trails.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=trails.locator("#p1-select option").evaluate_all("options=>options.find(o=>o.value.startsWith('installed:')).value")
        trails.locator("#p1-select").select_option(value=installed)
        trails.locator("#cpu").uncheck();trails.locator("#start").click()
        for phase in range(10):
            stopped=phase in [5,7,9]
            observed=trails.wait_for_function("""({phase,stopped,fixture})=>{
              const qa=window.__kenjatimeKotlinQA,p=qa?.paintedRenderPlan;
              if(!p||qa.lastSpritePaintOrder?.frame!==p.frame)return false;
              const root=p.draws.find(d=>d.kind==='fighter'&&d.side===0);
              if(root?.action!==740||root.sprpriority!==phase-5)return false;
              const rootGhosts=p.draws.filter(d=>d.kind==='afterimage'&&d.afterimageOwnerId===1);
              if(!p.draws.some(d=>d.kind==='afterimage'&&d.afterimageOwnerId!==1))return false;
              if(stopped)return rootGhosts.length===0?{stopped:true}:false;
              const ghost=rootGhosts.find(d=>d.historyIndex===2);
              if(!ghost||Math.abs(ghost.x-root.x)<60)return false;
              const c=document.querySelector('#arena'),ctx=c.getContext('2d'),scale=c.width/960;
              const read=(x,y)=>[...ctx.getImageData(Math.floor(x*scale),Math.floor(y*scale),1,1).data];
              const pixels=fixture.samples.map(s=>{
                const x=s.x-fixture.axisX+.5,y=s.y-fixture.axisY+.5;
                return read(ghost.x+ghost.transformA*x+ghost.transformC*y,ghost.y+ghost.transformB*x+ghost.transformD*y);
              });
              return {frame:p.frame,ghost,pixels,backdrop:p.paletteColors.backdrop,painted:qa.lastSpritePaintOrder.draws,caches:qa.spriteCaches};
            }""",arg={"phase":phase,"stopped":stopped,"fixture":samples},timeout=30000).json_value()
            if stopped:continue
            base_layer={**palette_layer(add=(20,0,0),mul=(128,256,0),color=0 if phase==4 else 256,invert=phase==4),"post":[5,10,0]}
            layers=[base_layer,{**palette_layer(add=(10,0,0),mul=(128,256,256)),"repeat":2}]
            if phase==4:layers.append(palette_layer(mul=(128,256,128)))
            assert observed["ghost"]["palFX"]==layers,(phase,observed)
            mode={1:"add",2:"add1",3:"sub"}.get(phase,"none")
            expected_blend={"mode":"normal" if mode=="none" else "sub" if mode=="sub" else "add","source":256,"destination":0 if mode=="none" else 128 if mode=="add1" else 256}
            assert observed["ghost"]["blend"]==expected_blend,(phase,observed)
            for point,pixel in zip(samples["samples"],observed["pixels"]):
                background=observed["backdrop"]
                if not point["rgba"][3]:expected=background
                else:
                    source=palette_rgb(point["rgba"][:3],layers)
                    expected=source if mode=="none" else [max(0,d-s) for s,d in zip(source,background)] if mode=="sub" else [min(255,s+d*(.5 if mode=="add1" else 1)) for s,d in zip(source,background)]
                assert all(abs(a-b)<=2 for a,b in zip(pixel,expected+[255])),(phase,point,pixel,expected,observed)
            priorities=[d["priority"] for d in observed["painted"]]
            assert priorities==sorted(priorities),observed
            assert all(c["bytes"]<=32*1024*1024 and c["entries"]<=256 for c in observed["caches"]),observed
            if phase==8:
                trails.wait_for_function("""()=>{
                  const p=window.__kenjatimeKotlinQA?.paintedRenderPlan;
                  return p?.frame%600>=515&&p.frame%600<540&&!p.draws.some(d=>d.kind==='afterimage'&&d.afterimageOwnerId===1);
                }""",timeout=30000)
        assert not trail_errors,trail_errors
        result["afterimageHistoryPaletteBlendRetimingAndCanvasPixels"]="passed"
        trails.close()

        for side in [0,1]:
            counter=browser.new_page(viewport={"width":1000,"height":780})
            counter_errors=[]
            counter.on("pageerror",lambda error:counter_errors.append(str(error)))
            counter.goto(base,wait_until="domcontentloaded",timeout=30000)
            counter.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
            counter.locator("#archive").set_input_files(str(ROOT/f"test-output/kotlin-kfm-reversal-{side}.zip"))
            counter.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
            installed=counter.locator("#p1-select option").evaluate_all("options=>options.find(o=>o.value.startsWith('installed:')).value")
            for select in ["#p1-select","#p2-select"]:counter.locator(select).select_option(value=installed)
            counter.locator("#cpu").uncheck()
            counter.locator("#cns-debug").evaluate("element=>element.open=true")
            counter.locator("#start").click()
            observed=counter.wait_for_function("""side=>{
              const qa=window.__kenjatimeKotlinQA,p=qa?.paintedRenderPlan;
              if(!p||p.frame<15||qa.lastSpritePaintOrder?.frame!==p.frame)return false;
              const a=p.draws.find(d=>d.kind==='fighter'&&d.side===side),b=p.draws.find(d=>d.kind==='fighter'&&d.side!==side);
              const text=qa.clipboards?.rows;
              if(a?.action!==751||b?.action!==752||!text?.every(row=>row.text))return false;
              return {health:p.health,text,paints:qa.spritePaints};
            }""",arg=side,timeout=30000).json_value()
            assert observed["health"]==[376,376],observed
            rows={row["id"]:row["text"] for row in observed["text"]}
            assert re.fullmatch(rf"role=counter id={side+1} hit=[1-9]\d* reversed=0 custom=0 targets=1",rows[side+1]),observed
            assert re.fullmatch(rf"role=victim id={2-side} hit=0 reversed=[1-9]\d* custom=1 targets=0",rows[2-side]),observed
            assert observed["paints"]>2,observed
            assert not counter_errors,counter_errors
            result[f"reversalCustomStateAndCancelledDamage{side}"]="passed"
            counter.close()

        sound=browser.new_page(viewport={"width":1000,"height":780})
        sound_errors=[]
        sound.on("pageerror",lambda error:sound_errors.append(str(error)))
        sound.goto(base,wait_until="domcontentloaded",timeout=30000)
        sound.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        sound.locator("#archive").set_input_files(str(ROOT/"test-output/kotlin-kfm-sound.zip"))
        sound.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=sound.locator("#p1-select option").evaluate_all("options=>options.find(o=>o.value.startsWith('installed:')).value")
        sound.locator("#p1-select").select_option(value=installed)
        sound.locator("#cpu").uncheck();sound.locator("#start").click()
        original_voice=None
        for phase in range(10):
            observed=sound.wait_for_function("""phase=>{
              const q=window.__kenjatimeKotlinQA,p=q?.paintedRenderPlan,a=q?.audio;
              const actor=p?.draws.find(d=>d.kind==='fighter'&&d.side===0);
              if(actor?.action!==760||actor.sprpriority!==phase-4||a?.state!=='running')return false;
              const active=a.voices.filter(v=>v.started),root=active.find(v=>v.actor===1),helper=active.find(v=>v.actor!==1);
              const left=a.rms[0],right=a.rms[1],audible=Math.max(left,right)>.001;
              if([0,1,2,3,9].includes(phase)&&(!root||active.length!==1||!audible))return false;
              if(phase===0&&(root.nodePan!==-1||left<=.001||right>.0001))return false;
              if([1,2].includes(phase)&&(root.nodePan!==1||right<=.001||left>.0001))return false;
              if([3,9].includes(phase)&&(root.nodePan!==0||left<=.001||right<=.001))return false;
              if([4,7].includes(phase)&&(a.voices.length||left>.0001||right>.0001))return false;
              if(phase===5&&(!root||!helper||active.length!==2||root.nodePan!==1||helper.nodePan!==-1||left<=.001||right<=.001))return false;
              if(phase===6&&(root||!helper||active.length!==1||helper.nodePan!==-1||left<=.001||right>.0001))return false;
              if(phase===8&&(!root||root.channel!==4||root.loop||!audible))return false;
              return a;
            }""",arg=phase,timeout=30000).json_value()
            assert observed["bytes"]<=32*1024*1024 and observed["entries"]<=256,observed
            assert observed["decoding"]<=2 and observed["pending"]<=32,observed
            assert not observed["warnings"],observed
            if phase==0:original_voice=observed["voices"][0]["voice"]
            if phase==2:
                assert observed["voices"][0]["voice"]==original_voice,observed
                assert observed["voices"][0]["number"]==0 and observed["voices"][0]["nodeGain"]==1,observed
            if phase==3:
                v=observed["voices"][0]
                assert v["voice"]!=original_voice and v["number"]==1 and v["nodeGain"]==.5 and v["nodeFrequency"]==2,observed
            if phase==8:
                sound.wait_for_function("""()=>{
                  const q=window.__kenjatimeKotlinQA,p=q.paintedRenderPlan,a=q.audio;
                  return p.frame%400>=345&&p.frame%400<=360&&!a.voices.length&&a.rms.every(n=>n<.0001);
                }""",timeout=30000)
        sound.locator("#pause").click()
        sound.wait_for_function("window.__kenjatimeKotlinQA.audio.state==='suspended'&&document.querySelector('#banner').textContent.includes('Paused')",timeout=10000)
        frozen=sound.evaluate("window.__kenjatimeKotlinQA.paintedRenderPlan.frame")
        sound.wait_for_timeout(150)
        assert sound.evaluate("window.__kenjatimeKotlinQA.paintedRenderPlan.frame")==frozen
        sound.locator("#pause").click()
        sound.wait_for_function("window.__kenjatimeKotlinQA.audio.state==='running'",timeout=10000)
        sound.locator("#sound").uncheck()
        sound.wait_for_function("!window.__kenjatimeKotlinQA.audio.enabled&&window.__kenjatimeKotlinQA.audio.rms.every(n=>n<.0001)",timeout=10000)
        assert sound.evaluate("window.__kenjatimeKotlinQA.audio.voices.length")>0
        sound.locator("#sound").check()
        sound.wait_for_function("window.__kenjatimeKotlinQA.audio.enabled&&window.__kenjatimeKotlinQA.audio.rms.some(n=>n>.001)",timeout=10000)
        sound.locator("#reset").click()
        sound.wait_for_function("!window.__kenjatimeKotlinQA.audio.voices.length&&!window.__kenjatimeKotlinQA.audio.entries",timeout=10000)
        assert not sound_errors,sound_errors
        result["sndChannelsStereoSignalPriorityPitchExpiryPauseMuteAndReset"]="passed"
        sound.close()

        victory = browser.new_page(viewport={"width": 1000, "height": 780})
        victory_errors = []
        victory.on("pageerror", lambda error: victory_errors.append(str(error)))
        victory.goto(base, wait_until="domcontentloaded", timeout=30000)
        victory.wait_for_function("!document.querySelector('#start')?.disabled", timeout=120000)
        victory.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-victory.zip"))
        victory.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0", timeout=45000)
        installed = victory.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value"
        )
        for selector in ["#p1-select", "#p2-select"]:
            victory.locator(selector).select_option(value=installed)
        victory.locator("#cpu").uncheck()
        victory.locator("#endless").uncheck()
        victory.locator("#start").click()
        quote = victory.locator("#victory-quote")
        quote.wait_for(state="visible", timeout=20000)
        assert quote.text_content() == "Good round; <strong>rematch</strong>!\nReady?"
        assert quote.locator("strong").count() == 0
        assert "wins · Player 1" in victory.locator("#banner").text_content()
        victory.locator("#endless").check()
        victory.locator("#start").click()
        quote.wait_for(state="hidden", timeout=10000)
        victory.wait_for_function("window.__kenjatimeKotlinQA?.paintedRenderPlan?.roundNumber>=2", timeout=12000)
        assert victory.locator("#banner").get_attribute("data-phase") == "running"
        assert not victory_errors, victory_errors
        result["victoryQuoteAndHitCountInCompletedMatch"] = "passed"
        result["endlessKnockoutStartsNewRound"] = "passed"
        victory.close()

        for width in [320,640]:
            offsets=browser.new_page(viewport={"width":1000,"height":780})
            offset_errors=[]
            offsets.on("pageerror",lambda error:offset_errors.append(str(error)))
            offsets.goto(base,wait_until="domcontentloaded",timeout=30000)
            offsets.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
            offsets.locator("#archive").set_input_files(str(ROOT / f"test-output/kotlin-kfm-offset-{width}.zip"))
            offsets.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
            installed=offsets.locator("#p1-select option").evaluate_all(
                "options=>options.find(o=>o.value.startsWith('installed:')).value")
            offsets.locator("#p1-select").select_option(value=installed)
            offsets.locator("#cpu").uncheck()
            offsets.locator("#start").click()
            for facing,dx,dy in [(1,27.25,-13.5),(-1,-32.5,-3.75),(-1,-20,-10)]:
                observed=offsets.wait_for_function("""expected => {
                  const qa=window.__kenjatimeKotlinQA,plan=qa?.renderPlan,paint=qa?.lastActorTransformPaint;
                  const draw=plan?.draws.find(d=>d.kind==='fighter'&&d.side===0);
                  const effect=plan?.draws.find(d=>d.kind==='explod'&&d.effectId===707);
                  return draw?.action===707&&draw.facing===expected.face&&effect&&paint?.frame===plan.frame&&
                    draw.displayOffsetX256===expected.dx*256&&draw.displayOffsetY256===expected.dy*256 ?
                    {plan,paint,draw,effect}:false;
                }""",arg={"face":facing,"dx":dx,"dy":dy},timeout=30000).json_value()
                plan,paint,draw,effect=[observed[k] for k in ["plan","paint","draw","effect"]]
                z=plan["cameraZoom"]
                c,s=math.cos(math.radians(90*facing)),math.sin(math.radians(90*facing))
                fx,fy=8*3*320/width*facing,(-4)*(-.25)*320/width
                x=draw["axisX"]+(dx+c*fx+s*fy)*1.4*z
                y=draw["axisY"]+(dy-s*fx+c*fy)*1.1*z
                assert abs(paint["x"]-x)<1e-4 and abs(paint["y"]-y)<1e-4,observed
                assert abs(effect["axisX"]-draw["axisX"]-dx*1.4*z)<1e-6,observed
                assert abs(effect["axisY"]-draw["axisY"]-dy*1.1*z)<1e-6,observed
            assert not offset_errors,offset_errors
            result[f"offsetCanvasTranslation{width}"]="passed"
            offsets.close()

        high=browser.new_page(viewport={"width":1000,"height":780})
        high_errors=[]
        high.on("pageerror",lambda error:high_errors.append(str(error)))
        high.goto(base,wait_until="domcontentloaded",timeout=30000)
        high.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
        high.locator("#archive").set_input_files(str(ROOT / "test-output/kotlin-kfm-localcoord.zip"))
        high.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
        installed=high.locator("#p1-select option").evaluate_all(
            "options=>options.find(o=>o.value.startsWith('installed:')).value")
        high.locator("#p1-select").select_option(value=installed)
        high.locator("#start").click()
        high.wait_for_function("window.__kenjatimeKotlinQA?.explodPaints>5",timeout=30000)
        high_plan=high.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        effect=next(d for d in high_plan["draws"] if d["kind"]=="explod")
        fighter=next(d for d in high_plan["draws"] if d["kind"]=="fighter" and d["side"]==0)
        assert effect["effectId"]==702,effect
        assert abs(effect["spriteScaleX"]-0.5)<0.00001,effect
        assert abs(effect["spriteScaleY"]-0.5)<0.00001,effect
        assert abs(effect["pixelScaleX"]-0.7*effect["scale"])<0.00001,effect
        assert abs(effect["pixelScaleY"]-0.55*effect["scale"])<0.00001,effect
        # Size is fixed-point authored metadata; effect scale is independent.
        expected_size=(int(3.15*256)/256)*(320/1008)
        assert abs(fighter["spriteScaleX"]-expected_size)<0.00001,fighter
        assert abs(fighter["spriteScaleY"]-expected_size)<0.00001,fighter
        painted=high.evaluate("window.__kenjatimeKotlinQA.lastExplodPaint")
        assert abs(painted["scaleX"]-painted["plannedScaleX"])<0.00001,painted
        assert abs(painted["scaleY"]-painted["plannedScaleY"])<0.00001,painted
        assert not high_errors,high_errors
        result["synthetic1008CoordinateCanvasPaint"]="passed"
        high.close()

        # Actual imported CNS -> Kotlin scaling -> decoded SFF -> Canvas,
        # including signed mirroring and opt-in body Size inheritance.
        for do_scale in (0,1):
            shots=browser.new_page(viewport={"width":1000,"height":780})
            shot_errors=[]
            shots.on("pageerror",lambda error:shot_errors.append(str(error)))
            shots.goto(base,wait_until="domcontentloaded",timeout=30000)
            shots.wait_for_function("!document.querySelector('#start')?.disabled",timeout=120000)
            shots.locator("#archive").set_input_files(str(ROOT / f"test-output/kotlin-kfm-projectile-{do_scale}.zip"))
            shots.wait_for_function("window.__kenjatimeKotlinQA?.importedCount>0",timeout=45000)
            installed=shots.locator("#p1-select option").evaluate_all(
                "options=>options.find(o=>o.value.startsWith('installed:')).value")
            shots.locator("#p1-select").select_option(value=installed)
            shots.locator("#cpu").uncheck()
            shots.locator("#start").click()
            shots.wait_for_function("window.__kenjatimeKotlinQA?.projectilePaints>5",timeout=30000)
            shot_plan=shots.evaluate("window.__kenjatimeKotlinQA.renderPlan")
            projectile=next(d for d in shot_plan["draws"] if d["kind"]=="projectile")
            assert projectile["action"]==703,projectile
            assert projectile["side"]==0,projectile
            assert abs(projectile["spriteScaleX"]-(-1.5 if do_scale else -.75))<.000001,projectile
            assert abs(projectile["spriteScaleY"]-(.125 if do_scale else .25))<.000001,projectile
            painted=shots.evaluate("window.__kenjatimeKotlinQA.lastProjectilePaint")
            assert abs(painted["scaleX"]-painted["plannedScaleX"]*painted["facing"]*painted["flipX"])<.000001,painted
            assert abs(painted["scaleY"]-painted["plannedScaleY"]*painted["flipY"])<.000001,painted
            assert not shot_errors,shot_errors
            result[f"realScaledProjectileCanvasPaint{do_scale}"]=shots.evaluate("window.__kenjatimeKotlinQA.projectilePaints")
            shots.close()

        # A real 360-css-pixel Android WebView viewport, with native status-bar
        # insets, may NEVER horizontally scroll or overlap its two selectors.
        mobile=browser.new_page(viewport={"width":360,"height":800},
           device_scale_factor=2,is_mobile=True,has_touch=True,
           user_agent="Mozilla/5.0 (Linux; Android 15; Infinix X6837; wv) AppleWebKit/537.36 Chrome/157.0.0.0 Mobile Safari/537.36")
        mobile.add_init_script("window.Capacitor={isNativePlatform:()=>true}")
        mobile.goto(base,wait_until="domcontentloaded",timeout=30000)
        mobile.wait_for_function("""()=>
          document.querySelector('#version')?.textContent?.includes('kotlin-wasm-standard')
        """,timeout=120000)
        layout=mobile.evaluate("""() => {
          const panel=document.querySelector('#match-setup').getBoundingClientRect();
          const left=document.querySelector('#p1-select').getBoundingClientRect();
          const right=document.querySelector('#p2-select').getBoundingClientRect();
          return {vw:innerWidth,scroll:document.documentElement.scrollWidth,
            top:document.querySelector('#app').getBoundingClientRect().top,
            panelLeft:panel.left,panelRight:panel.right,
            left:[left.left,left.right],right:[right.left,right.right],
            bodyClass:document.body.className};
        }""")
        assert layout["scroll"]<=layout["vw"]+1,layout
        assert layout["top"]>=28,layout
        assert layout["panelLeft"]-1<=layout["left"][0]<layout["left"][1]<=layout["panelRight"]+1,layout
        assert layout["panelLeft"]-1<=layout["right"][0]<layout["right"][1]<=layout["panelRight"]+1,layout
        assert layout["left"][1] <= layout["right"][0],layout
        assert "android-shell" in layout["bodyClass"],layout
        mobile.screenshot(path=str(ROOT / "test-output/kotlin-android-layout.png"),full_page=True)
        result["mobileLayout"]=layout
        mobile.close()

        result["version"]=page.locator("#version").inner_text()
        result["csvSamples"]=len(data)
        result["lastTick"]=data[-1]["simulation_ticks"]
        result["device"]=data[0]["browser_name"]
        result["javascriptCombatFallback"]=False
        # Physical Android performance is NEVER inferred from headless Chromium.
        result["physicalAndroidVerified"]=False
        print(json.dumps(result,indent=2))
        browser.close()
finally:
    server.shutdown()
