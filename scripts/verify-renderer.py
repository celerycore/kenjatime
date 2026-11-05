"""Compare native compositing with the pre-optimization CPU pixel formula."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, os, shutil
os.chdir(Path(__file__).resolve().parent.parent)
qa=Path('work/render-qa');qa.mkdir(parents=True,exist_ok=True)
for name in ['canvas-renderer.js','rendering.js','coordinates.js']:
    shutil.copy2(Path('src')/name,qa/name)
(qa/'index.html').write_text('<!doctype html><html><body>Local rendering verification</body></html>')
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
    page=browser.new_page();page.goto(os.environ.get('MUGEN_RENDER_TEST_URL','http://127.0.0.1:5190/'))
    result=page.evaluate('''async()=>{
      const {CanvasRenderer,compositePlan,spriteBounds}=await import('./canvas-renderer.js');
      const {blendPixels,spriteRotation}=await import('./rendering.js');
      const canvas=()=>{const c=document.createElement('canvas');c.width=128;c.height=96;return c;};
      const source=canvas();source.width=16;source.height=16;
      const sc=source.getContext('2d'),image=sc.createImageData(16,16);
      for(let i=0;i<256;i++)image.data.set([(i*71)%256,(i*113)%256,(i*19)%256,[0,64,128,200,255][i%5]],i*4);
      sc.putImageData(image,0,0);
      const cases=[],failures=[];let maximum=0,changed=0,total=0;
      for(const blend of ['', 'A','A1','S','AS64D32','AS160D96','AS32D192','AS0D0','AS0D256'])
      for(const angle of [0,37,90,180,269])for(const alpha of [1,.47])for(const clip of [false,true]){
        const actual=canvas(),expected=canvas(),a=actual.getContext('2d'),e=expected.getContext('2d');
        const background=a.createImageData(128,96);
        for(let i=0;i<128*96;i++)background.data.set([i%256,(i*7)%256,(i*13)%256,255],i*4);
        const r=spriteRotation(angle,23,-17);
        for(const ctx of [a,e]){ctx.putImageData(background,0,0);ctx.imageSmoothingEnabled=false;if(clip){ctx.beginPath();ctx.rect(22.3,14.7,71.4,63.1);ctx.clip();}ctx.translate(59.3,44.7);ctx.scale(-2.3,1.7);ctx.transform(r.a,r.b,r.c,r.d,0,0);ctx.globalAlpha=alpha;}
        const bounds=spriteBounds(a.getTransform(),-8,-8,16,16,128,96),plan=compositePlan(blend);
        let tinted=source;
        if(plan.brightness!==1){tinted=canvas();tinted.width=16;tinted.height=16;const pixels=sc.getImageData(0,0,16,16);for(let i=0;i<pixels.data.length;i+=4)for(let c=0;c<3;c++)pixels.data[i+c]=Math.round(pixels.data[i+c]*plan.brightness);tinted.getContext('2d').putImageData(pixels,0,0);}
        new CanvasRenderer(a).draw(tinted,-8,-8,plan,bounds);
        if(!blend)e.drawImage(source,-8,-8);
        else{
          const layer=canvas(),lc=layer.getContext('2d',{willReadFrequently:true});lc.imageSmoothingEnabled=false;lc.setTransform(e.getTransform());lc.globalAlpha=alpha;lc.drawImage(source,-8,-8);
          const dst=e.getImageData(bounds.left,bounds.top,bounds.width,bounds.height),src=lc.getImageData(bounds.left,bounds.top,bounds.width,bounds.height);
          dst.data.set(blendPixels(dst.data,src.data,blend));const patch=canvas();patch.getContext('2d').putImageData(dst,bounds.left,bounds.top);
          e.save();e.resetTransform();e.globalAlpha=1;e.drawImage(patch,bounds.left,bounds.top,bounds.width,bounds.height,bounds.left,bounds.top,bounds.width,bounds.height);e.restore();
        }
        const aa=a.getImageData(0,0,128,96).data,ee=e.getImageData(0,0,128,96).data;let max=0,sum=0,bad=0;
        for(let i=0;i<aa.length;i++){const d=Math.abs(aa[i]-ee[i]);max=Math.max(max,d);sum+=d;if(d>3)bad++;if(d)changed++;}total+=aa.length;
        maximum=Math.max(maximum,max);const entry={blend,angle,alpha,clip,max,mean:sum/aa.length,over3:bad};cases.push(entry);if(max>3)failures.push(entry);
      }
      return {cases:cases.length,maximum,changedChannels:changed,totalChannels:total,failures,details:cases};
    }''')
    Path('work/renderer-visual-result.json').write_text(json.dumps(result,indent=2))
    print(json.dumps({k:v for k,v in result.items() if k!='details'}))
    assert not result['failures'],result['failures'][:5]
    browser.close()
