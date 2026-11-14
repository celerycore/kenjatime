"""Verify actual Kotlin/Wasm-combat browser UI, not a JavaScript fallback."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import csv, io, functools, http.server, shutil, threading, json

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
        page.locator("#start").click()
        page.wait_for_function("""() =>
          document.querySelector('#banner')?.textContent?.includes('60 Hz combat') &&
          document.querySelector('#hz')?.textContent?.includes('Hz')
        """,timeout=120000)
        # Rendering must show actual SFF sprites; the previous Kotlin build
        # always drew rectangular placeholders despite passing engine tests.
        page.wait_for_function("window.__kenjatimeKotlinQA?.spritePaints > 5",
            timeout=30000)
        assert page.evaluate("window.__kenjatimeKotlinQA.placeholderPaints") < (
            page.evaluate("window.__kenjatimeKotlinQA.spritePaints") * 2)
        page.locator("#record").click()
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
        assert all(row["engine_backend"]=="Kotlin/WASM" for row in data)
        assert all(row["engine_version"].endswith("kotlin-wasm-standard") for row in data)
        assert all(row["simulation_ticks"] for row in data)
        assert max(float(r["simulation_ticks"]) for r in data)>=50
        assert all(row["device_os"]!="Unknown" for row in data)
        assert all(row["browser_name"]!="Unknown" for row in data)
        assert all(row["p1_character"]==row["p2_character"] for row in data)
        assert not errors,errors
        # Exercise the REAL Wasm-backed RAR decoder, including split Nu-13-style
        # script and SFF archives; avoid a mock-file shortcut that cannot catch
        # the Android "both async and sync fetching of wasm failed" bug.
        page.locator("#reset").click()
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
          const panel=document.querySelector('.panel').getBoundingClientRect();
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
