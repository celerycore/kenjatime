package moe.celery.kenjatime

import kotlin.test.*

/** Target-control contracts in the shared actor phase; native timing is unverified. */
class TargetMotionTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0\n[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun controller(type: String,params: String)="[State 0, $type]\ntype=$type\ntrigger1=1\n$params"
    private fun fight(script: String,width: Int=320): DeterministicFight {
        val a=FighterDefinition.fromScript("captor","[Begin Action 0]\n0,0,0,0,-1","$idle\n$script",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        val b=FighterDefinition.fromScript("victim","[Begin Action 0]\n0,0,0,0,-1",idle)
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.receiveHit(HitDefinition(id=71),true,attacker=it.p1)
        }
    }
    @Test fun setUsesCaptorFacingAndPreservesOmittedAxes() {
        for(right in listOf(false,true)) {
            val w=fight(controller("TargetVelSet","x=3\nid=71"));w.p1.facingRight=right;w.p2.facingRight=!right;w.p2.velY=-5*Fixed.ONE
            w.p1.tick(w.issues)
            assertEquals((if(right)3 else -3)*Fixed.ONE,w.p2.velX);assertEquals(-5*Fixed.ONE,w.p2.velY)
        }
    }
    @Test fun addUsesVictimFacingAndWorldVerticalDirection() {
        val w=fight(controller("TargetVelAdd","x=3\ny=-2"));w.p2.facingRight=false
        w.p2.velX=Fixed.ONE;w.p2.velY=4*Fixed.ONE;w.p1.tick(w.issues)
        assertEquals(-2*Fixed.ONE,w.p2.velX);assertEquals(2*Fixed.ONE,w.p2.velY)
    }
    @Test fun facingRelativeToCaptorChangesSubsequentVelocityDirection() {
        for(right in listOf(false,true))for(direction in listOf(-1,1)) {
            val w=fight(controller("TargetFacing","value=$direction")+"\n"+controller("TargetVelAdd","x=2\ny=-4"))
            w.p1.facingRight=right;w.p1.tick(w.issues)
            val expected=if(direction>0)right else !right
            assertEquals(expected,w.p2.facingRight);assertEquals((if(expected)2 else -2)*Fixed.ONE,w.p2.velX)
            assertEquals(-4*Fixed.ONE,w.p2.velY)
        }
    }
    @Test fun idFilteringLeavesOtherCapturedActorsUnchanged() {
        val w=fight(controller("TargetVelSet","id=72\nx=4"))
        w.entities.add(listOf(EntityRequest.Helper(w.p2,9,5000,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor;w.p1.captureTarget(h,72)
        w.p1.tick(w.issues);assertEquals(0,w.p2.velX);assertEquals(4*Fixed.ONE,h.velX)
    }
    @Test fun omittedIdAffectsAllTargetsUsingTheirIndividualFacing() {
        val w=fight(controller("TargetVelAdd","x=4"));w.p2.facingRight=false
        w.entities.add(listOf(EntityRequest.Helper(w.p2,9,5000,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor;h.facingRight=true;w.p1.captureTarget(h,72)
        w.p1.tick(w.issues);assertEquals(-4*Fixed.ONE,w.p2.velX);assertEquals(4*Fixed.ONE,h.velX)
    }
    @Test fun highCoordinateArgumentsConvertFromTheCaptorsActiveUnits() {
        val w=fight(controller("TargetVelSet","x=8\ny=-4"),640);w.p1.tick(w.issues)
        assertEquals(4*Fixed.ONE,w.p2.velX);assertEquals(-2*Fixed.ONE,w.p2.velY)
    }
    @Test fun borrowedControllerBankKeepsActiveCoordinateUnits() {
        val w=fight("[Statedef 800]\ntype=S\nphysics=N\n"+
            controller("TargetVelSet","x=8\ny=-4").replace("[State 0,","[State 800,"),640)
        w.p2.enterAuthoredState(800,w.p1,w.issues)
        w.p1.receiveHit(HitDefinition(id=71),true,attacker=w.p2);w.p2.tick(w.issues)
        assertEquals(4*Fixed.ONE,w.p1.velX);assertEquals(-2*Fixed.ONE,w.p1.velY)
    }
    @Test fun nestedExpressionsAreEvaluatedInTheExecutingActor() {
        val w=fight(controller("TargetVelSet","id=70+var(0)\nx=ifelse(var(0),3,7)\ny=-max(2,4)"))
        w.p1.vars[0]=1;w.p1.tick(w.issues)
        assertEquals(3*Fixed.ONE,w.p2.velX);assertEquals(-4*Fixed.ONE,w.p2.velY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun invalidComponentsDoNotPartiallyMutateTargets() {
        for(params in listOf("x=4\ny=unknown","x=1/0","id=2147483648\nx=4")) {
            val w=fight(controller("TargetVelSet",params));w.p2.velX=Fixed.ONE;w.p2.velY=2*Fixed.ONE
            w.p1.tick(w.issues);assertEquals(Fixed.ONE,w.p2.velX);assertEquals(2*Fixed.ONE,w.p2.velY)
            assertTrue(w.issues.any { it.startsWith("Invalid TargetVelSet:") })
        }
    }
    @Test fun invalidFacingCannotTurnCapturedActors() {
        for(params in listOf("value=0","value=unknown","id=unknown\nvalue=-1","")) {
            val w=fight(controller("TargetFacing",params));w.p2.facingRight=true;w.p1.tick(w.issues)
            assertTrue(w.p2.facingRight);assertTrue(w.issues.any { it.startsWith("Invalid TargetFacing:") })
        }
    }
    @Test fun deadDestroyedOrRecoveredActorsCannotBeControlled() {
        for(mode in 0..2) {
            val w=fight(controller("TargetVelSet","x=5"))
            when(mode){0->w.p2.life=0;1->w.p2.destroyed=true;else->w.p2.changeState(0)}
            w.p1.tick(w.issues);assertEquals(0,w.p2.velX)
        }
    }
    @Test fun missingTargetsAndOmittedAxesAreHarmless() {
        val w=fight(controller("TargetVelSet","")+"\n"+controller("TargetVelAdd","id=999\nx=5"))
        w.p2.velX=Fixed.ONE;w.p2.velY=-Fixed.ONE;w.p1.tick(w.issues)
        assertEquals(Fixed.ONE,w.p2.velX);assertEquals(-Fixed.ONE,w.p2.velY);assertTrue(w.issues.isEmpty())
    }
    @Test fun additionsAndMirroringSaturateWithoutIntegerWrap() {
        val w=fight(controller("TargetVelAdd","x=1000000000\ny=-1000000000"));w.p2.facingRight=false
        w.p2.velX=Int.MIN_VALUE;w.p2.velY=Int.MIN_VALUE;w.p1.tick(w.issues)
        assertEquals(Int.MIN_VALUE,w.p2.velX);assertEquals(Int.MIN_VALUE,w.p2.velY)
        val mirrored=fight(controller("TargetVelSet","x=-1000000000"));mirrored.p1.facingRight=false
        mirrored.p1.tick(mirrored.issues);assertEquals(Int.MAX_VALUE,mirrored.p2.velX)
    }
    @Test fun hitpauseRequiresAuthoredIgnoreHitpauseForTargetControl() {
        for(ignore in listOf(false,true)) {
            val w=fight(controller("TargetVelSet","x=3\nignorehitpause=${if(ignore)1 else 0}"))
            w.p1.hitPauseLeft=2;w.p1.tick(w.issues)
            assertEquals(if(ignore)3*Fixed.ONE else 0,w.p2.velX)
        }
    }
    @Test fun renderQueriesDoNotRepeatTargetVelocityAdditions() {
        val w=fight(controller("TargetVelAdd","x=1"));w.p1.tick(w.issues)
        repeat(10){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(Fixed.ONE,w.p2.velX);w.p1.tick(w.issues);assertEquals(2*Fixed.ONE,w.p2.velX)
    }
}
