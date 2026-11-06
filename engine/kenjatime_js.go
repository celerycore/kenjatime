//go:build js

package main

import "syscall/js"

// Kenjatime's host controls the match; this exposes no engine menu UI.
var kenjatimePressed=map[Key]int{}
var kenjatimeReleased=map[Key]int{}
func kenjatimePollInputs(){for key,tick:=range kenjatimeReleased{if sys.tickCount>=tick{OnKeyReleased(key,0);delete(kenjatimeReleased,key);delete(kenjatimePressed,key)}}}
func init() {
 js.Global().Set("kenjatimeEngineKey",js.FuncOf(func(this js.Value,args []js.Value) interface{} {
  if len(args)<2{return nil};key,ok:=jsCodeToKey[args[0].String()];if !ok{return nil}
  if args[1].Bool(){delete(kenjatimeReleased,key);kenjatimePressed[key]=sys.tickCount;OnKeyPressed(key,0)}else if tick,ok:=kenjatimePressed[key];ok&&sys.tickCount<tick+2{kenjatimeReleased[key]=tick+2}else{OnKeyReleased(key,0);delete(kenjatimePressed,key)}
  return nil
 }))
 js.Global().Set("kenjatimeEngineSnapshot",js.FuncOf(func(this js.Value,args []js.Value) interface{} {
  players:=[]interface{}{}
  for i:=0;i<2;i++ {if len(sys.chars[i])>0 {c:=sys.chars[i][0];players=append(players,map[string]interface{}{"life":c.life,"x":c.pos[0],"y":c.pos[1],"state":c.ss.no,"time":c.ss.time})}}
  return map[string]interface{}{"players":players,"ticks":sys.tickCount,"paused":sys.paused}
 }))
 js.Global().Set("kenjatimeEnginePause",js.FuncOf(func(this js.Value,args []js.Value) interface{} {if len(args)>0 {sys.paused=args[0].Bool()};return nil}))
}
