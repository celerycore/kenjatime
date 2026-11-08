//go:build js

package main

import (
	"math"
	"runtime"
	"syscall/js"
)

// Platform stubs for the browser build.

// GC headroom is set by the boot page via the GOGC env, not here. This used to
// call SetGCPercent(500) from init, which runs after the runtime has read GOGC
// and therefore silently overrode it - so the boot page's measured value never
// took effect and every collection ran at 500's headroom instead.
//
// That matters because more headroom is not free: mark cost scales with the
// live heap and steals the single wasm thread, so a bigger multiplier trades
// frequent short pauses for rare long ones. The boot page settled on GOGC=200
// after measuring stalls up to ~700ms at higher values, which is the number
// that should win. ?gogc= overrides it there.

// Android-only init paths (never taken on js; needed for compilation).
func platformAndroidGLInit() {}
func platformCoreInit() error {
	return nil
}
func platformInitJoysticks() {}

// osPreferredLanguage: the browser knows this natively.
func osPreferredLanguage() string {
	lang := js.Global().Get("navigator").Get("language")
	if lang.Truthy() {
		return lang.String()
	}
	return "en-US"
}

// Stage video frames are hardware/browser decoded by the owning page. The
// worker uploads a transferred ImageBitmap directly; it never copies RGBA via Go.
type bgVideo struct {
	texture Texture
	muted   bool
	id      int
	volume  int
	visible bool
	maxSize int32
}

func (bgv *bgVideo) Open(filename string, volume int, sm BgVideoScaleMode, sf BgVideoScaleFilter, loop bool) error {
	bgv.Close()
	api := js.Global().Get("__kenjatimeVideo")
	if !api.Truthy() {
		return nil
	}
	bgv.id = api.Call("open", filename, loop, int(sm), int(sf), int(sys.scrrect[2]), int(sys.scrrect[3])).Int()
	bgv.volume = volume
	bgv.visible = true
	bgv.updateAudioVolume()
	return nil
}
func (bgv *bgVideo) Tick() error {
	if bgv.id == 0 {
		return nil
	}
	api := js.Global().Get("__kenjatimeVideo")
	frame := api.Call("frame", bgv.id)
	if !frame.Truthy() {
		return nil
	}
	if frame.Get("ended").Truthy() {
		bgv.texture = nil
		return nil
	}
	bitmap := frame.Get("bitmap")
	if !bitmap.Truthy() {
		return nil
	}
	if bgv.maxSize == 0 {
		bgv.maxSize = int32(gfx.(*Renderer_WebGL).glc("getParameter", gfx.(*Renderer_WebGL).c("MAX_TEXTURE_SIZE")).Int())
	}
	w, h := int32(frame.Get("width").Int()), int32(frame.Get("height").Int())
	r := gfx.(*Renderer_WebGL)
	if w <= 0 || h <= 0 || w > bgv.maxSize || h > bgv.maxSize {
		api.Call("consume", bgv.id)
		return Error("Stage video exceeds the graphics texture size limit")
	}
	if bgv.texture == nil || bgv.texture.GetWidth() != w || bgv.texture.GetHeight() != h {
		bgv.texture = gfx.newTexture(w, h, 32, true)
	}
	t := bgv.texture.(*Texture_WebGL)
	t.bindAndPrepare()
	r.glc("texImage2D", r.c("TEXTURE_2D"), 0, r.c("RGBA"), r.c("RGBA"), r.c("UNSIGNED_BYTE"), bitmap)
	api.Call("consume", bgv.id)
	return nil
}
func (bgv *bgVideo) SetPlaying(on bool) {
	if !on && !sys.tickFrame() && !sys.paused {
		return
	}
	if bgv.id != 0 {
		js.Global().Get("__kenjatimeVideo").Call("playing", bgv.id, on)
	}
}
func (bgv *bgVideo) SetVisible(on bool) {
	bgv.visible = on
	if bgv.id != 0 {
		js.Global().Get("__kenjatimeVideo").Call("visible", bgv.id, on)
		bgv.updateAudioVolume()
	}
}
func (bgv *bgVideo) Reset() {
	if bgv.id != 0 {
		bgv.texture = nil
		js.Global().Get("__kenjatimeVideo").Call("reset", bgv.id)
	}
}
func (bgv *bgVideo) Close() {
	if bgv.id != 0 {
		js.Global().Get("__kenjatimeVideo").Call("close", bgv.id)
	}
	bgv.id = 0
	bgv.texture = nil
}
func (bgv *bgVideo) MixerCleared() {}
func (bgv *bgVideo) updateAudioVolume() {
	if bgv.id == 0 {
		return
	}
	volume := float64(bgv.volume)
	if sys.paused {
		volume *= float64(sys.cfg.Sound.PauseMasterVolume) / 100.0
	}
	exponent := -5 + float64(sys.cfg.Sound.BGMVolume)*.06*(float64(sys.cfg.Sound.MasterVolume)/100)*(volume/100)
	if exponent > 1 {
		exponent = 1
	}
	gain := math.Pow(2, exponent)
	_, noMusic := sys.cmdFlags["-nomusic"]
	_, noSound := sys.cmdFlags["-nosound"]
	if exponent <= -5 || bgv.muted || !bgv.visible || noMusic || noSound {
		gain = 0
	}
	js.Global().Get("__kenjatimeVideo").Call("volume", bgv.id, gain)
}

// platformIdleGC forces a garbage collection at moments where a pause is
// invisible (pauses, between rounds). On single-threaded wasm the GC mark
// phase freezes the game thread for ~35-40ms (a visible 2-3 frame hitch);
// collecting at blind spots keeps the automatic mid-round GC from firing.
// Desktop builds don't need this (no-op there).
func platformIdleGC() {
	// Not while a session is live. Rollback re-simulates frames (including
	// round transitions) and a forced GC inside that loop stalls long enough
	// to trip the disconnect timeout. Delay netcode doesn't re-simulate, but
	// these blind spots are only a few frames wide and both peers are
	// lockstepped on them, so a collection here is a stall the other side
	// waits out. Match loads are wide enough to hide one: platformLoadGC.
	if sys.netConnection != nil || sys.rollback.session != nil {
		return
	}
	runtime.GC()
}

// platformLoadGC forces a garbage collection at a match load, the widest blind
// spot there is: the loader already runs for seconds and a peer tolerates
// minutes of it, so a ~40ms mark is invisible even online. This is the one
// place a session can afford to collect, and it means a delay netcode match
// starts on a fresh heap instead of carrying the previous match's garbage into
// the fight, where the automatic GC would eventually fire mid-round.
//
// Rollback still opts out: it re-simulates frames, and stalling that loop is
// what trips the disconnect timeout.
func platformLoadGC() {
	if sys.rollback.session != nil {
		return
	}
	runtime.GC()
}
