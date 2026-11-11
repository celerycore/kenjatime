package moe.celery.kenjatime

import kotlin.test.*

class FighterConstantsTest {
    private val script = """
        [Data]
        life=1570
        [Size]
        ground.front=18
        ground.back=12
        xscale=1.5
        yscale=0.75
        [Movement]
        yaccel=0.6
        [Statedef 0]
        type=S
        ctrl=1
    """.trimIndent()

    @Test fun readsAuthoredLifeFrontBackGravityAndScalesFromCns() {
        val constants=MugenCnsParser.constants(script)
        assertEquals(1570,constants.maxLife)
        assertEquals(18,constants.front)
        assertEquals(12,constants.back)
        assertEquals(Fixed.of(0.6),constants.gravity)
        assertEquals(Fixed.of(1.5),constants.xScale)
        assertEquals(Fixed.of(0.75),constants.yScale)
        val definition=FighterDefinition.fromScript("custom","",script)
        assertEquals(1570,definition.maxLife)
        assertEquals(Fixed.of(1.5),definition.xScale)
        assertEquals(Fixed.of(0.75),definition.yScale)
        assertEquals(1570,FightingCharacter(definition,1).life)
    }

    @Test fun collisionRectScalingAffectsXAndYWithoutChangingSpriteData() {
        val box=MugenRect(-10,-30,10,0)
        val scaled=box.world(0,0,true,Fixed.of(1.5),Fixed.of(0.75))
        assertEquals(-15*Fixed.ONE,scaled.x1)
        assertEquals(15*Fixed.ONE,scaled.x2)
        assertEquals(Fixed.of(-22.5),scaled.y1)
    }

    @Test fun opponentDistanceUsesCharacterFacingAndAuthoredBodyWidths() {
        val def=FighterDefinition.fromScript("custom","",script)
        val a=FightingCharacter(def,1)
        val b=FightingCharacter(def,2)
        DeterministicFight(a,b)
        a.posX=50*Fixed.ONE
        b.posX=-10*Fixed.ONE
        a.facingRight=false
        val issues=linkedSetOf<String>()
        assertTrue(CoreExpression.test("p2dist x = 60",a,issues))
        assertTrue(CoreExpression.test("p2bodydist x = 30",a,issues))
        assertTrue(issues.isEmpty())
    }
}
