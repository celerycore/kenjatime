package moe.celery.kenjatime

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue
import kotlin.test.assertFailsWith

class CoreTest {
    @Test fun defPreservesDuplicateSectionsAndCase() {
        val def = MugenDefParser.parse("[Info]\nName = \"A;B\" ;comment\n[State 200, A]\nType: HitDef\n[State 200, B]\ntype= ChangeState")
        assertEquals("A;B", def.section("INFO")?.get("NAME"))
        assertEquals(2, def.sectionsNamed("state 200, a").size + def.sectionsNamed("state 200, b").size)
    }
    @Test fun facingAndQuarterCircle() {
        val cmd = MugenCommand("qcf", MugenCommandParser.parseCommandString("D, DF, F, a"))
        val right = InputBuffer()
        right.update(InputFrame(Directions.D))
        right.update(InputFrame(Directions.DF))
        right.update(InputFrame(Directions.R, setOf('a')))
        assertTrue(right.matches(cmd, true))
        val left = InputBuffer()
        left.update(InputFrame(Directions.D))
        left.update(InputFrame(Directions.DB))
        left.update(InputFrame(Directions.L, setOf('a')))
        assertTrue(left.matches(cmd, false))
    }
    @Test fun buttonNotMistakenForBackAndRelease() {
        val one = MugenCommandParser.parseCommandString("b")
        assertEquals(0, one[0].direction)
        val buf = InputBuffer()
        buf.update(InputFrame(0, setOf('a')))
        buf.update(InputFrame())
        assertTrue(buf.matches(MugenCommand("release", MugenCommandParser.parseCommandString("~a")), true))
        assertFalse(buf.matches(MugenCommand("pressed", MugenCommandParser.parseCommandString("a")), true))
    }
    @Test fun airDefaultsAndOverridesAreIndependentForEachCollisionType() {
        val action = MugenAirParser.parse("""
            [Begin Action 0]
            Clsn1Default: 1
            Clsn1[0] = 0,-5,10,0
            Clsn1: 1
            Clsn1[0] = 5,-5,15,0
            Clsn2Default : 1
            Clsn2 [ 0 ] = -10,-30,10,0
            Clsn2[1] = -99,-99,99,99
            0,0,0,0,1
            Clsn2: 0
            0,1,0,0,1
            0,2,0,0,-1
        """.trimIndent()).getValue(0)
        val defaultAttack = AirBox(true, MugenRect(0,-5,10,0))
        val temporaryAttack = AirBox(true, MugenRect(5,-5,15,0))
        val defaultHurt = AirBox(false, MugenRect(-10,-30,10,0))
        assertEquals(listOf(temporaryAttack,defaultHurt), action.frames[0].boxes)
        assertEquals(listOf(defaultAttack), action.frames[1].boxes)
        assertEquals(listOf(defaultAttack,defaultHurt), action.frames[2].boxes)
    }

    @Test fun airInterpolationUsesTheActiveElementAndKeepsCollisionBoxesUnchanged() {
        val action = MugenAirParser.parse("""
            [Begin Action 0]
            Interpolate Offset
            Clsn2Default: 1
            Clsn2[0] = -5,-10,5,0
            0,0,0,0,4,,AS256D0,1,1,0
            Interpolate Offset
            Interpolate Scale
            Interpolate Angle
            Interpolate Blend
            0,1,20,-8,4,,AS128D128,2,.5,90
        """.trimIndent()).getValue(0)
        val player = AirAnimationPlayer(action)
        repeat(2) { player.advance() }
        val sample = player.visualFrame()!!
        assertEquals(0, sample.sprite)
        assertEquals(10.0, sample.offsetX)
        assertEquals(-4.0, sample.offsetY)
        assertEquals(1.5, sample.scaleX)
        assertEquals(.75, sample.scaleY)
        assertEquals(45.0, sample.angle)
        assertEquals(SpriteBlend("add",192,64), sample.blend)
        assertEquals(listOf(AirBox(false, MugenRect(-5,-10,5,0))), player.frame!!.boxes)
        repeat(4) { player.advance() }
        val closing = player.visualFrame()!!
        assertEquals(1, closing.sprite)
        assertEquals(10.0, closing.offsetX)
        assertEquals(2.0, closing.scaleX)
    }

    @Test fun airParsesHitboxesAndFrameTiming() {
        val air = MugenAirParser.parse("[Begin Action 200]\nClsn2Default: 1\nClsn2[0] = -10,-50,10,0\nClsn1: 1\nClsn1[0] = 0,-40,40,-20\n200,0,0,0,3\n200,1,0,0,-1")
        val a = assertNotNull(air[200])
        assertEquals(2, a.frames.size)
        assertEquals(2, a.frames[0].boxes.size)
        assertEquals(1, a.frames[1].boxes.size)
        val play = AirAnimationPlayer(a)
        repeat(3) { play.advance() }
        assertEquals(1, play.index)
        repeat(120) { play.advance() }
        assertEquals(1, play.index)
    }
    @Test fun collisionRespectsFacingAndNonIntersection() {
        val a = MugenRect(0,-40,40,-20).world(0,0,true)
        val b = MugenRect(-10,-60,10,0).world(20 * Fixed.ONE,0,true)
        assertTrue(a.intersects(b))
        assertFalse(a.intersects(MugenRect(-10,-60,10,0).world(200 * Fixed.ONE,0,true)))
        assertTrue(a.intersects(MugenRect(-10,-60,10,0).world(-20 * Fixed.ONE,0,false).let { it.world(0, 0, true, 1) }) == false)
    }
    @Test fun controllersAndHitsAreIndependentPerActor() {
        val attackAir = MugenAirParser.parse("[Begin Action 200]\nClsn1: 1\nClsn1[0] = 0,-40,40,-20\n200,0,0,0,-1")
        val hurtAir = MugenAirParser.parse("[Begin Action 0]\nClsn2: 1\nClsn2[0] = -10,-50,10,0\n0,0,0,0,-1")
        val cns = MugenCnsParser.parse("[Statedef 200]\nanim=200\n[State 200, Hit]\ntype=HitDef\ntrigger1=time = 0\ndamage=70\npausetime=3\nground.velocity=2,-4")
        val p1 = FightingCharacter(FighterDefinition("attacker", attackAir, cns), 1)
        val p2 = FightingCharacter(FighterDefinition("defender", hurtAir), 2)
        p1.changeState(200)
        p2.posX = 20 * Fixed.ONE
        val fight = DeterministicFight(p1, p2)
        fight.step()
        assertEquals(930, p2.life)
        assertEquals(5000, p2.stateNo)
        assertEquals(3, p1.hitPauseLeft)
        repeat(20) { fight.step() }
        assertEquals(930, p2.life)
        assertEquals(21L, fight.frame)
    }
    @Test fun triggerAllIsAndWithOrAcrossGroups() {
        val fighter = FightingCharacter(FighterDefinition("t"), 1)
        val c = StateController("null", emptyMap(), listOf("life = 1000"),
            mapOf(1 to listOf("time = 999"), 2 to listOf("time = 0")))
        assertTrue(CoreTriggers.controllerEnabled(c, fighter, mutableSetOf()))
        fighter.life = 500
        assertFalse(CoreTriggers.controllerEnabled(c, fighter, mutableSetOf()))
    }
    @Test fun cloneReplayChecksumIsStable() {
        fun run(): String {
            val f = FighterDefinition("same")
            val w = DeterministicFight(FightingCharacter(f, 1), FightingCharacter(f, 2))
            repeat(600) { i -> w.step(InputFrame(if (i % 2 == 0) Directions.R else 0)) }
            return w.checksum()
        }
        assertEquals(run(), run())
    }
    @Test fun paletteUsesUnsignedByteIndices() {
        val p = MugenPalette.fromAct(ByteArray(768) { (it % 256).toByte() })
        val output = IndexedSprites.rgba(byteArrayOf(0, 255.toByte()), 2, 1, p)
        assertEquals(0, output[3].toInt())
        assertEquals(255.toByte(), output[7])
    }
    @Test fun boundsCheckAndCameraSmallStage() {
        assertFailsWith<IllegalArgumentException> { IndexedSprites.rgba(ByteArray(1), 300, 300, MugenPalette(List(256) { Rgba(0,0,0) })) }
        val p = FightingCharacter(FighterDefinition("a"), 1)
        val q = FightingCharacter(FighterDefinition("b"), 2)
        val cam = MugenCamera(CameraConfig(-50.0, 50.0, -50.0, 0.0))
        repeat(50) { cam.update(p, q) }
        assertTrue(cam.x.isFinite() && cam.y.isFinite())
    }
}
