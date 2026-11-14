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
