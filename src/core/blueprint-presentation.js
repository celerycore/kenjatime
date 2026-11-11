/**
 * Opt-in raw WebGL2 presentation path for Kotlin/Wasm. This is intentionally
 * separate from the deployed Three.js renderer until visual/mobile parity.
 * GPU sprite pixels remain R8 indexed textures; palette lookup is performed
 * by the fragment shader and never on the CPU during a frame.
 */
export const INDEXED_VERTEX = `#version 300 es
precision highp float;
in vec2 a_vertex;
uniform vec4 u_rect;
uniform vec2 u_viewport;
uniform vec3 u_camera;
uniform float u_parallax;
uniform vec2 u_shadow;
out vec2 v_uv;
void main() {
  v_uv = a_vertex;
  vec2 local = vec2(a_vertex.x * u_rect.z, a_vertex.y * u_rect.w);
  local.x += (1.0 - a_vertex.y) * u_shadow.x;
  local.y *= u_shadow.y;
  vec2 world = u_rect.xy + local;
  vec2 screen = u_viewport * 0.5 + (world - u_camera.xy * u_parallax) * u_camera.z;
  vec2 clip = screen / u_viewport * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;
export const INDEXED_FRAGMENT = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_index;
uniform sampler2D u_palette;
out vec4 color;
void main() {
  float idx = floor(texture(u_index, v_uv).r * 255.0 + 0.5);
  if (idx < 0.5) discard;
  color = texture(u_palette, vec2((idx + 0.5) / 256.0, 0.5));
  if (color.a <= 0.0) discard;
}`;
const POST_VERTEX = `#version 300 es
precision highp float;
in vec2 a_vertex;
out vec2 v_uv;
void main() {
  v_uv = a_vertex;
  gl_Position = vec4(a_vertex * 2.0 - 1.0, 0.0, 1.0);
}`;
const POST_FRAGMENT = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_background;
uniform float u_desaturate;
uniform vec3 u_tint;
out vec4 color;
void main() {
  vec4 bg = texture(u_background, v_uv);
  float grey = dot(bg.rgb, vec3(0.299, 0.587, 0.114));
  color = vec4(mix(bg.rgb, vec3(grey), u_desaturate) * u_tint, bg.a);
}`;

function shader(gl, type, source) {
  const compiled = gl.createShader(type);
  if (!compiled) throw Error("Failed to allocate WebGL shader");
  gl.shaderSource(compiled, source);
  gl.compileShader(compiled);
  if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(compiled);
    gl.deleteShader(compiled);
    throw Error("WebGL shader: " + info);
  }
  return compiled;
}
function program(gl, vertex, fragment) {
  const v = shader(gl, gl.VERTEX_SHADER, vertex);
  const f = shader(gl, gl.FRAGMENT_SHADER, fragment);
  const result = gl.createProgram();
  if (!result) throw Error("Failed to allocate WebGL program");
  gl.attachShader(result, v);
  gl.attachShader(result, f);
  gl.linkProgram(result);
  gl.deleteShader(v); gl.deleteShader(f);
  if (!gl.getProgramParameter(result, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(result);
    gl.deleteProgram(result);
    throw Error("WebGL program: " + log);
  }
  return result;
}
function quad(gl, prog) {
  const vao = gl.createVertexArray();
  const buffer = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,1,0,0,1,1,1]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(prog, "a_vertex");
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  return { vao, buffer };
}
function texture(gl, width, height, internal, format, pixels) {
  const result = gl.createTexture();
  if (!result) throw Error("Failed to allocate WebGL texture");
  gl.bindTexture(gl.TEXTURE_2D, result);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, gl.UNSIGNED_BYTE, pixels);
  return result;
}
function dimensions(width,height,max) {
  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) ||
      width < 1 || height < 1 || width > max || height > max) throw RangeError("Invalid texture dimensions");
}
/**
 * drawIndexed must be called after beginBackground/finishBackground so the
 * character pass is never dimmed by supers. Caller owns gameplay state.
 */
export function createBlueprintWebGL2(gl, {maxTextureBytes = 64 * 1024 * 1024} = {}) {
  if (!gl || typeof gl.createVertexArray !== "function" || !gl.R8)
    throw TypeError("WebGL2 is required");
  const maxDim = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const sprites = new Map(), palettes = new Map();
  const spriteProgram = program(gl, INDEXED_VERTEX, INDEXED_FRAGMENT);
  const postProgram = program(gl, POST_VERTEX, POST_FRAGMENT);
  const spriteQuad = quad(gl, spriteProgram), postQuad = quad(gl, postProgram);
  const framebuffer = gl.createFramebuffer();
  let background = null, bgWidth = 0, bgHeight = 0, textureBytes = 0, disposed = false;
  const requireOpen = () => { if(disposed) throw Error("Renderer disposed"); };
  const reserve = bytes => {
    if (!Number.isSafeInteger(bytes) || bytes > maxTextureBytes - textureBytes)
      throw RangeError("GPU texture budget exceeded");
  };
  const upload = (collection,id,pixels,width,height,channels) => {
    requireOpen();
    dimensions(width,height,maxDim);
    if (collection.has(id)) throw Error("Texture id already in use");
    const bytes=width*height*channels;
    if (!(pixels instanceof Uint8Array) || pixels.byteLength!==bytes)
      throw TypeError("Texture payload length mismatch");
    reserve(bytes);
    const tex=texture(gl,width,height,channels===1?gl.R8:gl.RGBA8,
      channels===1?gl.RED:gl.RGBA,pixels);
    collection.set(id,{tex,bytes});
    textureBytes+=bytes;
  };
  const deleteCollection=(collection,id)=>{
    const entry=collection.get(id);
    if(!entry) return false;
    gl.deleteTexture(entry.tex); textureBytes-=entry.bytes;collection.delete(id);
    return true;
  };
  return {
    uploadSprite(id,pixels,width,height){upload(sprites,id,pixels,width,height,1);},
    uploadPalette(id,pixels){
      if (!(pixels instanceof Uint8Array) || pixels.length!==1024) throw TypeError("Palette must be 256 RGBA entries");
      upload(palettes,id,pixels,256,1,4);
    },
    releaseSprite(id){requireOpen();return deleteCollection(sprites,id);},
    releasePalette(id){requireOpen();return deleteCollection(palettes,id);},
    beginBackground(width,height){
      requireOpen();dimensions(width,height,maxDim);
      if(!background || width!==bgWidth || height!==bgHeight){
        const bytes=width*height*4;
        reserve(bytes-(background ? bgWidth*bgHeight*4:0));
        if(background){gl.deleteTexture(background);textureBytes-=bgWidth*bgHeight*4;}
        background=texture(gl,width,height,gl.RGBA8,gl.RGBA,null);
        bgWidth=width;bgHeight=height;textureBytes+=bytes;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER,framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,background,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)
        throw Error("Incomplete WebGL2 background FBO");
      gl.viewport(0,0,width,height);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    finishBackground({desaturate=0,tint=[1,1,1]}={}){
      requireOpen();if(!background) throw Error("beginBackground is required");
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
      gl.viewport(0,0,bgWidth,bgHeight);
      gl.useProgram(postProgram);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,background);
      gl.uniform1i(gl.getUniformLocation(postProgram,"u_background"),0);
      gl.uniform1f(gl.getUniformLocation(postProgram,"u_desaturate"),Math.max(0,Math.min(1,desaturate)));
      gl.uniform3f(gl.getUniformLocation(postProgram,"u_tint"),...tint);
      gl.bindVertexArray(postQuad.vao);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      gl.bindVertexArray(null);
    },
    drawIndexed({sprite,palette,x,y,width,height,viewportWidth,viewportHeight,
        cameraX=0,cameraY=0,zoom=1,parallax=1,shadowSkew=0,shadowScaleY=1}){
      requireOpen();
      const s=sprites.get(sprite),p=palettes.get(palette);
      if(!s || !p) throw Error("Missing indexed sprite or palette");
      if(![x,y,width,height,viewportWidth,viewportHeight,cameraX,cameraY,zoom,parallax,shadowSkew,shadowScaleY]
          .every(Number.isFinite) || width<=0 || height<=0 || zoom<=0)
        throw RangeError("Invalid sprite transform");
      gl.useProgram(spriteProgram);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,s.tex);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,p.tex);
      gl.uniform1i(gl.getUniformLocation(spriteProgram,"u_index"),0);
      gl.uniform1i(gl.getUniformLocation(spriteProgram,"u_palette"),1);
      gl.uniform4f(gl.getUniformLocation(spriteProgram,"u_rect"),x,y,width,height);
      gl.uniform2f(gl.getUniformLocation(spriteProgram,"u_viewport"),viewportWidth,viewportHeight);
      gl.uniform3f(gl.getUniformLocation(spriteProgram,"u_camera"),cameraX,cameraY,zoom);
      gl.uniform1f(gl.getUniformLocation(spriteProgram,"u_parallax"),parallax);
      gl.uniform2f(gl.getUniformLocation(spriteProgram,"u_shadow"),shadowSkew,shadowScaleY);
      gl.bindVertexArray(spriteQuad.vao);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      gl.bindVertexArray(null);
    },
    get textureBytes(){return textureBytes;},
    dispose(){
      if(disposed)return;disposed=true;
      for(const key of sprites.keys())deleteCollection(sprites,key);
      for(const key of palettes.keys())deleteCollection(palettes,key);
      if(background)gl.deleteTexture(background);
      gl.deleteFramebuffer(framebuffer);
      for(const q of [spriteQuad,postQuad]){gl.deleteBuffer(q.buffer);gl.deleteVertexArray(q.vao);}
      gl.deleteProgram(spriteProgram);gl.deleteProgram(postProgram);
      background=null;textureBytes=0;
    }
  };
}

/** Presentation-only rollback smoothing: never feed the value into physics. */
export class PredictionSmoother {
  constructor({blend=0.3,hardPop=15}={}){
    if(!(blend>0 && blend<=1) || !(hardPop>0))throw RangeError("Invalid blending parameters");
    this.blend=blend;this.hardPop=hardPop;this.x=0;this.y=0;this.lastX=0;this.lastY=0;this.initialized=false;
  }
  update(logicalX,logicalY){
    if(!Number.isFinite(logicalX)||!Number.isFinite(logicalY))throw TypeError("Invalid logical position");
    if(!this.initialized){this.x=logicalX;this.y=logicalY;this.initialized=true;}
    else{
      if(Math.abs(logicalX-this.lastX)>this.hardPop || Math.abs(logicalY-this.lastY)>this.hardPop){
        this.x=this.lastX;this.y=this.lastY;
      }
      this.x+=(logicalX-this.x)*this.blend;
      this.y+=(logicalY-this.y)*this.blend;
    }
    this.lastX=logicalX;this.lastY=logicalY;
    return {x:this.x,y:this.y};
  }
  reset(){this.initialized=false;}
}
