package moe.celery.kenjatime

import kotlin.test.*

/** Guard knockback is captured from the victim's incoming posture, then kept canonical. */
class GuardVelocityTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\n200,0,0,0,-1"
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0"
    private val states="$idle\n[Statedef 400]\ntype=A\nmovetype=I\nphysics=N\nanim=0\n"+
        "[Statedef 5000]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 150]\ntype=S\nmovetype=H\nphysics=N\nanim=0\n"+
        "[Statedef 152]\ntype=S\nmovetype=H\nphysics=N\nanim=0"
    private fun definition(extra: String="",width: Int=320)=FighterDefinition.fromScript("guard velocity",air,
        "$states\n$extra",defText="[Info]\nlocalcoord=$width,${width*3/4}")
    private fun fight(extra: String="",width: Int=320)=DeterministicFight(
        FightingCharacter(definition(extra,width),1),FightingCharacter(definition(),2))
    private fun source(params: String)="[Statedef 200]\ntype=S\nphysics=N\nanim=200\n[State 200, hit]\n"+
        "type=HitDef\ntrigger1=Time=0\ndamage=0\nguardflag=HLA\n$params"
    private fun packet(w: DeterministicFight): HitDefinition {
        w.p1.changeState(200);w.p1.tick(w.issues);return w.p1.activeHitDef!!
    }
    private fun receive(w: DeterministicFight,hit: HitDefinition,airborne: Boolean=true,face: Boolean=true,guarded: Boolean=true) {
        if(airborne)w.p2.changeState(400)
        w.p2.receiveHit(hit,face,guarded,w.p1)
    }
    @Test fun omittedGuardVectorsResolveFromTheirOwnHitVectors() {
        val w=fight(source("ground.velocity=8,-6\nair.velocity=4,-8"));val hit=packet(w)
        assertEquals(2048,hit.guardVelocityX);assertEquals(0,hit.guardVelocityY)
        assertEquals(1536,hit.airGuardVelocityX);assertEquals(-1024,hit.airGuardVelocityY)
    }
    @Test fun emptyHitVectorsHaveZeroGuardDefaults() {
        val w=fight(source(""));val hit=packet(w)
        assertEquals(0,hit.guardVelocityX);assertEquals(0,hit.guardVelocityY)
        assertEquals(0,hit.airGuardVelocityX);assertEquals(0,hit.airGuardVelocityY)
    }
    @Test fun airGuardDefaultsScaleBeforeFixedPointQuantization() {
        val w=fight(source("air.velocity=.003,-.003"));val hit=packet(w)
        assertEquals(0,hit.airVelocityX);assertEquals(1,hit.airGuardVelocityX)
        assertEquals(0,hit.airGuardVelocityY)
    }
    @Test fun explicitGuardVectorsOverrideTheirDefaultsIncludingZero() {
        val w=fight(source("ground.velocity=8,-6\nair.velocity=4,-8\nguard.velocity=0\nairguard.velocity=0,0"));val hit=packet(w)
        assertEquals(0,hit.guardVelocityX);assertEquals(0,hit.guardVelocityY)
        assertEquals(0,hit.airGuardVelocityX);assertEquals(0,hit.airGuardVelocityY)
    }
    @Test fun nestedExpressionsAreSplitAtTopLevelForAllReactionVectors() {
        val w=fight(source("ground.velocity=max(4,8),min(-2,-6)\nair.velocity=ifelse(var(0),4,2),-8\n"+
            "guard.velocity=max(1,3),min(0,-1)\nairguard.velocity=ifelse(var(0),max(5,6),2),min(-2,-3)"))
        w.p1.vars[0]=1;val hit=packet(w);w.p1.vars[0]=0
        assertEquals(2048,hit.velocityX);assertEquals(-1536,hit.velocityY)
        assertEquals(1024,hit.airVelocityX);assertEquals(-2048,hit.airVelocityY)
        assertEquals(768,hit.guardVelocityX);assertEquals(-256,hit.guardVelocityY)
        assertEquals(1536,hit.airGuardVelocityX);assertEquals(-768,hit.airGuardVelocityY)
    }
    @Test fun equivalentAuthoredDefaultsRemainCanonicalAcrossSourceCoordinates() {
        for(width in listOf(320,640,1008)) {
            val scale=width/320.0
            val w=fight(source("ground.velocity=${8*scale},${-6*scale}\nair.velocity=${4*scale},${-8*scale}"),width)
            val hit=packet(w);assertEquals(2048,hit.guardVelocityX);assertEquals(1536,hit.airGuardVelocityX)
            assertEquals(-1024,hit.airGuardVelocityY)
        }
    }
    @Test fun airborneGuardUsesItsVectorBeforeTheReactionStateChangesPosture() {
        val w=fight();receive(w,HitDefinition(guardVelocityX=256,airGuardVelocityX=768,airGuardVelocityY=-512))
        assertEquals(152,w.p2.stateNo);assertEquals("S",w.p2.stateType)
        assertEquals(768,w.p2.velX);assertEquals(-512,w.p2.velY);assertTrue(w.p2.getHitData.guarded)
    }
    @Test fun groundGuardKeepsTheGroundVectorAndExistingOptionalYExtension() {
        val w=fight();receive(w,HitDefinition(guardVelocityX=256,guardVelocityY=-128,
            airGuardVelocityX=768,airGuardVelocityY=-512),airborne=false)
        assertEquals(150,w.p2.stateNo);assertEquals(256,w.p2.velX);assertEquals(-128,w.p2.velY)
    }
    @Test fun impactFacingMirrorsOnlyTheSelectedHorizontalAxis() {
        for(face in listOf(false,true)) {
            val w=fight();receive(w,HitDefinition(airGuardVelocityX=768,airGuardVelocityY=-512),face=face)
            assertEquals(if(face)768 else -768,w.p2.velX);assertEquals(-512,w.p2.velY)
        }
    }
    @Test fun unguardedAirHitsStillUseTheAuthoredAirHitVector() {
        val w=fight();receive(w,HitDefinition(airVelocityX=512,airVelocityY=-1024,
            airGuardVelocityX=768,airGuardVelocityY=-512),guarded=false)
        assertEquals(512,w.p2.velX);assertEquals(-1024,w.p2.velY);assertFalse(w.p2.getHitData.guarded)
    }
    @Test fun getHitVarAndHitVelSetRestoreTheCapturedAerialGuardAxes() {
        val w=fight();receive(w,HitDefinition(airGuardVelocityX=768,airGuardVelocityY=-512),face=false)
        assertEquals(-3.0,w.p2.getHitVar("xvel"));assertEquals(-2.0,w.p2.getHitVar("yvel"))
        w.p2.velX=99;w.p2.velY=88;w.p2.facingRight=true
        val c=MugenCnsParser.parse("[Statedef 152]\n[State 152, restore]\ntype=HitVelSet\ntrigger1=1\nx=1\ny=1")
            .getValue(152).controllers.single()
        CoreGetHitControllers.execute(w.p2,c,w.issues)
        assertEquals(-768,w.p2.velX);assertEquals(-512,w.p2.velY)
    }
    @Test fun borrowedBankQueriesCannotRescaleStoredGuardKnockback() {
        val w=fight();receive(w,HitDefinition(airGuardVelocityX=768,airGuardVelocityY=-512))
        val bank=FightingCharacter(definition(width=640),3);w.p2.enterAuthoredState(152,bank,w.issues)
        assertEquals(6.0,w.p2.getHitVar("xvel"));assertEquals(-4.0,w.p2.getHitVar("yvel"))
        assertEquals(768,w.p2.getHitData.velocityX);assertEquals(-512,w.p2.getHitData.velocityY)
    }
    @Test fun borrowedSourceBanksEvaluateAndConvertVelocitiesInActiveUnits() {
        val w=fight();val bank=FightingCharacter(definition(source("airguard.velocity=6,-4"),640),3)
        w.p1.enterAuthoredState(200,bank,w.issues);w.p1.tick(w.issues)
        val hit=w.p1.activeHitDef!!;assertEquals(768,hit.airGuardVelocityX);assertEquals(-512,hit.airGuardVelocityY)
    }
    @Test fun malformedVectorsCannotInstallOrReplaceAWorkingAttack() {
        for(key in listOf("ground.velocity","air.velocity","guard.velocity","airguard.velocity"))
            for(value in listOf("unknown","1/0","1,2,3","1,","(1,2","")) {
                val w=fight(source("$key=$value"));w.p1.changeState(200);w.p1.tick(w.issues)
                assertNull(w.p1.activeHitDef);assertTrue(w.issues.any{it.startsWith("Invalid hit velocity:")})
            }
        val w=fight(source("airguard.velocity=6,-4")+"\n[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nairguard.velocity=unknown")
        val original=packet(w);w.p1.tick(w.issues);assertSame(original,w.p1.activeHitDef)
    }
    @Test fun invalidReactionVectorsCannotQueueAProjectile() {
        for(params in listOf("airguard.velocity=unknown","air.velocity=1,2,3","guard.velocity=1/0")) {
            val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$params")
            w.step();assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isNotEmpty())
        }
    }
    @Test fun projectileLegacyAliasesAreAcceptedWithStandardNamesTakingPrecedence() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
            "projground.velocity=8,-6\nprojair.velocity=4,-8\nprojguard.velocity=3\nprojairguard.velocity=6,-4\nairguard.velocity=2,-2")
        w.step();val hit=w.entities.projectiles.single().hit
        assertEquals(2048,hit.velocityX);assertEquals(1024,hit.airVelocityX);assertEquals(768,hit.guardVelocityX)
        assertEquals(512,hit.airGuardVelocityX);assertEquals(-512,hit.airGuardVelocityY)
    }
    @Test fun projectileCapturesGuardDefaultsBeforeCreatorVariablesChange() {
        val w=fight("[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\nair.velocity=var(0),-8")
        w.p1.vars[0]=4;w.step();val hit=w.entities.projectiles.single().hit;w.p1.vars[0]=20
        assertEquals(1536,hit.airGuardVelocityX);assertEquals(-1024,hit.airGuardVelocityY)
    }
    @Test fun helperVictimsKeepIndependentAerialGuardData() {
        val w=fight();w.entities.add(listOf(EntityRequest.Helper(w.p2,9,400,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        helper.receiveHit(HitDefinition(airGuardVelocityX=768,airGuardVelocityY=-512),true,true,w.p1)
        assertEquals(768,helper.velX);assertEquals(-512,helper.velY);assertEquals(0,w.p2.velX)
        assertFalse(w.p2.getHitData.received)
    }
    @Test fun aFreshGroundGuardReplacesPriorAerialKnockback() {
        val w=fight();val hit=HitDefinition(guardVelocityX=256,airGuardVelocityX=768,airGuardVelocityY=-512)
        receive(w,hit);w.p2.changeState(0);receive(w,hit,airborne=false)
        assertEquals(256,w.p2.getHitData.velocityX);assertEquals(0,w.p2.getHitData.velocityY)
    }
    @Test fun guardVectorSelectionPreservesChipPowerPauseAndFallSuppression() {
        val w=fight();receive(w,HitDefinition(damage=10,guardDamage=2,guardGetPower=3,guardGivePower=4,
            guardDefenderPause=2,guardHitTime=9,fall=true,airGuardVelocityX=768,airGuardVelocityY=-512))
        assertEquals(998,w.p2.life);assertEquals(3,w.p1.power);assertEquals(4,w.p2.power)
        assertEquals(2,w.p2.hitPauseLeft);assertEquals(9,w.p2.getHitData.time);assertFalse(w.p2.getHitData.fall)
        val data=w.p2.getHitData.copy();repeat(6){CorePresentationPlanner.snapshot(w,12);w.p2.getHitVar("xvel")}
        assertEquals(data,w.p2.getHitData);assertEquals(998,w.p2.life)
    }
    @Test fun hitpauseFreezesAerialGuardMotionThroughItsFinalFrozenTick() {
        val w=fight();receive(w,HitDefinition(guardDefenderPause=2,airGuardVelocityX=768,airGuardVelocityY=-512))
        repeat(2){w.p2.tick(w.issues);assertEquals(0,w.p2.posX);assertEquals(0,w.p2.posY)}
        w.p2.tick(w.issues);assertEquals(768,w.p2.posX);assertEquals(-512,w.p2.posY)
    }
    @Test fun extremeAerialGuardDefaultsAndMirroringSaturateWithoutWrapping() {
        for((raw,expected) in listOf("1000000000000" to Int.MAX_VALUE,"-1000000000000" to Int.MIN_VALUE)) {
            val w=fight(source("air.velocity=$raw,$raw"));val hit=packet(w)
            assertEquals(expected,hit.airGuardVelocityX);assertEquals(expected,hit.airGuardVelocityY)
            receive(w,hit,face=false)
            assertEquals(if(expected==Int.MIN_VALUE)Int.MAX_VALUE else -Int.MAX_VALUE,w.p2.velX)
        }
    }
}
