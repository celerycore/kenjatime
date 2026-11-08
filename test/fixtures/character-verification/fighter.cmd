[Command]
name="pusher"
command=a+c
time=1
[Command]
name="orphan"
command=a+b
time=1
[Command]
name="launcher"
command=D,x
time=8
[Command]
name="recovery"
command=x+y
time=1
[Command]
name="fx"
command=x+y
time=1
[Command]
name="clash"
command=b+c
time=1
[Command]
name="hit"
command=x
time=1
[Command]
name="throw"
command=y
time=1
[Command]
name="helper"
command=a
time=1
[Command]
name="shot"
command=b
time=1
[Command]
name="double"
command=z
time=1
[Command]
name="pause"
command=s
time=1
[Statedef -1]
[State Body pushing helper]
type=ChangeState
triggerall=ctrl
trigger1=command="pusher"
value=222
[State Orphan projectile]
type=ChangeState
triggerall=ctrl
trigger1=command="orphan"
value=280
[State Launcher]
type=ChangeState
triggerall=ctrl
trigger1=command="launcher"
value=290
[State FX]
type=ChangeState
triggerall=ctrl
triggerall=statetype!=A
trigger1=command="fx"
value=240
[State Clash]
type=ChangeState
triggerall=ctrl
trigger1=command="clash"
value=270
[State Hit]
type=ChangeState
triggerall=ctrl
trigger1=command="hit"
value=200
[State Throw]
type=ChangeState
triggerall=ctrl
trigger1=command="throw"
value=210
[State Helper]
type=ChangeState
triggerall=ctrl
trigger1=command="helper"
value=220
[State Shot]
type=ChangeState
triggerall=ctrl
trigger1=command="shot"
value=230
[State Double]
type=ChangeState
triggerall=ctrl
trigger1=command="double"
value=250
[State Pause]
type=ChangeState
triggerall=ctrl
trigger1=command="pause"
value=260
