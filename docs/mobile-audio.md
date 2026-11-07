# Android and browser audio stability

The phone report described breaks, crackles and pauses. Previously the Go
producer and render work shared a worker, with three 1,024-frame stereo buffers.
At 44.1 kHz that is only about 70 ms of headroom. A longer render or decode stall
exhausted the queue even while the AudioWorklet itself kept running.

The PCM pool now adapts to underruns, starting with four buffers on coarse-pointer
devices and three elsewhere. It grows only after starvation, up to eight buffers
(64 KiB of transferable PCM storage). After 30 seconds of healthy playback it
retires surplus fully played buffers, lowering latency without skipping samples.
The pool cap is about 186 ms at 44.1 kHz or 171 ms at 48 kHz; extra headroom trades
some response latency for fewer interruptions. This cannot conceal an indefinitely
blocked or consistently overloaded engine.

An AudioContext is created at its native output rate. That rate is supplied to
the Go mixer before startup, avoiding a forced 44.1 kHz context on a 48 kHz device.
When rates match, the worklet copies samples without fractional resampling.
Existing Go music decoders, volume rules, effects, looping and combat remain.
The ScriptProcessor fallback uses the same queue. Repeated touch events no longer
send redundant resume/status requests while audio is already running.

## Controlled output test

`scripts/benchmark-mobile-audio.py` runs real Go stage music and observes both
worklet underruns and a separate downstream Web Audio analyser. The test inserts
20 intentional 90 ms render-worker stalls, spaced 500 ms apart, during a ten
second measurement. The baseline is source
`8784bfa0135438f07d199607dc3cd83a199ccdfb`. Runs used Chromium/SwiftShader with
phone layout emulation; no physical Infinix result is asserted.

| Observation | Previous queue | Updated queue |
| --- | ---: | ---: |
| Underruns during the stall window | 19 | 0 |
| Analyser polls with silent output | 155 / 1,771 | 0 / 1,796 |
| Intentional producer stalls | 20 | 20 |

The updated queue had already adapted to six buffers during startup. Its measured
queued audio at the start/end of the window was about 119 ms. These are controlled
stall measurements, not phone latency or FPS claims.

Unit regressions verify bounded growth under repeated stalls, rate conversion,
silence/recovery and ordered sample continuity when reducing the pool. Real
Go tests also force a 48 kHz device context and verify that the mixer/worklet
rates match and output remains audible. Muting, resuming, background pause,
both render paths, hit sounds and stage music remain covered.

Recorded measurements and the 48 kHz/fallback checks are in
`mobile-audio-evidence.json`.
