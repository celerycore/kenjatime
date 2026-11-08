//go:build js

package main

import (
	"encoding/binary"
	"io"
	"math"
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
	defer f.Close()
	data, err := io.ReadAll(io.LimitReader(f, 128*1024*1024+1))
	if err != nil || len(data) > 128*1024*1024 {
		return nil, beep.Format{}, Error("Module music exceeds the supported size")
	}
	decoder := js.Global().Get("__kenjatimeModuleMusic")
	if !decoder.Truthy() {
		return nil, beep.Format{}, Error("Module music decoder is unavailable")
	}
	input := js.Global().Get("Uint8Array").New(len(data))
	js.CopyBytesToJS(input, data)
	var handle js.Value
	func() {
		defer func() {
			if recover() != nil {
				handle = js.Undefined()
			}
		}()
		decoder.Call("close") // BGM is a single channel; release the replaced song.
		handle = decoder.Call("open", input, sys.cfg.Sound.SampleRate)
	}()
	if !handle.Truthy() {
		return nil, beep.Format{}, Error("Module music is damaged or unsupported")
	}
	return &moduleMusicStream{handle: handle, pcm: make([]byte, 2048*8)}, beep.Format{SampleRate: beep.SampleRate(sys.cfg.Sound.SampleRate), NumChannels: 2, Precision: 4}, nil
}

type moduleMusicStream struct {
	handle js.Value
	pcm    []byte
	closed bool
}

func (s *moduleMusicStream) Stream(samples [][2]float64) (int, bool) {
	if s.closed {
		return 0, false
	}
	total := 0
	for total < len(samples) {
		n := s.handle.Call("read", Min(2048, len(samples)-total)).Int()
		if n == 0 {
			break
		}
		js.CopyBytesToGo(s.pcm, s.handle.Get("pcm"))
		for i := 0; i < n; i++ {
			samples[total+i] = [2]float64{float64(math.Float32frombits(binary.LittleEndian.Uint32(s.pcm[i*8:]))), float64(math.Float32frombits(binary.LittleEndian.Uint32(s.pcm[i*8+4:])))}
		}
		total += n
	}
	return total, total > 0
}
func (s *moduleMusicStream) Err() error    { return nil }
func (s *moduleMusicStream) Len() int      { return s.handle.Get("length").Int() }
func (s *moduleMusicStream) Position() int { return s.handle.Get("position").Int() }
func (s *moduleMusicStream) Seek(position int) error {
	if s.closed || position < 0 || position > s.Len() {
		return Error("Invalid module music seek")
	}
	s.handle.Call("seek", position)
	return nil
}
func (s *moduleMusicStream) Close() error {
	if !s.closed {
		s.handle.Call("close")
		s.closed = true
		s.pcm = nil
	}
	return nil
}
