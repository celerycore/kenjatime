"""Verify actual Kotlin/Wasm-combat browser UI, not a JavaScript fallback."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import csv, io, functools, http.server, shutil, threading, json, math

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
        plan=page.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        assert plan["targetFps"] in [12,20,30,60],plan
        assert plan["backlog"]>=0,plan
        assert len(plan["health"])==2,plan
        assert len(plan["draws"])>=2,plan
        assert all("spriteScaleX" in draw and "spriteScaleY" in draw
                   for draw in plan["draws"]),plan
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
        imported_plan=page.evaluate("window.__kenjatimeKotlinQA.renderPlan")
        assert len(imported_plan["draws"])>=2,imported_plan
        assert imported_plan["draws"][0]["spriteScaleX"]>0
        assert imported_plan["draws"][0]["spriteScaleY"]>0
        result["kotlinRenderPlan"]=True

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
