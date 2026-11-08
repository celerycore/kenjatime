//go:build js

package main

import (
	"fmt"
	"strings"
	"syscall/js"
)

// Four lights, six faces each, in one WebGL2 depth texture. The atlas replaces
// native cube-array/geometry shaders while retaining IKEMEN's light matrices,
// material alpha masks, skinning, morph targets and castShadow selection.
type wglShadow struct {
	draws int

	ready, failed, haveFrame bool
	shader, original         *ShaderProgram_WebGL
	texture                  *Texture_WebGL
	fbo, vao, originalVAO    js.Value
	vaoID                    int32
	size                     int
	matrices                 [24][16]float32
	types                    [4]int
	light                    int
	originalLoc              [wmaCount]int32
	originalOn               [wmaCount]bool
	attrOn                   [wmaCount]bool
}

const wglShadowAtlasSampler = `
uniform highp sampler2D shadowAtlas;
float shadowAtlasDepth(vec4 coords) {
 vec3 d=coords.xyz,a=abs(d);vec2 uv;float face;
 if(a.x>=a.y&&a.x>=a.z){if(d.x>=0.0){face=0.0;uv=vec2(-d.z,-d.y)/a.x;}else{face=1.0;uv=vec2(d.z,-d.y)/a.x;}}
 else if(a.y>=a.z){if(d.y>=0.0){face=2.0;uv=vec2(d.x,d.z)/a.y;}else{face=3.0;uv=vec2(d.x,-d.z)/a.y;}}
 else{if(d.z>=0.0){face=4.0;uv=vec2(d.x,-d.y)/a.z;}else{face=5.0;uv=vec2(-d.x,-d.y)/a.z;}}
 vec2 tile=vec2(textureSize(shadowAtlas,0))/vec2(6.0,4.0);
 uv=clamp(uv*0.5+0.5,0.5/tile,1.0-0.5/tile);
 return texture(shadowAtlas,(vec2(face,coords.w)+uv)/vec2(6.0,4.0)).r;
}
`

// Native GL33-style bias units are retained. GLES' old multiplication by
// farPlane*1024 suppresses practically every point/spot shadow on a small atlas.
const wglShadowCalculations = `
float shadowBiasFor(float ndotl,float authored){return max(authored*tan(acos(clamp(ndotl,0.001,0.9999))),0.00001);}
float projectedShadowDepth(int index,vec2 xy){return shadowAtlasDepth(vec4(1.0,-(xy.y*2.0-1.0),-(xy.x*2.0-1.0),float(index)));}
float DirectionalLightShadowCalculation(int index,vec4 lightSpacePos,float ndotl,float bias){
 if(!useShadowMap||lightSpacePos.w==0.0)return 1.0;vec3 p=lightSpacePos.xyz/lightSpacePos.w*0.5+0.5;
 if(any(lessThan(p,vec3(0.0)))||any(greaterThan(p,vec3(1.0))))return 1.0;
 return projectedShadowDepth(index,p.xy)+shadowBiasFor(ndotl,bias)<p.z?0.0:1.0;
}
float SpotLightShadowCalculation(int index,vec3 pointToLight,vec4 lightSpacePos,float ndotl,float farPlane,float bias){
 if(!useShadowMap||lightSpacePos.w<=0.0)return 1.0;vec3 p=lightSpacePos.xyz/lightSpacePos.w*0.5+0.5;
 if(any(lessThan(p,vec3(0.0)))||any(greaterThan(p,vec3(1.0))))return 1.0;
 return projectedShadowDepth(index,p.xy)*farPlane+shadowBiasFor(ndotl,bias)<length(pointToLight)?0.0:1.0;
}
float PointLightShadowCalculation(int index,vec3 pointToLight,float ndotl,float farPlane,float bias){
 if(!useShadowMap||length(pointToLight)>=farPlane)return 1.0;
 return shadowAtlasDepth(vec4(-pointToLight,float(index)))*farPlane+shadowBiasFor(ndotl,bias)<length(pointToLight)?0.0:1.0;
}
`

func wglShadowModelFragment(source string) string {
	source = strings.Replace(source, "uniform highp samplerCubeArray shadowCubeMap;", wglShadowAtlasSampler, 1)
	source = strings.ReplaceAll(source, "(texture(shadowCubeMap, coords).r)", "shadowAtlasDepth(coords)")
	source = strings.Replace(source, "const bool useShadowMap = true;", "uniform bool useShadowMap;", 1)
	start, end := strings.Index(source, "float DirectionalLightShadowCalculation"), strings.Index(source, "vec3 getNormal()")
	if start >= 0 && end > start {
		source = source[:start] + wglShadowCalculations + source[end:]
	}
	return "#define ENABLE_SHADOW\n" + source
}

func (r *Renderer_WebGL) initShadowAtlas() error {
	m := &r.model
	s := &m.shadow
	// Allocated only when a lit model actually asks for a shadow pass. A normal
	// 2D fight pays no atlas or shadow geometry allocation cost.
	max := r.glc("getParameter", r.c("MAX_TEXTURE_SIZE")).Int()
	quality := js.Global().Get("__kenjatimeQuality").String()
	s.size = 512
	if quality != "high" && quality != "sharp" {
		s.size = 256
	}
	if quality == "low" {
		s.size = 128
	}
	if max/6 < s.size {
		s.size = max / 6
	}
	if s.size < 64 {
		return Error("graphics device has no usable shadow atlas size")
	}
	vert := strings.ReplaceAll(shadowVertShader, "vertexId", "inVertexId")
	for _, name := range []string{"FragPos", "vColor", "texcoord"} {
		vert = strings.ReplaceAll(vert, name+"In", name)
	}
	var err error
	s.shader, err = r.buildModelProgram(vert, shadowFragShader, "Shadow Atlas Shader")
	if err != nil {
		return err
	}
	s.shader.RegisterAttributes(wglModelAttrNames[:]...)
	s.shader.RegisterUniforms("model", "lightMatrix", "numVertices", "numJoints", "numTargets", "morphTargetOffset", "morphTargetWeight", "morphTargetTextureDimension", "enableAlpha", "alphaThreshold", "baseColorFactor", "useTexture", "texTransform", "lightIndex")
	for i := 0; i < 4; i++ {
		s.shader.RegisterUniforms(fmt.Sprintf("lights[%d].type", i), fmt.Sprintf("lights[%d].position", i), fmt.Sprintf("lights[%d].shadowMapFar", i))
	}
	s.shader.RegisterTextures("tex", "jointMatrices", "morphTargetValues")
	s.vao = r.glc("createVertexArray")
	s.vaoID = r.regJS(s.vao)
	s.texture = r.generateTexture(int32(s.size*6), int32(s.size*4), 32, false)
	r.SetActiveTexture0()
	r.glc("bindTexture", r.c("TEXTURE_2D"), s.texture.handle)
	r.glc("texImage2D", r.c("TEXTURE_2D"), 0, r.c("DEPTH_COMPONENT24"), s.size*6, s.size*4, 0, r.c("DEPTH_COMPONENT"), r.c("UNSIGNED_INT"), js.Null())
	for _, p := range []string{"TEXTURE_MIN_FILTER", "TEXTURE_MAG_FILTER"} {
		r.glc("texParameteri", r.c("TEXTURE_2D"), r.c(p), r.c("NEAREST"))
	}
	for _, p := range []string{"TEXTURE_WRAP_S", "TEXTURE_WRAP_T"} {
		r.glc("texParameteri", r.c("TEXTURE_2D"), r.c(p), r.c("CLAMP_TO_EDGE"))
	}
	s.fbo = r.glc("createFramebuffer")
	r.glc("bindFramebuffer", r.c("FRAMEBUFFER"), s.fbo)
	r.glc("framebufferTexture2D", r.c("FRAMEBUFFER"), r.c("DEPTH_ATTACHMENT"), r.c("TEXTURE_2D"), s.texture.handle, 0)
	r.glc("drawBuffers", js.ValueOf([]interface{}{r.ci("NONE")}))
	r.glc("readBuffer", r.c("NONE"))
	if r.glc("checkFramebufferStatus", r.c("FRAMEBUFFER")).Int() != r.ci("FRAMEBUFFER_COMPLETE") {
		r.glc("bindFramebuffer", r.c("FRAMEBUFFER"), r.fbo)
		return Error("incomplete shadow framebuffer")
	}
	r.glc("bindFramebuffer", r.c("FRAMEBUFFER"), r.fbo)
	s.ready = true
	return nil
}

func (r *Renderer_WebGL) prepareShadowMapPipeline(bufferIndex uint32) {
	m := &r.model
	s := &m.shadow
	if !r.IsShadowEnabled() {
		return
	}
	if !s.ready {
		if err := r.initShadowAtlas(); err != nil {
			s.failed = true
			r.wglWarn("WebGL shadows disabled: " + err.Error())
			return
		}
	}
	s.original, s.originalVAO, s.originalLoc, s.originalOn = m.shader, m.vao, m.attrLoc, m.attrOn
	m.shader, m.vao, m.attrOn = s.shader, s.vao, s.attrOn
	for i, name := range wglModelAttrNames {
		m.attrLoc[i] = int32(s.shader.attributes[name])
	}
	m.savedBlend, m.savedEq, m.savedSrc, m.savedDst = r.blendEnabled, r.blendEquation, r.blendSrc, r.blendDst
	m.savedDepth, m.savedDepthWr = r.depthTest, r.depthMask
	m.active = true
	r.ChangeProgram(s.shader)
	r.need(2)
	r.emitI(wcBindVAO)
	r.emitI(s.vaoID)
	r.need(6)
	r.emitI(wcBindBuffer)
	r.emitI(int32(r.ci("ARRAY_BUFFER")))
	r.emitI(m.vbufID[bufferIndex])
	r.emitI(wcBindBuffer)
	r.emitI(int32(r.ci("ELEMENT_ARRAY_BUFFER")))
	r.emitI(m.ibufID[bufferIndex])
	r.SetDepthTest(true)
	r.SetDepthMask(true)
	r.DisableBlending()
	r.glc("bindFramebuffer", r.c("FRAMEBUFFER"), s.fbo)
	r.shadowScissor(0, 0, int32(s.size*6), int32(s.size*4))
	r.glc("viewport", 0, 0, s.size*6, s.size*4)
	r.glc("clearDepth", 1)
	r.glc("clear", r.ci("DEPTH_BUFFER_BIT"))
	for name, unit := range s.shader.textures {
		r.bindTexUnit(unit, wglTEXTURE_2D, m.dummy2D)
		r.SetUniformISub(s.shader, s.shader.uniformIndex(name), int32(unit))
	}
	s.haveFrame = true
}
func (r *Renderer_WebGL) setShadowMapPipeline(doubleSided, invertFrontFace, useUV, useNormal, useTangent, useVertColor, useJoint0, useJoint1 bool, numVertices, offset uint32) {
	if r.model.shadow.original == nil {
		return
	}
	r.SetModelPipeline(BlendAdd, BlendOne, BlendZero, true, true, doubleSided, invertFrontFace, useUV, useNormal, useTangent, useVertColor, useJoint0, useJoint1, false, numVertices, offset)
	r.DisableBlending()
}
func (r *Renderer_WebGL) ReleaseShadowPipeline() {
	m := &r.model
	s := &m.shadow
	if s.original == nil {
		return
	}
	r.ReleaseModelPipeline()
	s.attrOn = m.attrOn
	m.shader, m.vao, m.attrLoc, m.attrOn = s.original, s.originalVAO, s.originalLoc, s.originalOn
	s.original = nil
	r.glc("bindFramebuffer", r.c("FRAMEBUFFER"), r.fbo)
	r.glc("viewport", 0, 0, sys.scrrect[2], sys.scrrect[3])
	r.DisableScissor()
}
func (r *Renderer_WebGL) SetShadowMapUniformI(name string, val int) {
	s := &r.model.shadow
	if s.original == nil {
		return
	}
	if name == "lightIndex" {
		s.light = val
	}
	var i int
	if _, err := fmt.Sscanf(name, "lights[%d].type", &i); err == nil && i >= 0 && i < 4 {
		s.types[i] = val
	}
	r.SetModelUniformI(name, val)
}
func (r *Renderer_WebGL) SetShadowMapUniformF(name string, v ...float32) {
	if r.model.shadow.original != nil {
		r.SetModelUniformF(name, v...)
	}
}
func (r *Renderer_WebGL) SetShadowMapUniformFv(name string, v []float32) {
	if r.model.shadow.original != nil {
		r.SetModelUniformFv(name, v)
	}
}
func (r *Renderer_WebGL) SetShadowMapUniformMatrix(name string, v []float32) {
	s := &r.model.shadow
	if s.original == nil {
		return
	}
	var i int
	if _, err := fmt.Sscanf(name, "lightMatrices[%d]", &i); err == nil && i >= 0 && i < 24 && len(v) >= 16 {
		copy(s.matrices[i][:], v)
		return
	}
	r.SetModelUniformMatrix(name, v)
}
func (r *Renderer_WebGL) SetShadowMapUniformMatrix3(name string, v []float32) {
	if r.model.shadow.original != nil {
		r.SetModelUniformMatrix3(name, v)
	}
}
func (r *Renderer_WebGL) SetShadowMapTexture(name string, t Texture) {
	if r.model.shadow.original != nil {
		r.SetModelTexture(name, t)
	}
}
func (r *Renderer_WebGL) SetShadowFrameTexture(i uint32)     {}
func (r *Renderer_WebGL) SetShadowFrameCubeTexture(i uint32) {}
func (r *Renderer_WebGL) shadowScissor(x, y, w, h int32) {
	r.scissorPending = false
	if !r.scissorEnabled {
		r.need(2)
		r.emitI(wcEnable)
		r.emitI(int32(r.ci("SCISSOR_TEST")))
		r.scissorEnabled = true
	}
	r.need(5)
	r.emitI(wcScissor)
	r.emitI(x)
	r.emitI(y)
	r.emitI(w)
	r.emitI(h)
	r.scissorRect = [4]int32{x, y, w, h}
}
func (r *Renderer_WebGL) RenderShadowMapElements(mode PrimitiveMode, count, offset int) {
	s := &r.model.shadow
	if s.original == nil || s.light < 0 || s.light >= 4 {
		return
	}
	faces := 1
	if s.types[s.light] == 2 {
		faces = 6
	}
	for face := 0; face < faces; face++ {
		x, y := face*s.size, s.light*s.size
		r.shadowScissor(int32(x), int32(y), int32(s.size), int32(s.size))
		r.glc("viewport", x, y, s.size, s.size)
		r.SetModelUniformMatrix("lightMatrix", s.matrices[s.light*6+face][:])
		r.RenderElements(mode, count, offset)
		s.draws++
	}
}
