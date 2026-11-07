//go:build js

package main

// Kenjatime's command encoder keeps MUGEN draw order in Go. JavaScript reads
// the live WASM staging slice synchronously, bulk-streams 2D vertices, and
// executes the original GL operations. Direct/cold GL calls flush first.
// The exported memory can grow: submit.js refreshes its views before each call.

import (
	"encoding/binary"
	"math"
	"syscall/js"
	"unsafe"
)

// Opcodes. Must match the switch in engine/webgl/submit.js.
const (
	wcUseProgram  = 1  // progID
	wcUniform1i   = 2  // locID, int
	wcUniform1f   = 3  // locID, f
	wcUniform2f   = 4  // locID, f, f
	wcUniform3f   = 5  // locID, f, f, f
	wcUniform4f   = 6  // locID, f, f, f, f
	wcUniformMat4 = 7  // locID, 16 f
	wcActiveBind  = 8  // unit, texID     (activeTexture(TEXTURE0+unit) + bindTexture)
	wcVertexData  = 9  // bufID, n, n f   (bindBuffer + bufferData STATIC_DRAW)
	wcDrawArrays  = 10 // mode, first, count
	wcEnable      = 11 // cap
	wcDisable     = 12 // cap
	wcBlendEq     = 13 // eq
	wcBlendFunc   = 14 // src, dst
	wcScissor     = 15 // x, y, w, h
	wcDepthMask   = 16 // 0/1
	wcDepthFunc   = 17 // func
	wcBindVAO     = 18 // vaoID
	wcSubData     = 19 // bufID, n, n f   (bindBuffer + bufferSubData at offset 0)
	wcTexParam    = 20 // pname, value    (on TEXTURE_2D of the bound texture)
	wcActiveTex   = 21 // unit
	wcUniform4fv8 = 22 // locID, 8 f      (uniform4fv with two vec4s)

	// 3D model pipeline (render_webgl_model.go). A stage model draws hundreds
	// of primitives a frame, each with ~11 attribute pointers, ~25 uniforms,
	// up to 7 texture binds and a drawElements: one crossing per call would be
	// thousands of crossings per frame.
	wcUniformMat3  = 23 // locID, 9 f
	wcAttribPtr    = 24 // index, size, type, normalized(0/1), stride, offset (vertexAttribPointer)
	wcAttribOff    = 25 // index, f, f, f, f (disableVertexAttribArray + vertexAttrib4f)
	wcDrawElements = 26 // mode, count, offset (UNSIGNED_INT indices)
	wcActiveBindT  = 27 // unit, target, texID (activeTexture + bindTexture on any target)
	wcFrontFace    = 28 // mode
	wcAttribOn     = 29 // index (enableVertexAttribArray)
	wcBindBuffer   = 30 // target, bufID
)

// JavaScript submission is implemented in submit.js and reads live WASM memory.

const wglCmdBufBytes = 1 << 18 // 256KB = 64K words; a heavy frame fits in one flush

type wglCmdBuf struct {
	stage     []byte // Go-side staging (little-endian 4-byte words)
	pos       int    // bytes used
	presentFn js.Value
	streamFn  js.Value
	runFn     js.Value // the interpreter
	tables    js.Value // JS array of registered GL objects
	nextID    int      // next table slot
}

func (r *Renderer_WebGL) initCmdBuf() {
	cb := &r.cmd
	cb.stage = make([]byte, wglCmdBufBytes)
	cb.tables = js.Global().Get("Array").New()
	factory := js.Global().Get("__kenjatimeCreateGPU")
	memory := js.Global().Get("__kenjatimeWasmMemory")
	if factory.Type() != js.TypeFunction || !memory.Truthy() {
		panic(Error("Kenjatime GPU bridge is missing"))
	}
	cb.runFn = factory.Invoke(r.gl, memory, cb.tables)
	cb.presentFn = cb.runFn.Get("present")
	cb.streamFn = cb.runFn.Get("stream")
	js.Global().Set("__kenjatimeGPU", cb.runFn.Get("stats"))
}

// regJS registers a JS-held GL object into the interpreter's table and returns
// its integer handle. Cold path only (object creation).
func (r *Renderer_WebGL) regJS(v js.Value) int32 {
	id := r.cmd.nextID
	r.cmd.nextID++
	r.cmd.tables.SetIndex(id, v)
	return int32(id)
}

// unregJS drops a table entry so the JS object it pinned can be collected.
// The slot is not reused. Callers flush first (any glc does), so no pending
// command still names the slot.
func (r *Renderer_WebGL) unregJS(id int32) {
	if id >= 0 && int(id) < r.cmd.nextID {
		r.cmd.tables.SetIndex(int(id), js.Null())
	}
}

// regLoc registers a uniform location, or returns -1 for an invalid one
// (mirrors the !loc.Truthy() guards in the uniform setters).
func (r *Renderer_WebGL) regLoc(loc js.Value) int32 {
	if !loc.Truthy() {
		return -1
	}
	return r.regJS(loc)
}

func (r *Renderer_WebGL) flushCmds() {
	if r.cmd.pos == 0 {
		return
	}
	r.cmd.runFn.Invoke(uint32(uintptr(unsafe.Pointer(&r.cmd.stage[0]))), r.cmd.pos/4)
	r.cmd.pos = 0
}

// glc is the direct-call escape hatch: flush pending commands first so the GL
// stream stays in program order, then issue the call normally. Every gl.Call
// outside the emitters below MUST go through this (or through a path that has
// already flushed, like bindAndPrepare).
func (r *Renderer_WebGL) glc(name string, args ...interface{}) js.Value {
	r.flushCmds()
	return r.gl.Call(name, args...)
}

// need ensures capacity for n more words, flushing if the buffer is near full.
func (r *Renderer_WebGL) need(nWords int) {
	if r.cmd.pos+nWords*4 > wglCmdBufBytes {
		r.flushCmds()
	}
}

func (r *Renderer_WebGL) emitI(v int32) {
	binary.LittleEndian.PutUint32(r.cmd.stage[r.cmd.pos:], uint32(v))
	r.cmd.pos += 4
}

func (r *Renderer_WebGL) emitF(v float32) {
	binary.LittleEndian.PutUint32(r.cmd.stage[r.cmd.pos:], math.Float32bits(v))
	r.cmd.pos += 4
}
