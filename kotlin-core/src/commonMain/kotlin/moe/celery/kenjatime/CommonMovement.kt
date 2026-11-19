package moe.celery.kenjatime

/** Standard movement states for a character whose installation lacks common1.cns.
 * Imported StateDefs replace these independently authored defaults by number. */
internal object CoreCommonMovement {
    val constants = mapOf(
        "velocity.walk.fwd.x" to 2.4, "velocity.walk.back.x" to -2.2,
        "velocity.run.fwd.x" to 4.6, "velocity.run.back.x" to -4.5, "velocity.run.back.y" to -3.8,
        "velocity.jump.neu.x" to 0.0, "velocity.jump.y" to -8.4,
        "velocity.jump.fwd.x" to 2.5, "velocity.jump.back.x" to -2.55, "velocity.runjump.fwd.x" to 4.0,
        "velocity.airjump.neu.x" to 0.0, "velocity.airjump.y" to -8.1,
        "velocity.airjump.fwd.x" to 2.5, "velocity.airjump.back.x" to -2.55,
        "movement.stand.friction" to .85, "movement.crouch.friction" to .82,
        "movement.stand.friction.threshold" to 2.0, "movement.crouch.friction.threshold" to .05,
        "movement.airjump.num" to 0.0, "movement.airjump.height" to 35.0,
        "movement.yaccel" to .7
    )

    private fun controller(type: String, trigger: String, vararg params: Pair<String, String>) =
        StateController(type, params.toMap(), emptyList(), mapOf(1 to listOf(trigger)))
    private fun animation(value: String, trigger: String = "Time = 0") =
        controller("ChangeAnim", "($trigger) && SelfAnimExist($value)", "value" to value)
    private fun transition(value: Int, trigger: String, control: Boolean = true) =
        controller("ChangeState", trigger, "value" to value.toString(), "ctrl" to if (control) "1" else "0")
    private fun velocity(axis: String, value: String, trigger: String) =
        controller("VelSet", trigger, axis to value)

    private val jumpDirection = """ifelse(command = "holdfwd", 1, ifelse(command = "holdback", -1, 0))"""
    private fun jumpX(prefix: String) =
        "ifelse($jumpDirection > 0, Const(velocity.$prefix.fwd.x), ifelse($jumpDirection < 0, Const(velocity.$prefix.back.x), Const(velocity.$prefix.neu.x)))"
    private val jumpReady = "AnimTime = 0 || !SelfAnimExist(40)"
    private val airAction = "ifelse(Vel X = 0, 41, ifelse(Vel X > 0, 42, 43))"
    private val guardEnd = """command != "holdback" || !InGuardDist"""
    private val guardPosture = "ifelse(StateType = A, 2, StateType = C)"
    private fun guard(number: Int, posture: String, vararg controllers: StateController) =
        StateProgram(number, null, listOf(animation(number.toString(), "Anim != $number"), *controllers,
            transition(140, guardEnd)), stateType = posture, physics = posture)

    val defaults = listOf(
        StateProgram(0, null, listOf(animation("0", "Anim != 0"),
            velocity("y", "0", "Time = 0"), velocity("x", "0", "Time >= 4 || abs(Vel X) < Const(movement.stand.friction.threshold)")),
            stateType = "S", physics = "S", control = true),
        StateProgram(10, null, listOf(animation("10"), transition(11, "AnimTime = 0 || !SelfAnimExist(10)")),
            stateType = "C", physics = "C"),
        StateProgram(11, null, listOf(animation("11")), stateType = "C", physics = "C"),
        StateProgram(12, null, listOf(animation("12"), transition(0, "AnimTime = 0 || !SelfAnimExist(12)")),
            stateType = "S", physics = "S"),
        StateProgram(20, null, listOf(
            velocity("x", "Const(velocity.walk.fwd.x)", """command = "holdfwd""""),
            velocity("x", "Const(velocity.walk.back.x)", """command = "holdback""""),
            animation("20", "Vel X > 0 && Anim != 20"), animation("21", "Vel X < 0 && Anim != 21")),
            stateType = "S", physics = "S"),
        StateProgram(40, 40, listOf(
            controller("VelSet", jumpReady,
                "x" to "ifelse(PrevStateNo = 100 && $jumpDirection = 1, Const(velocity.runjump.fwd.x), ${jumpX("jump")})",
                "y" to "Const(velocity.jump.y)"),
            transition(50, jumpReady)), stateType = "S", physics = "S", control = false, faceOpponent = true),
        StateProgram(45, null, listOf(animation("ifelse(SelfAnimExist(44), 44, 41)"),
            controller("VelSet", "Time = 2", "x" to jumpX("airjump"), "y" to "Const(velocity.airjump.y)"),
            transition(50, "Time = 2")), stateType = "A", physics = "N", control = false, velocityX = 0.0, velocityY = 0.0),
        StateProgram(50, null, listOf(animation(airAction), animation("Anim + 3", "Anim = [41,43] && Vel Y > Const720p(-8)")),
            stateType = "A", physics = "A"),
        StateProgram(51, null, emptyList(), stateType = "A", physics = "A"),
        StateProgram(52, 47, listOf(velocity("y", "0", "Time = 0"),
            controller("CtrlSet", "Time = 3", "value" to "1"),
            transition(0, "AnimTime = 0 || !SelfAnimExist(47)")),
            stateType = "S", physics = "S", control = false),
        StateProgram(100, 100, listOf(velocity("x", "Const(velocity.run.fwd.x)", "1"),
            controller("AssertSpecial", "1", "flag" to "nowalk", "flag2" to "noautoturn"),
            transition(0, """command != "holdfwd"""")), stateType = "S", physics = "S"),
        StateProgram(105, 105, listOf(
            controller("VelSet", "Time = 0", "x" to "Const(velocity.run.back.x)", "y" to "Const(velocity.run.back.y)"),
            controller("CtrlSet", "Time = 2", "value" to "1"),
            transition(106, "Pos Y >= 0 && Vel Y > 0", false)),
            stateType = "A", physics = "A", control = false),
        StateProgram(106, 47, listOf(controller("PosSet", "Time = 0", "y" to "0"),
            velocity("y", "0", "Time = 0"), transition(0, "Time = 7")),
            stateType = "S", physics = "S", control = false),
        StateProgram(120, null, listOf(animation("120 + $guardPosture"),
            controller("ChangeState", "AnimTime = 0 && Anim = [120,122]", "value" to "130 + $guardPosture"),
            transition(140, guardEnd)), stateType = "U", physics = "U"),
        guard(130, "S", transition(131, """command = "holddown"""")),
        guard(131, "C", transition(130, """command != "holddown"""")),
        guard(132, "A"),
        StateProgram(140, null, listOf(animation("140 + $guardPosture")), stateType = "U", physics = "U", control = true)
    ).associateBy { it.number }
}
