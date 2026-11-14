"""Pixel-level validation of Kenjatime's actual R8/PalFX GLSL in WebGL2.

Uses the shaders from src/core/three-renderer.js, not a reimplementation.
Software WebGL2 proves shader behavior on Chromium, not phone-driver parity.
"""
from pathlib import Path
import json
import re
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
source = (ROOT / "src/core/three-renderer.js").read_text(encoding="utf-8")


def shader(name):
    mark = chr(96)
    match = re.search(r"const " + name + r" = " + mark +
                      r"(.*?)" + mark + r";", source, flags=re.S)
    if not match:
        raise AssertionError("Cannot extract original shader: " + name)
    return match.group(1)


vertex = shader("vertex")
fragment = shader("fragment")

check = r"""
(sources) => {
  const [vertex, fragment] = sources;
  const canvas = document.createElement('canvas');
  canvas.width = 2; canvas.height = 2;
  const gl = canvas.getContext('webgl2', {
    antialias:false, alpha:false, preserveDrawingBuffer:true,
    premultipliedAlpha:false
  });
  if (!gl) throw new Error('WebGL2 unavailable; cannot certify indexed pixel test');
  const compile = (type, code) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, '#version 300 es\n' + code);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      throw new Error('Original shader compile failure: ' + gl.getShaderInfoLog(s));
    return s;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error('Original shader link failure: ' + gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const uniform = name => gl.getUniformLocation(program, name);
  const vertices = new Float32Array([
    0,0,0,0,0, 1,0,0,1,0, 0,1,0,0,1,
    0,1,0,0,1, 1,0,0,1,0, 1,1,0,1,1
  ]);
  const vao=gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const stride=5*4;
  for (const [name, size, offset] of [['position',3,0],['uv',2,3*4]]) {
    const loc = gl.getAttribLocation(program,name);
    if (loc < 0) throw new Error('Original shader missing attribute ' + name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset);
  }
  const identity=new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  const projection=new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, -1,-1,0,1]);
  gl.uniformMatrix4fv(uniform('projectionMatrix'),false,projection);
  gl.uniformMatrix4fv(uniform('modelViewMatrix'),false,identity);
  gl.uniform2f(uniform('size'),2,2);
  gl.uniform1i(uniform('warped'),0);
  gl.uniform1i(uniform('indexed'),1);
  gl.uniform1i(uniform('maskZero'),1);
  gl.uniform1f(uniform('opacity'),1);
  gl.uniform2f(uniform('coefficients'),1,0);
  const fillPalette = new Uint8Array(256*4);
  fillPalette.set([0,0,0,0],0);
  fillPalette.set([255,0,0,255],4);
  fillPalette.set([0,255,0,255],8);
  function tex(unit, internal, width, height, format, bytes) {
    const t=gl.createTexture();
    gl.activeTexture(gl.TEXTURE0+unit);
    gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    gl.texImage2D(gl.TEXTURE_2D,0,internal,width,height,0,
                  format,gl.UNSIGNED_BYTE,bytes);
    return t;
  }
  const indexed = tex(0,gl.R8,2,2,gl.RED,new Uint8Array([1,0,2,1]));
  const palette = tex(1,gl.RGBA8,256,1,gl.RGBA,fillPalette);
  gl.uniform1i(uniform('image'),0);
  gl.uniform1i(uniform('palette'),1);
  const add=new Float32Array(8*3),mul=new Float32Array(8*3),
        post=new Float32Array(8*3),effects=new Float32Array(8*2);
  for (let i=0;i<mul.length;i++)mul[i]=1;
  for (let i=0;i<8;i++)effects[i*2]=1;
  function draw(fxCount,maskZero,addedGreen) {
    add.fill(0);add[1]=addedGreen;
    gl.uniform1i(uniform('fxCount'),fxCount);
    gl.uniform1i(uniform('maskZero'),maskZero?1:0);
    gl.uniform3fv(uniform('fxAdd[0]'),add);
    gl.uniform3fv(uniform('fxMul[0]'),mul);
    gl.uniform3fv(uniform('fxPost[0]'),post);
    gl.uniform2fv(uniform('fxColorInvert[0]'),effects);
    gl.disable(gl.BLEND);
    gl.viewport(0,0,2,2);
    gl.clearColor(0,0,0.5,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,6);
    if(gl.getError()!==gl.NO_ERROR)throw new Error('GL error during palette test');
    const raw=new Uint8Array(16);
    gl.readPixels(0,0,2,2,gl.RGBA,gl.UNSIGNED_BYTE,raw);
    return Array.from({length:4},(_,i)=>Array.from(raw.slice(i*4,(i+1)*4)));
  }
  const base=draw(0,true,0);
  const palfx=draw(1,true,64);
  const unmasked=draw(0,false,0);
  gl.deleteTexture(indexed);gl.deleteTexture(palette);
  gl.deleteBuffer(buf);gl.deleteVertexArray(vao);gl.deleteProgram(program);
  return {base,palfx,unmasked,renderer:gl.getParameter(gl.RENDERER)};
}
"""


def rgb_close(actual, expected, tolerance=1):
    return all(abs(a-b) <= tolerance for a, b in zip(actual, expected))


with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=shutil.which("chromium") or p.chromium.executable_path,
        headless=True,
        args=["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    )
    try:
        page = browser.new_page(viewport={"width": 320, "height": 240})
        page.goto("about:blank")
        result = page.evaluate(check, [vertex, fragment])
    finally:
        browser.close()

# Readback is bottom-left, bottom-right, top-left, top-right. Index zero is
# discarded against the cleared background only when maskZero is enabled.
for key, samples in [
    ("base", [[255,0,0,255],[0,0,128,255],[0,255,0,255],[255,0,0,255]]),
    ("palfx", [[255,64,0,255],[0,0,128,255],[0,255,64,255],[255,64,0,255]]),
    ("unmasked", [[255,0,0,255],[0,0,0,255],[0,255,0,255],[255,0,0,255]]),
]:
    for index, expected in enumerate(samples):
        actual = result[key][index]
        assert rgb_close(actual, expected), (key, index, actual, expected)

print(json.dumps({"webgl2": "pass", "samples": result}, indent=2))
