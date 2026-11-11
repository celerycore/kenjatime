"""Browser QA for the Kenjatime Arcade skin: real UI + preserved imports."""
from __future__ import annotations
import subprocess
import time
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173/core/"
ROOT = Path(__file__).resolve().parents[2]

def online():
    for _ in range(75):
        try:
            with urllib.request.urlopen(BASE, timeout=1) as response:
                if response.status == 200:
                    return True
        except Exception:
            time.sleep(.25)
    return False

def main():
    server = subprocess.Popen(
        ["./node_modules/.bin/vite", "preview", "--config", "vite.core.config.js",
         "--host", "127.0.0.1", "--port", "4173", "--strictPort"],
        cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT,
    )
    try:
        assert online(), "Built browser preview did not open"
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True, args=["--use-gl=angle", "--use-angle=swiftshader"]
            )
            for width, height in [(1280, 800), (390, 844)]:
                context = browser.new_context(viewport={"width": width, "height": height})
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.goto(BASE, wait_until="domcontentloaded", timeout=30000)
                page.locator(".kenja-showcase").wait_for(timeout=20000)
                page.locator("#cards .card").first.wait_for(timeout=20000)
                assert page.locator(".kenja-concept-gart").count() == 1
                assert page.locator(".kenja-concept-edelweiss").count() == 1
                assert "Kenjatime" in page.title()
                assert page.locator("#stage-select option").count() >= 1
                assert page.locator("#opponent-select option").count() >= 2
                assert page.locator("#effects-select").count() == 1
                assert page.locator("#fight-now").count() == 1
                assert page.locator("#presentation-select").count() == 1
                assert page.locator("#presentation-select option").count() == 2
                assert page.locator(".kenja-showcase img").evaluate_all(
                    "(images) => images.every(img => img.complete && img.naturalWidth > 0)"
                ), "Arcade portrait artwork failed to load"
                # Check the actual compiled HUD rules in Chromium. The green
                # fallback silhouette must not cover a loaded portrait.
                assert page.evaluate("""() => {
                    const host = document.createElement("section");
                    host.className = "kenjatime-battle";
                    host.innerHTML = '<div class="core-hud kt-reference-hud">' +
                      '<div data-player="0"><div class="kt-hud-portrait kt-hud-has-image">' +
                      '<img alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">' +
                      '<svg hidden viewBox="0 0 96 120"><circle cx="48" cy="40" r="21"/></svg>' +
                      '</div></div></div>';
                    document.body.append(host);
                    const frame = host.querySelector(".kt-hud-portrait");
                    const art = frame.querySelector("img");
                    const fallback = frame.querySelector("svg");
                    const cleared = getComputedStyle(fallback).display === "none" &&
                      getComputedStyle(art).display !== "none";
                    frame.classList.remove("kt-hud-has-image");
                    fallback.removeAttribute("hidden");
                    const absent = getComputedStyle(fallback).display !== "none";
                    host.remove();
                    return cleared && absent;
                }"""), "HUD SVG fallback obscures imported fighter portrait"
                page.locator("#kenja-font").select_option("digital")
                assert page.locator("body").get_attribute("data-kenja-font") == "digital"
                page.reload(wait_until="domcontentloaded")
                page.locator("#kenja-font").wait_for(timeout=15000)
                assert page.locator("#kenja-font").input_value() == "digital"
                page.evaluate("""() => {
                   document.querySelector('#upload').onclick = () => window.__fighterClick = (window.__fighterClick || 0) + 1;
                   document.querySelector('#add-stage').onclick = () => window.__stageClick = (window.__stageClick || 0) + 1;
                }""")
                page.locator('[data-kenja-action="character"]').click()
                page.locator('[data-kenja-action="stage"]').click()
                assert page.evaluate("window.__fighterClick") == 1
                assert page.evaluate("window.__stageClick") == 1
                if width == 1280:
                    page.locator("#presentation-select").select_option("native-4-3")
                    page.locator("#fight-now").click()
                    page.wait_for_function("document.querySelector('.kenjatime-battle-screen')?.dataset.presentation==='native-4-3'",timeout=35000)
                    assert page.locator("button[data-presentation]").get_attribute("aria-pressed") == "true"
                    page.locator("button[data-presentation]").click()
                    page.wait_for_function("window.__kenjatimeCoreBattle?.presentation()==='widescreen-16-9'",timeout=12000)
                    assert page.locator("#presentation-select").input_value() == "widescreen-16-9"
                    page.locator("button[data-presentation]").click()
                    page.wait_for_function("window.__kenjatimeCoreBattle?.presentation()==='native-4-3'",timeout=12000)
                    assert page.locator("#presentation-select").input_value() == "native-4-3"
                    page.locator("button[data-menu]").click()
                    page.wait_for_function("!document.querySelector('.kenjatime-battle')",timeout=15000)
                assert not errors, "Browser errors: " + " | ".join(errors)
                assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 6"), (
                    "Arcade UI overflows at %s pixels" % width
                )
                context.close()
            browser.close()
        print("PASS: desktop and Android-width arcade UI, font persistence, local roster, import buttons, artwork")
    finally:
        server.terminate()
        try:
            server.wait(timeout=8)
        except subprocess.TimeoutExpired:
            server.kill()

if __name__ == "__main__":
    main()
