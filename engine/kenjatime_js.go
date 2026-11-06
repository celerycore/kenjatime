//go:build js

package main

import "syscall/js"

// Kenjatime's host controls the match; this exposes no engine menu UI.
var kenjatimePressed = map[Key]int{}
var kenjatimeReleased = map[Key]int{}

func kenjatimePollInputs() {
	for key, tick := range kenjatimeReleased {
		if sys.tickCount >= tick {
			OnKeyReleased(key, 0)
			delete(kenjatimeReleased, key)
			delete(kenjatimePressed, key)
		}
	}
}
func init() {
	js.Global().Set("kenjatimeEngineKey", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 2 {
			return nil
		}
		key, ok := jsCodeToKey[args[0].String()]
		if !ok {
			return nil
		}
		if args[1].Bool() {
			delete(kenjatimeReleased, key)
			kenjatimePressed[key] = sys.tickCount
			OnKeyPressed(key, 0)
		} else if tick, ok := kenjatimePressed[key]; ok && sys.tickCount < tick+2 {
			kenjatimeReleased[key] = tick + 2
		} else {
			OnKeyReleased(key, 0)
			delete(kenjatimePressed, key)
		}
		return nil
	}))
	js.Global().Set("kenjatimeEngineSnapshot", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		players := []interface{}{}
		for i := 0; i < 2; i++ {
			if len(sys.chars[i]) > 0 {
				c := sys.chars[i][0]
				players = append(players, map[string]interface{}{"life": c.life, "lifeMax": c.lifeMax, "power": c.power, "powerMax": c.powerMax, "x": c.pos[0], "y": c.pos[1], "screenX": c.screenPosX() * sys.cam.Scale / sys.gameWidth, "screenY": c.screenPosY() * sys.cam.Scale / sys.gameHeight, "state": c.ss.no, "time": c.ss.time})
			}
		}
		fxScale := float32(0)
		fxAnimations := 0
		sparks := 0
		if fx := sys.ffx["f"]; fx != nil {
			fxScale = fx.fx_scale * 320 / float32(fx.localcoord[0])
			fxAnimations = len(fx.animTable.anims)
		}
		for _, effects := range sys.explods {
			for _, e := range effects {
				if e != nil && e.anim != nil && e.anim_ffx == "f" && e.time >= 0 {
					sparks++
				}
			}
		}
		return map[string]interface{}{"players": players, "ticks": sys.tickCount, "paused": sys.paused, "camera": map[string]interface{}{"x": sys.cam.Pos[0], "zoom": sys.cam.Scale, "width": sys.gameWidth, "height": sys.gameHeight}, "effects": map[string]interface{}{"commonScale": fxScale, "commonAnimations": fxAnimations, "activeCommon": sparks}, "music": map[string]interface{}{"file": sys.bgm.filename, "streaming": sys.bgm.streamer != nil, "format": sys.bgm.format}}
	}))
	js.Global().Set("kenjatimeEnginePause", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) > 0 {
			sys.paused = args[0].Bool()
		}
		return nil
	}))
}
