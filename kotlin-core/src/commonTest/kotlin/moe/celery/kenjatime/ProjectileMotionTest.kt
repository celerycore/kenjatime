package moe.celery.kenjatime

import kotlin.test.*

/** Authored motion/lifetime contracts, not native projectile phase captures. */
class ProjectileMotionTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-10,-40,10,0
        0,0,0,0,-1
        [Begin Action 200]
        200,0,0,0,1
        200,1,0,0,-1
        [Begin Action 201]
        Clsn1Default:1
        Clsn1[0]=0,-40,10,0
        201,0,0,0,-1
    """.trimIndent()
    private fun fight(extra: String="",width: Int=320): DeterministicFight {
        val d=FighterDefinition.fromScript("motion",air,"$idle\n$extra",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        val target=FighterDefinition.fromScript("target",air,idle,
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        return DeterministicFight(FightingCharacter(d,1),FightingCharacter(target,2)).also {it.p2.posX=10000*Fixed.ONE}
    }
    private fun source(params: String,trigger: String="Time=0")=
        "[State 0, fire]\ntype=Projectile\ntrigger1=$trigger\nprojanim=200\n$params"
    private fun spawn(w: DeterministicFight,life: Int=-1,vx: Int=2*Fixed.ONE,vy: Int=0,
                      ax: Int=0,ay: Int=0,mx: Double=1.0,my: Double=1.0,anim: Int=200,
                      x: Int=0,y: Int=0): CoreProjectile {
        w.entities.add(listOf(EntityRequest.Projectile(w.p1,7,anim,x,y,vx,vy,life,HitDefinition(damage=5),
            accelerationX=ax,accelerationY=ay,multiplierX=mx,multiplierY=my)),w.issues)
        return w.entities.projectiles.last()
    }

    @Test fun defaultMotionPreservesLinearFixedPointTrajectories() {
        val w=fight();val p=spawn(w,vy=-Fixed.ONE)
        repeat(20){w.step()}
        assertEquals(40*Fixed.ONE,p.x);assertEquals(-20*Fixed.ONE,p.y)
        assertEquals(2*Fixed.ONE,p.vx);assertEquals(-Fixed.ONE,p.vy)
    }

    @Test fun opponentLaunchUsesItsHorizontalAxisAndTheShootersVerticalAxis() {
        val w = fight(source("postype=p2\noffset=8,6") + """

            [State 0, move after launch]
            type=PosAdd
            trigger1=Time=0
            x=12
            y=16
        """.trimIndent().let { "\n$it" }, width = 640)
        w.p1.facingRight = false
        w.p1.posY = -18 * Fixed.ONE
        w.p2.posX = 50 * Fixed.ONE
        w.p2.posY = -50 * Fixed.ONE

        w.step()

        val shot = w.entities.projectiles.single()
        assertEquals(46 * Fixed.ONE, shot.x)
        assertEquals(-15 * Fixed.ONE, shot.y)
        assertEquals(-10 * Fixed.ONE, w.p1.posY)
        assertFalse(shot.facingRight)
        assertTrue(w.issues.isEmpty(), w.issues.toString())
    }

    @Test fun accelerationUpdatesVelocityAfterEachMovement() {
        val w=fight();val p=spawn(w,vy=-2*Fixed.ONE,ax=Fixed.ONE,ay=Fixed.ONE/2)
        w.step();assertEquals(2*Fixed.ONE,p.x);assertEquals(-2*Fixed.ONE,p.y)
        assertEquals(3*Fixed.ONE,p.vx);assertEquals(Fixed.of(-1.5),p.vy)
        w.step();assertEquals(5*Fixed.ONE,p.x);assertEquals(Fixed.of(-3.5),p.y)
        assertEquals(4*Fixed.ONE,p.vx);assertEquals(-Fixed.ONE,p.vy)
    }

    @Test fun multipliersApplyToAcceleratedVelocityOncePerTick() {
        val w=fight();val p=spawn(w,vx=4*Fixed.ONE,ax=2*Fixed.ONE,mx=.5)
        w.step();assertEquals(4*Fixed.ONE,p.x);assertEquals(3*Fixed.ONE,p.vx)
        w.step();assertEquals(7*Fixed.ONE,p.x);assertEquals(Fixed.of(2.5),p.vx)
    }

    @Test fun zeroAndNegativeMultipliersDoNotAlterLaunchFacing() {
        val w=fight();val p=spawn(w,vy=Fixed.ONE,mx=-1.0,my=0.0)
        w.step();assertEquals(2*Fixed.ONE,p.x);assertEquals(-2*Fixed.ONE,p.vx);assertEquals(0,p.vy)
        w.p1.facingRight=false
        w.step();assertEquals(0,p.x);assertTrue(p.facingRight);assertEquals(2*Fixed.ONE,p.vx)
    }

    @Test fun leftFacingAccelerationMirrorsWithLaunchDirection() {
        val w=fight();w.p1.facingRight=false
        val p=spawn(w,ax=Fixed.ONE,ay=Fixed.ONE)
        w.p1.facingRight=true
        w.step();assertEquals(-2*Fixed.ONE,p.x);assertEquals(-3*Fixed.ONE,p.vx)
        assertEquals(Fixed.ONE,p.vy);assertEquals(-Fixed.ONE,p.accelerationX)
    }

    @Test fun laterTurnControllerCannotReverseSpawnedAcceleration() {
        val w=fight(source("velocity=2,0\naccel=1,0")+"\n[State 0, turn]\ntype=Turn\ntrigger1=Time=0")
        w.step();val p=w.entities.projectiles.single()
        assertFalse(w.p1.facingRight);assertTrue(p.facingRight)
        assertEquals(Fixed.ONE,p.accelerationX)
        w.step();assertEquals(2*Fixed.ONE,p.x);assertEquals(3*Fixed.ONE,p.vx)
    }

    @Test fun defaultRemovalTimeAndAnimationAreIndefiniteAndActionZero() {
        val w=fight("[State 0, default projectile]\ntype=Projectile\ntrigger1=Time=0\nvelocity=1,0")
        w.step();val p=w.entities.projectiles.single()
        assertEquals(0,p.action.action.number);assertEquals(-1,p.ticksLeft)
        repeat(600){w.step()}
        assertEquals(600*Fixed.ONE,p.x);assertEquals(-1,p.ticksLeft);assertTrue(p.alive)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun explicitIndefiniteLifetimeDoesNotCountDown() {
        val w=fight(source("projremovetime=-1\nvelocity=0,0"))
        repeat(1000){w.step()}
        assertEquals(-1,w.entities.projectiles.single().ticksLeft)
    }

    @Test fun zeroLifetimeNeverConsumesBudgetOrCreatesAPresentedProjectile() {
        val w=fight(source("projremovetime=0"));w.entities.maxProjectiles=0
        w.step()
        assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.issues.isEmpty(),w.issues.joinToString())
        assertFalse(CorePresentationPlanner.snapshot(w,0).contains("\"kind\":\"projectile\""))
    }

    @Test fun positiveLifetimeCountsUpdatesAfterBirthAndRetiresExactlyOnce() {
        val w=fight(source("projremovetime=3\nvelocity=2,0"))
        w.step();val p=w.entities.projectiles.single()
        assertEquals(0,p.x);assertEquals(3,p.ticksLeft);assertEquals(0,p.action.index)
        w.step();assertEquals(2*Fixed.ONE,p.x);assertEquals(2,p.ticksLeft);assertEquals(1,p.action.index)
        w.step();assertEquals(1,p.ticksLeft)
        w.step();assertEquals(6*Fixed.ONE,p.x);assertEquals(0,p.ticksLeft)
        assertTrue(w.entities.projectiles.isEmpty())
        val x=p.x;p.step();assertEquals(x,p.x)
    }

    @Test fun longPositiveLifetimeIsNotClampedToSixtyOrThirtySixHundredTicks() {
        val w=fight(source("projremovetime=5000"));w.step()
        val p=w.entities.projectiles.single()
        repeat(10){w.step()};assertEquals(4990,p.ticksLeft)
    }

    @Test fun malformedTrajectoryOrLifetimeDoesNotQueueAPartialProjectile() {
        for(params in listOf("projremovetime=-2","projremovetime=unknown","accel=1,2,3",
            "accel=ifelse(1,2,3","velocity=unknown,0","velmul=1/0,1","velmul=1,2,3",
            "projstagebound=-1","projheightbound=10,-10","projheightbound=1")) {
            val w=fight(source(params));w.step()
            assertTrue(w.entities.projectiles.isEmpty(),params)
            assertTrue(w.issues.any { it.startsWith("Invalid Projectile:") },params)
        }
    }

    @Test fun nestedVectorExpressionsRemainWholeAndMultipliersStayDimensionless() {
        val w=fight(source("""
            offset=max(1,2),-2
            velocity=ifelse(1,4,8),max(1,2)
            accel=min(3,1),ifelse(0,9,.5)
            velmul=ifelse(1,.5,1),max(0,1)
        """.trimIndent()))
        w.step();val p=w.entities.projectiles.single()
        assertEquals(2*Fixed.ONE,p.x);assertEquals(-2*Fixed.ONE,p.y)
        w.step();assertEquals(6*Fixed.ONE,p.x);assertEquals(0,p.y)
        assertEquals(Fixed.of(2.5),p.vx);assertEquals(Fixed.of(2.5),p.vy)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun highResolutionSpatialParametersConvertOnceButMultipliersDoNotScale() {
        val w=fight(source("offset=20,0\nvelocity=8,0\naccel=4,0\nvelmul=.5,1"),width=640)
        w.step();val p=w.entities.projectiles.single()
        assertEquals(10*Fixed.ONE,p.x);assertEquals(4*Fixed.ONE,p.vx)
        assertEquals(2*Fixed.ONE,p.accelerationX);assertEquals(.5,p.multiplierX)
        w.step();assertEquals(14*Fixed.ONE,p.x);assertEquals(3*Fixed.ONE,p.vx)
    }

    @Test fun trajectoryExpressionsAreCapturedAtCreationRatherThanReevaluated() {
        val w=fight(source("velocity=4,0\nvelmul=ifelse(var(0),.5,1),1"))
        w.p1.vars[0]=1;w.step();val p=w.entities.projectiles.single()
        w.p1.vars[0]=0;w.step();assertEquals(2*Fixed.ONE,p.vx)
    }

    @Test fun configuredStageRetiresAnOutwardShotBeforeItsNextMovement() {
        val w=fight();w.configureArena(-100,100,push=false)
        val p=spawn(w,x=141*Fixed.ONE,vx=Fixed.ONE)
        w.step();assertEquals(141*Fixed.ONE,p.x)
        assertEquals(0,p.ticksLeft);assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.contacts.isEmpty())
    }

    @Test fun highCoordinateBoundsHaveTheSameWorldMargin() {
        val w=fight(source("offset=282,0\nvelocity=2,0\nprojstagebound=80"),width=640)
        w.configureArena(-100,100,push=false)
        w.step();val p=w.entities.projectiles.single()
        assertEquals(40*Fixed.ONE,p.stageBound)
        w.step();assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun returningOffstageShotsCanEnterTheStage() {
        for(right in listOf(true,false)) {
            val w=fight();w.configureArena(-100,100,push=false)
            val p=spawn(w,x=(if(right)150 else -150)*Fixed.ONE,vx=(if(right)-5 else 5)*Fixed.ONE)
            repeat(3){w.step()}
            assertTrue(p.alive);assertEquals((if(right)135 else -135)*Fixed.ONE,p.x)
        }
    }

    @Test fun heightBoundsUseConfiguredGroundAndPermitReturningVerticalShots() {
        for(up in listOf(true,false)) {
            val w=fight();w.configureArena(-100,100,40,push=false)
            val offset=(if(up)-240 else 1)*Fixed.ONE+(if(up)-1 else 1)
            w.p1.posY=40*Fixed.ONE
            spawn(w,y=offset,vx=0,vy=if(up)-Fixed.ONE else Fixed.ONE)
            w.step();assertTrue(w.entities.projectiles.isEmpty())
            val returning=spawn(w,y=offset,vx=0,vy=if(up)Fixed.ONE else -Fixed.ONE)
            w.step();assertTrue(returning.alive)
        }
    }

    @Test fun headlessSimulationDoesNotInventStageOrCameraRemovalBounds() {
        val w=fight();val p=spawn(w,x=1000*Fixed.ONE,y=-500*Fixed.ONE)
        repeat(20){w.step()}
        assertTrue(p.alive);assertEquals(1040*Fixed.ONE,p.x)
    }

    @Test fun growingTrajectoriesSaturateWithoutWrappingAcrossTheStage() {
        val w=fight();val p=spawn(w,x=Int.MAX_VALUE-1,vx=Int.MAX_VALUE,ax=Int.MAX_VALUE,mx=2.0)
        w.step();assertEquals(Int.MAX_VALUE,p.x);assertEquals(Int.MAX_VALUE,p.vx)
        w.step();assertEquals(Int.MAX_VALUE,p.x)
        w.p1.facingRight=false
        val left=spawn(w,vx=Int.MIN_VALUE,ax=Int.MIN_VALUE)
        assertEquals(Int.MAX_VALUE,left.vx);assertEquals(Int.MAX_VALUE,left.accelerationX)
    }

    @Test fun ownerHitpauseDoesNotFreezeIndependentProjectileMotionOrLife() {
        val w=fight();val p=spawn(w,life=4,ax=Fixed.ONE)
        w.p1.hitPauseLeft=4
        repeat(4){w.step()}
        assertEquals(14*Fixed.ONE,p.x);assertEquals(0,p.ticksLeft)
        assertEquals(0,w.p1.timeInState);assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun rejectedContactsDoNotExtendAFiniteProjectileLifetime() {
        val w=fight();w.p2.posX=15*Fixed.ONE
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, immune]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitFilters.execute(w.p2,c,w.issues)
        val p=spawn(w,life=3,ax=Fixed.ONE,anim=201)
        repeat(3){w.step()}
        assertEquals(0,p.ticksLeft);assertEquals(1000,w.p2.life)
        assertTrue(w.entities.projectiles.isEmpty());assertTrue(w.contacts.isEmpty())
    }

    @Test fun finalPositiveLifetimeUpdateCanContactBeforeRetirement() {
        val w=fight();w.p2.posX=11*Fixed.ONE
        spawn(w,life=1,anim=201)
        w.step();assertEquals(995,w.p2.life);assertEquals(1,w.contacts.size)
        assertTrue(w.entities.projectiles.isEmpty())
    }

    @Test fun defaultStageCleanupKeepsAnEndlessMissStreamWithinItsBudget() {
        val w=fight(source("velocity=10,0",trigger="1"));w.configureArena(-100,100,push=false)
        w.entities.maxProjectiles=20
        repeat(200){w.step();assertTrue(w.entities.projectiles.size<=17)}
        assertTrue(w.entities.projectiles.isNotEmpty());assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun skippedPresentationCannotChangeTrajectoryAnimationOrLife() {
        fun replay(render: Boolean): List<String> {
            val w=fight();val p=spawn(w,life=40,vx=4*Fixed.ONE,ax=Fixed.ONE,mx=.5)
            return (0 until 60).map {
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                "${w.checksum()}:${p.x}:${p.y}:${p.vx}:${p.vy}:${p.ticksLeft}:${p.action.index}"
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
