//go:build js

package main

import (
	"io"
	"sync"
	"syscall/js"
	"unsafe"

	"github.com/gopxl/beep/v2"
)

// Keep IKEMEN's mixer/decoders. A browser audio thread pulls bounded PCM blocks
// over a MessagePort instead of running ScriptProcessor on the page's UI thread.
type BeepSpeaker struct {
	mu      sync.Mutex
	mixer   *beep.Mixer
	samples [][2]float64
	pcm     []float32
	pull    js.Func
}

func (s *BeepSpeaker) Init(rate beep.SampleRate, bufferSize int) error {
	s.mixer = &beep.Mixer{}
	s.samples = make([][2]float64, 1024)
	s.pcm = make([]float32, 2048)
	emit := js.Global().Get("__kenjatimeWriteAudio")
	s.pull = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		s.mu.Lock()
		s.mixer.Stream(s.samples)
		s.mu.Unlock()
		for i, v := range s.samples {
			s.pcm[i*2] = float32(v[0])
			s.pcm[i*2+1] = float32(v[1])
		}
		emit.Invoke(uint32(uintptr(unsafe.Pointer(&s.pcm[0]))), len(s.pcm))
		return nil
	})
	js.Global().Set("kenjatimeAudioPull", s.pull)
	js.Global().Call("__kenjatimeAudioInit", int(rate))
	return nil
}
func (s *BeepSpeaker) Play(st beep.Streamer) { s.mu.Lock(); s.mixer.Add(st); s.mu.Unlock() }
func (s *BeepSpeaker) Lock()                 { s.mu.Lock() }
func (s *BeepSpeaker) Unlock()               { s.mu.Unlock() }
func (s *BeepSpeaker) FillAudio()            {}
func (s *BeepSpeaker) Close()                { s.pull.Release() }
func newSpeaker() AudioSink                  { return &BeepSpeaker{} }
func xmpDecode(f io.ReadSeekCloser) (beep.StreamSeekCloser, beep.Format, error) {
	return nil, beep.Format{}, Error("xm module music is not supported in the browser build")
}
