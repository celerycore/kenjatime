"""Check the WebGL prototype's blend/PalFX math against the Canvas renderer."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
os.chdir(Path(__file__).resolve().parent.parent)
Path('work').mkdir(exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(os.environ.get('MUGEN_PIXI_DEV_URL','http://127.0.0.1:5193/'),wait_until='networkidle')
    result=page.evaluate('''async()=>{
      const {PixiSpriteRenderer}=await import('/src/pixi-renderer.js');
      const {CanvasRenderer,compositePlan,spriteBounds}=await import('/src/canvas-renderer.js');
      const {transformRgba}=await import('/src/effects.js');
      const {spriteRotation}=await import('/src/rendering.js');
      const {RenderBackend}=await import('/src/render-backend.js');
      const create=(w=128,h=96)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
      const output=create(),gpu=await new PixiSpriteRenderer().init({canvas:output}),source=create(16,16),sc=source.getContext('2d'),data=sc.createImageData(16,16),bg=create(),bc=bg.getContext('2d'),background=bc.createImageData(128,96);
      for(let i=0;i<256;i++)data.data.set([(i*71)%256,(i*113)%256,(i*19)%256,[0,64,128,200,255][i%5]],i*4);sc.putImageData(data,0,0);
      for(let i=0;i<128*96;i++)background.data.set([i%256,(i*7)%256,(i*13)%256,255],i*4);bc.putImageData(background,0,0);
      const palettes=[null,{layers:[{color:128,invertall:1,add:[20,-10,5],mul:[200,240,256]}]},{layers:[{add:[-15,10,30],sinadd:[20,10,-5,13],age:4,mul:[256,300,180]},{color:64,invertall:1,postadd:[5,-10,15]}]}],cases=[];
      for(const blend of ['', 'A','A1','S','AS64D32','AS160D96','AS32D192','AS0D0','AS0D256'])for(const angle of [0,90,180])for(const alpha of [1,.47])for(const clip of [false,true])for(let pal=0;pal<palettes.length;pal++){
        const expected=create(),ctx=expected.getContext('2d'),palette=palettes[pal],m=new DOMMatrix().translate(59,45).rotate(angle).scale(-2,2),plan=compositePlan(blend),colored=create(16,16),rgba=transformRgba(data.data,palette);
        if(plan.brightness!==1)for(let i=0;i<rgba.length;i+=4)for(let c=0;c<3;c++)rgba[i+c]=Math.round(rgba[i+c]*plan.brightness);
        colored.getContext('2d').putImageData(new ImageData(rgba,16,16),0,0);
        ctx.drawImage(bg,0,0);ctx.imageSmoothingEnabled=false;if(clip){ctx.beginPath();ctx.rect(49,31,24,22);ctx.clip();}ctx.setTransform(m);ctx.globalAlpha=alpha;
        new CanvasRenderer(ctx).draw(colored,-8,-8,plan,spriteBounds(m,-8,-8,16,16,128,96));
        gpu.beginFrame(128,96);gpu.draw({surface:bg,matrix:new DOMMatrix()});gpu.draw({surface:source,pixels:()=>data.data,matrix:m,x:-8,y:-8,clip:clip?[49,31,73,53]:null,blend,palette,alpha});gpu.endFrame();
        const actual=gpu.readPixels(),reference=ctx.getImageData(0,0,128,96).data;let max=0,sum=0,bad=0,worst=null;for(let i=0;i<actual.length;i++){const d=Math.abs(actual[i]-reference[i]);if(d>max){max=d;const p=i-i%4;worst={x:p/4%128,y:Math.floor(p/4/128),actual:[...actual.slice(p,p+4)],reference:[...reference.slice(p,p+4)]};}sum+=d;if(d>3)bad++;}
        cases.push({blend,angle,alpha,clip,pal,max,worst,mean:sum/actual.length,over3:bad});
      }
      // Odd-width R8 rows, partial palette alpha and shared indices with two palettes.
      const indexPixels=new Uint8Array(7*5),indexColors=new Uint8Array(1024),otherColors=new Uint8Array(1024),indexedCases=[];
      for(let i=0;i<35;i++)indexPixels[i]=i%5;
      for(let i=0;i<256;i++){indexColors.set([(i*71)%256,(i*113)%256,(i*19)%256,[0,64,128,200,255][i%5]],i*4);otherColors.set([(i*19)%256,(i*71)%256,(i*113)%256,[0,64,128,200,255][i%5]],i*4);}
      const indexedSurface={width:7,height:5},indexMatrix=new DOMMatrix().translate(25,25).scale(3,3);
      for(const blend of ['', 'A','A1','S','AS64D32','AS0D256'])for(const palette of palettes)for(const alpha of [1,.47]){
        const rgba=new Uint8Array(35*4);for(let i=0;i<35;i++)rgba.set(indexColors.subarray(indexPixels[i]*4,indexPixels[i]*4+4),i*4);
        gpu.beginFrame(128,96);gpu.draw({surface:bg,matrix:new DOMMatrix()});gpu.draw({surface:indexedSurface,key:'rgba-control',pixels:rgba,mutable:true,matrix:indexMatrix,blend,palette,alpha});gpu.endFrame();const reference=gpu.readPixels();
        gpu.beginFrame(128,96);gpu.draw({surface:bg,matrix:new DOMMatrix()});gpu.draw({surface:indexedSurface,pixels:indexPixels,indexPalette:indexColors,matrix:indexMatrix,blend,palette,alpha});gpu.endFrame();const actual=gpu.readPixels();let max=0;for(let i=0;i<actual.length;i++)max=Math.max(max,Math.abs(actual[i]-reference[i]));indexedCases.push(max);
      }
      gpu.beginFrame(128,96);gpu.draw({surface:indexedSurface,pixels:indexPixels,indexPalette:indexColors,matrix:indexMatrix});gpu.draw({surface:indexedSurface,pixels:indexPixels,indexPalette:otherColors,matrix:indexMatrix.translate(10,0)});gpu.endFrame();const paletteBatches=gpu.stats.batches,indexedBytes=gpu.textures.get(indexedSurface).bytes;
      // Contiguous sprites share one draw; order changes must keep distinct batches.
      gpu.beginFrame(128,96);for(let i=0;i<100;i++)gpu.draw({surface:source,pixels:()=>data.data,matrix:new DOMMatrix().translate(i%10*10,Math.floor(i/10)*8)});gpu.endFrame();const batched={...gpu.stats};
      const mixed=create(),mc=mixed.getContext('2d');mc.drawImage(bg,0,0);gpu.beginFrame(128,96);gpu.draw({surface:bg,matrix:new DOMMatrix()});
      for(let i=0;i<6;i++)for(let pass=0;pass<2;pass++){
        const blend=['','A','A1','AS64D32','AS32D192','AS0D0'][(i+pass)%6],alpha=pass?.47:1,m=new DOMMatrix().translate(12+(i%3)*35,12+Math.floor(i/3)*36),plan=compositePlan(blend),surface=create(16,16),rgba=new Uint8ClampedArray(data.data);
        if(plan.brightness!==1)for(let j=0;j<rgba.length;j+=4)for(let c=0;c<3;c++)rgba[j+c]=Math.round(rgba[j+c]*plan.brightness);surface.getContext('2d').putImageData(new ImageData(rgba,16,16),0,0);mc.setTransform(m);mc.globalAlpha=alpha;new CanvasRenderer(mc).draw(surface,0,0,plan,spriteBounds(m,0,0,16,16,128,96));gpu.draw({surface:source,pixels:()=>data.data,matrix:m,blend,alpha});
      }
      gpu.endFrame();const ma=gpu.readPixels(),me=mc.getImageData(0,0,128,96).data;let mixedBatchMax=0;for(let i=0;i<ma.length;i++)mixedBatchMax=Math.max(mixedBatchMax,Math.abs(ma[i]-me[i]));const mixedBatches=gpu.stats.batches;
      // Reusing a formerly large geometry must not draw stale quads.
      gpu.beginFrame(128,96);gpu.draw({surface:source,pixels:()=>data.data,matrix:new DOMMatrix()});gpu.endFrame();const small=create(),smallContext=small.getContext('2d');smallContext.fillStyle='#0c111b';smallContext.fillRect(0,0,128,96);smallContext.drawImage(source,0,0);const smallPixels=smallContext.getImageData(0,0,128,96).data,one=gpu.readPixels();let reuseMax=0;for(let i=0;i<one.length;i++)reuseMax=Math.max(reuseMax,Math.abs(one[i]-smallPixels[i]));
      const projected=[],projectSource=create(16,16),projectData=new Uint8ClampedArray(16*16*4),projectBg=create();projectBg.getContext('2d').fillStyle='#122334';projectBg.getContext('2d').fillRect(0,0,128,96);for(let y=0;y<16;y++)for(let x=0;x<16;x++)projectData.set([[220,80,40,255],[40,200,80,255],[60,70,240,255],[230,220,50,255]][(x>=8?1:0)+(y>=8?2:0)],(y*16+x)*4);projectSource.getContext('2d').putImageData(new ImageData(projectData,16,16),0,0);
      for(const angles of [[37,23,-17],[0,60,25],[135,-25,40]]){
        const r=spriteRotation(...angles),m=new DOMMatrix().translate(64,48).scale(2,2).multiply(new DOMMatrix([r.a,r.b,r.c,r.d,0,0])),expected=create(),ctx=expected.getContext('2d');ctx.drawImage(projectBg,0,0);ctx.imageSmoothingEnabled=false;ctx.setTransform(m);ctx.drawImage(projectSource,-8,-8);
        gpu.beginFrame(128,96);gpu.draw({surface:projectBg,matrix:new DOMMatrix()});gpu.draw({surface:projectSource,pixels:()=>projectData,matrix:m,x:-8,y:-8});gpu.endFrame();const aa=gpu.readPixels(),ee=ctx.getImageData(0,0,128,96).data;let mean=0,far=0;
        for(let y=0;y<96;y++)for(let x=0;x<128;x++){const i=(y*128+x)*4;let best=Infinity;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||xx>=128||yy<0||yy>=96)continue;const j=(yy*128+xx)*4;best=Math.min(best,Math.max(...[0,1,2,3].map(c=>Math.abs(aa[i+c]-ee[j+c]))));}if(best>3)far++;for(let c=0;c<4;c++)mean+=Math.abs(aa[i+c]-ee[i+c]);}
        projected.push({angles,mean:mean/aa.length,pixelsWithoutReferenceWithinOnePixel:far});
      }
      // Canvas primitives interleaved with sprites and nested masks retain order.
      const host=document.createElement('div'),staging=create();host.append(staging);document.body.append(host);const hybrid=new RenderBackend(staging.getContext('2d'));await hybrid.select('pixi');hybrid.beginFrame();
      const reference=create(),ref=reference.getContext('2d'),sp={key:'test',canvas:source,rgba:data.data};
      for(const [ctx,draw]of [[hybrid.context,()=>hybrid.drawSprite(sp,0,0,'',null)],[ref,()=>ref.drawImage(source,0,0)]]){
        ctx.imageSmoothingEnabled=false;ctx.fillStyle='#123456';ctx.fillRect(0,0,128,96);ctx.save();ctx.beginPath();ctx.rect(4,4,90,80);ctx.clip();ctx.translate(20,20);ctx.scale(3,3);draw();ctx.fillStyle='#ff0044';ctx.fillRect(4,4,9,5);ctx.save();ctx.beginPath();ctx.rect(5,2,8,11);ctx.clip();ctx.translate(6,3);draw();ctx.restore();ctx.globalAlpha=.5;ctx.translate(6,4);draw();ctx.restore();
      }
      hybrid.endFrame();const ha=hybrid.gpu.readPixels(),he=ref.getImageData(0,0,128,96).data;let hybridMax=0;for(let i=0;i<ha.length;i++)hybridMax=Math.max(hybridMax,Math.abs(ha[i]-he[i]));hybrid.gpu.destroy();host.remove();
      let rejectsFractionalClip=false;try{gpu.draw({surface:source,matrix:new DOMMatrix(),clip:[1.3,1,20,20]})}catch(error){rejectsFractionalClip=error.message.includes('Fractional clipping')}
      gpu.clearTextures();gpu.limit=2048;const stable=create(16,16),oldAnimation=create(16,8),newAnimation=create(16,8),smallLayer=create(8,8);gpu.beginFrame(128,96);for(const surface of [stable,oldAnimation,smallLayer])gpu.draw({surface,matrix:new DOMMatrix()});gpu.endFrame();gpu.beginFrame(128,96);for(const surface of [newAnimation,stable,smallLayer])gpu.draw({surface,matrix:new DOMMatrix()});gpu.endFrame();const pinnedUploads=gpu.stats.uploads;
      gpu.clearTextures();gpu.limit=32;let rejectsTextureBudget=false;try{gpu.draw({surface:source,matrix:new DOMMatrix()})}catch(error){rejectsTextureBudget=error.message.includes('texture limit')}
      gpu.destroy();return{indexedCases:indexedCases.length,indexedMax:Math.max(...indexedCases),paletteBatches,indexedBytes,cases:cases.length,maximum:Math.max(...cases.map(c=>c.max)),failures:cases.filter(c=>c.max>3),batched,mixedBatchMax,mixedBatches,reuseMax,projected,hybridMax,pinnedUploads,rejectsFractionalClip,rejectsTextureBudget,details:cases};
    }''')
    result['errors']=errors;Path('work/pixi-pixel-evidence.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:(v[:5] if k=='failures' else v) for k,v in result.items() if k!='details'}))
    assert not errors;assert result['indexedMax']==0 and result['indexedCases']==36 and result['paletteBatches']==2 and result['indexedBytes']==35;assert not result['failures'],result['failures'][:5];assert result['batched']['batches']==1;assert result['mixedBatchMax']<=3 and result['mixedBatches']==2;assert result['reuseMax']<=3;assert result['hybridMax']<=3
    assert all(r['pixelsWithoutReferenceWithinOnePixel']<30 for r in result['projected']),result['projected']
    assert result['pinnedUploads']==1;assert result['rejectsFractionalClip'] and result['rejectsTextureBudget'];browser.close()
