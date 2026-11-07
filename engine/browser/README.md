# Go browser adapters

These MIT-derived IKEMEN GO browser platform overrides are copied into the pinned
port by build-go-engine.py. Window ownership supports a worker OffscreenCanvas or
an HTML canvas, while retaining logical dimensions and a capped animation pump.
The audio override retains the Go beep mixer/decoders and exports bounded PCM
pulls to the browser's audio thread. It replaces the former Oto ScriptProcessor
sink; native Android binaries and SDL audio are unchanged.
