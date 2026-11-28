package moe.celery.kenjatime

import kotlin.test.*

/** Sprite/collision scale contracts, not native negative-scale phase captures. */
class ProjectileScaleTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nctrl=1\nanim=0"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-5,-20,5,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=0,-20,10,0
        Clsn2Default:1
        Clsn2[0]=0,-20,10,0
        200,0,8,-4,2
        200,1,0,0,-1
    """.trimIndent()
    private fun fight(size: String="",extra: String="",width: Int=320): DeterministicFight {
        val owner=FighterDefinition.fromScript("scaled",air,"[Size]\n$size\n$idle\n$extra",
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        return DeterministicFight(FightingCharacter(owner,1),
            FightingCharacter(FighterDefinition.fromScript("target",air,idle),2)).also {
            it.p2.posX=100*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun source(params: String)="[State 0, fire]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n$params"
    private fun spawn(w: DeterministicFight,sx: Double=1.0,sy: Double=1.0,x: Int=0,
                      owner: FightingCharacter=w.p1,life: Int=-1,hit: HitDefinition=HitDefinition(damage=10)):
        CoreProjectile {
        val offset=(x*Fixed.ONE-owner.posX)*(if(owner.facingRight)1 else -1)
        w.entities.add(listOf(EntityRequest.Projectile(owner,7,200,offset,0,0,0,life,hit,scaleX=sx,scaleY=sy)),w.issues)
        return w.entities.projectiles.last()
    }
    private fun draw(w: DeterministicFight)=CorePresentationPlanner.snapshot(w,0)
        .substringAfter("\"kind\":\"projectile\"").substringBefore("}")
    private fun field(draw: String,name: String)=Regex("\"$name\":([^,}]+)")
        .find(draw)!!.groupValues[1].toDouble()

    @Test fun readsProjectileDoScaleAsAnIndependentSizeConstant() {
        for((flag,expected) in listOf("0" to false,"1" to true,"-1" to true,"bad" to false)) {
            val script="[Size]\nxscale=2\nyscale=.5\nproj.doscale=$flag"
            assertEquals(expected,MugenCnsParser.constants(script).projectileDoScale)
            assertEquals(expected,FighterDefinition.fromScript("constant",air,script).projectileDoScale)
        }
        assertFalse(FighterDefinition.fromScript("default",air,idle).projectileDoScale)
    }

    @Test fun defaultProjectileScaleDoesNotInheritBodySize() {
        val w=fight("xscale=2\nyscale=.5");val p=spawn(w)
        assertEquals(1.0,p.scaleX);assertEquals(1.0,p.scaleY)
        assertEquals(MugenRect(0,-20*Fixed.ONE,10*Fixed.ONE,0),p.hitBoxes().single())
        assertEquals(1.0,field(draw(w),"spriteScaleX"));assertEquals(1.0,field(draw(w),"spriteScaleY"))
    }

    @Test fun explicitDisabledBodyScalingRetainsAuthoredProjectileScale() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=0");val p=spawn(w,1.5,.5)
        assertEquals(1.5,p.scaleX);assertEquals(.5,p.scaleY)
        assertEquals(MugenRect(0,-10*Fixed.ONE,15*Fixed.ONE,0),p.hitBoxes().single())
    }

    @Test fun enabledBodyScalingMultipliesEachAuthoredAxisExactlyOnce() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=1");val p=spawn(w,1.5,.5)
        assertEquals(3.0,p.scaleX);assertEquals(.25,p.scaleY)
        assertEquals(MugenRect(0,-5*Fixed.ONE,30*Fixed.ONE,0),p.hitBoxes().single())
        assertEquals(3.0,field(draw(w),"spriteScaleX"));assertEquals(.25,field(draw(w),"spriteScaleY"))
    }

    @Test fun nestedCnsScaleExpressionsAreCapturedWithoutReevaluatingVariables() {
        val w=fight(extra=source("projscale=ifelse(var(0),1.5,.5),max(.25,.5)"))
        w.p1.vars[0]=1;w.step();val p=w.entities.projectiles.single()
        w.p1.vars[0]=0;w.p1.facingRight=false
        assertEquals(1.5,p.scaleX);assertEquals(.5,p.scaleY);assertTrue(p.facingRight)
        w.step();assertEquals(1.5,p.scaleX);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun scalarScaleDefaultsOnlyTheMissingSecondAxisToOne() {
        val w=fight(extra=source("projscale=1.5"));w.step()
        val p=w.entities.projectiles.single();assertEquals(1.5,p.scaleX);assertEquals(1.0,p.scaleY)
    }

    @Test fun highLocalcoordConvertsGeometryAndPixelsOnceButNotTheScaleFactors() {
        val w=fight(extra=source("projscale=1.5,.5"),width=640);w.step()
        val p=w.entities.projectiles.single()
        assertEquals(1.5,p.scaleX);assertEquals(.5,p.scaleY)
        assertEquals(MugenRect(0,-5*Fixed.ONE,Fixed.of(7.5),0),p.hitBoxes().single())
        assertEquals(.75,field(draw(w),"spriteScaleX"));assertEquals(.25,field(draw(w),"spriteScaleY"))
    }

    @Test fun highLocalcoordAndOptedInBodyScaleComposeWithoutAnExtraConversion() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=1",width=640);val p=spawn(w,1.5,.5)
        assertEquals(3.0,p.scaleX);assertEquals(.25,p.scaleY)
        assertEquals(MugenRect(0,Fixed.of(-2.5),15*Fixed.ONE,0),p.hitBoxes().single())
        assertEquals(1.5,field(draw(w),"spriteScaleX"));assertEquals(.125,field(draw(w),"spriteScaleY"))
    }

    @Test fun fractionalFactorsAreNotQuantizedToFighterSizeMetadata() {
        val w=fight();val p=spawn(w,.333,.123)
        assertEquals((10*.333*Fixed.ONE).toInt(),p.hitBoxes().single().x2)
        assertEquals((-20*.123*Fixed.ONE).toInt(),p.hitBoxes().single().y1)
        assertEquals(.333,p.scaleX);assertEquals(.123,p.scaleY)
    }

    @Test fun completeRelativeOffsetsTruncateBeforeAddingTheWorldAxis() {
        val c=MugenCoordinates(320);val r=MugenRect(0,0,1,1)
        assertEquals(MugenRect(-100,0,-75,25),c.scaledBox(r,-100,0,true,.1,.1))
        assertEquals(MugenRect(-125,0,-100,25),c.scaledBox(r,-100,0,false,.1,.1))
    }

    @Test fun shrinkingAndGrowingXScaleChangeActualContactReach() {
        for((scale,target,hit) in listOf(Triple(.5,12,false),Triple(1.0,12,true),Triple(1.0,22,false),Triple(2.0,22,true))) {
            val w=fight();w.p2.posX=target*Fixed.ONE;spawn(w,scale)
            w.step();assertEquals(if(hit)990 else 1000,w.p2.life,"scale=$scale target=$target")
        }
    }

    @Test fun projectileContactRefreshesScaledBoxesOnAnAirElementChange() {
        val w = fight()
        val active = w.p1.definition.animations.getValue(200).frames.first()
        val action = AirAction(200, listOf(active.copy(boxes = emptyList()), active.copy(duration = -1)))
        val shot = CoreProjectile(w.p1, 3, 7, AirAnimationPlayer(action), HitDefinition(damage = 10),
            0, 0, Fixed.ONE, 0, -1)
        w.entities.projectiles.add(shot)
        w.p2.posX = 8 * Fixed.ONE

        w.step()
        assertEquals(1000, w.p2.life)
        assertTrue(shot.hitBoxes().isEmpty())
        w.step()
        assertEquals(990, w.p2.life)
        assertEquals(2 * Fixed.ONE, shot.hitBoxes().single().x1)
    }

    @Test fun verticalScaleChangesContactHeightWithoutMovingTheAxis() {
        for(scale in listOf(1.0,2.0)) {
            val w=fight();w.p2.posX=5*Fixed.ONE;w.p2.posY=-30*Fixed.ONE
            val p=spawn(w,sy=scale);w.step()
            assertEquals(if(scale==2.0)990 else 1000,w.p2.life);assertEquals(0,p.y)
        }
    }

    @Test fun negativeXMirrorsGeometryWithoutChangingLaunchFacingOrKnockback() {
        val w=fight();w.p2.posX=-8*Fixed.ONE
        val p=spawn(w,-1.0,hit=HitDefinition(damage=10,velocityX=3*Fixed.ONE))
        assertEquals(MugenRect(-10*Fixed.ONE,-20*Fixed.ONE,0,0),p.hitBoxes().single())
        assertTrue(p.facingRight);w.step();assertEquals(990,w.p2.life);assertEquals(3*Fixed.ONE,w.p2.velX)
    }

    @Test fun negativeScaleAndLeftFacingComposeAsTwoIndependentReflections() {
        val w=fight();w.p1.facingRight=false;w.p2.posX=8*Fixed.ONE
        val p=spawn(w,-1.0);assertEquals(0,p.hitBoxes().single().x1)
        assertEquals(10*Fixed.ONE,p.hitBoxes().single().x2);assertFalse(p.facingRight)
        w.step();assertEquals(990,w.p2.life)
    }

    @Test fun negativeYNormalizesTheRectangleWithoutChangingVerticalMotion() {
        val w=fight();val p=spawn(w,sy=-.5)
        assertEquals(MugenRect(0,0,10*Fixed.ONE,10*Fixed.ONE),p.hitBoxes().single())
        assertEquals(0,p.vy);assertEquals(-.5,field(draw(w),"spriteScaleY"))
    }

    @Test fun zeroAndSubpixelDegenerateBoxesCannotHitOrClash() {
        for((sx,sy) in listOf(0.0 to 1.0,1.0 to 0.0,1e-9 to 1.0,1.0 to 1e-9)) {
            val w=fight();w.p2.posX=0;w.p2.posY=Fixed.ONE
            val p=spawn(w,sx,sy,life=3)
            assertTrue(p.hitBoxes().isEmpty());assertTrue(p.clashBoxes().isEmpty())
            repeat(3){w.step();assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())}
            assertEquals(1,p.hitsLeft);assertFalse(p.alive)
        }
    }

    @Test fun clashGeometryUsesTheSameAuthoredScaleAsAttacksAndSprites() {
        for(scale in listOf(.5,1.0)) {
            val w=fight();val a=spawn(w,scale);val b=spawn(w,owner=w.p2,x=18)
            w.step();assertEquals(scale==1.0,a.cancelled);assertEquals(scale==1.0,b.cancelled)
        }
    }

    @Test fun bodySizeOnlyChangesClashReachWhenDoScaleIsEnabled() {
        for(flag in listOf(0,1)) {
            val w=fight("xscale=4\nproj.doscale=$flag")
            val a=spawn(w);val b=spawn(w,owner=w.p2,x=30)
            w.step();assertEquals(flag==1,a.cancelled);assertEquals(flag==1,b.cancelled)
        }
    }

    @Test fun scaleDoesNotMultiplyOffsetVelocityAccelerationOrLifetime() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=1",
            source("projscale=3,4\noffset=20,0\nvelocity=8,0\naccel=4,0\nvelmul=.5,1\nprojremovetime=5"),width=640)
        w.p2.posX=10000*Fixed.ONE;w.step();val p=w.entities.projectiles.single()
        assertEquals(10*Fixed.ONE,p.x);assertEquals(4*Fixed.ONE,p.vx);assertEquals(6.0,p.scaleX);assertEquals(2.0,p.scaleY)
        w.step();assertEquals(14*Fixed.ONE,p.x);assertEquals(3*Fixed.ONE,p.vx);assertEquals(4,p.ticksLeft)
    }

    @Test fun airOffsetsUseTheSameSignedPixelTransformAsTheSpritePivot() {
        val w=fight();spawn(w,1.5,.5)
        val d=draw(w)
        assertEquals(2.1,field(d,"pixelScaleX"),1e-12);assertEquals(.55,field(d,"pixelScaleY"),1e-12)
        assertEquals(496.8,field(d,"x"),1e-12);assertEquals(432.8,field(d,"y"),1e-12)
        val mirrored=fight();spawn(mirrored,-1.5,-.5)
        assertEquals(463.2,field(draw(mirrored),"x"),1e-12);assertEquals(437.2,field(draw(mirrored),"y"),1e-12)
    }

    @Test fun helperShotScaleComesFromItsOwnResourcesAndDoesNotChangeItsRoot() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=1")
        w.entities.add(listOf(EntityRequest.Helper(w.p1,9,0,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        val p=spawn(w,.75,2.0,owner=h)
        assertEquals(1.5,p.scaleX);assertEquals(1.0,p.scaleY)
        assertSame(w.p1.definition,h.definition);assertEquals(2*Fixed.ONE,w.p1.definition.xScale)
    }

    @Test fun aForeignControllerBankDoesNotReplaceProjectileResourceSizeMetadata() {
        val w=fight("xscale=2\nyscale=.5\nproj.doscale=1",
            "[Statedef 800]\nanim=0\n"+source("projscale=.75,2").replace("[State 0, fire]","[State 800, fire]"))
        w.p2.enterAuthoredState(800,w.p1,w.issues);w.step()
        val p=w.entities.projectiles.single()
        assertSame(w.p2,p.owner);assertEquals(.75,p.scaleX);assertEquals(2.0,p.scaleY)
        assertFalse(w.p2.definition.projectileDoScale)
    }

    @Test fun malformedOrExcessiveScalesDoNotQueuePartialProjectiles() {
        for(scale in listOf("1,2,3","unknown,1","1/0,1","65,1","-65,1","1,64.01")) {
            val w=fight(extra=source("projscale=$scale"));w.step()
            assertTrue(w.entities.projectiles.isEmpty(),scale)
            assertTrue(w.issues.any { it.startsWith("Invalid Projectile:") },scale)
        }
    }

    @Test fun invalidRequestsDoNotConsumeTheRemainingProjectileSlot() {
        val w=fight();w.entities.maxProjectiles=1
        val r=EntityRequest.Projectile(w.p1,7,200,0,0,0,0,-1,HitDefinition())
        w.entities.add(listOf(r.copy(scaleX=Double.NaN),r.copy(scaleY=Double.POSITIVE_INFINITY),r.copy(scaleX=65.0),r),w.issues)
        assertEquals(1,w.entities.projectiles.size);assertFalse(w.issues.any { it.contains("resource limit") })
    }

    @Test fun scaleAndCoordinateOverflowSaturateInsteadOfWrappingOrProducingNaN() {
        val c=MugenCoordinates(160);val r=MugenRect(-1,-1,1,1)
        assertEquals(MugenRect(Int.MIN_VALUE,Int.MIN_VALUE,Int.MAX_VALUE,Int.MAX_VALUE),
            c.scaledBox(r,Int.MAX_VALUE,Int.MIN_VALUE,true,Double.MAX_VALUE,Double.MAX_VALUE))
        val w=fight();val p=spawn(w,64.0,64.0)
        p.x=Int.MAX_VALUE-1
        assertTrue(p.hitBoxes().single().x2==Int.MAX_VALUE)
        assertFalse(CorePresentationPlanner.snapshot(w,0).contains("Infinity"))
        assertFalse(CorePresentationPlanner.snapshot(w,0).contains("NaN"))
    }

    @Test fun signedBoundaryScalesComposeWithTheLargestAllowedBodyMetadata() {
        val w=fight()
        val d=w.p1.definition.copy(xScale=65536,yScale=65536,projectileDoScale=true)
        val actor=FightingCharacter(d,3);actor.opponent=w.p2
        val p=spawn(w,-64.0,64.0,owner=actor)
        assertEquals(-16384.0,p.scaleX);assertEquals(16384.0,p.scaleY)
        assertTrue(p.hitBoxes().isNotEmpty())
    }

    @Test fun repeatedPresentationAndSkippedDrawsCannotChangeScaledCombat() {
        fun replay(render: Boolean): List<String> {
            val w=fight("xscale=2\nproj.doscale=1");w.p2.posX=20*Fixed.ONE
            val p=spawn(w,.75,.5,life=10)
            return (0 until 20).map {
                w.step()
                if(render)repeat(4){CorePresentationPlanner.snapshot(w,12)}
                "${w.checksum()}:${p.x}:${p.scaleX}:${p.scaleY}:${p.hitBoxes()}:${p.clashBoxes()}:${p.ticksLeft}:${p.hitsLeft}"
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
