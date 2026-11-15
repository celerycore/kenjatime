package moe.celery.kenjatime

import kotlin.test.*

/** Mixed script-unit contracts; not original Nu-13/Tomoka native captures. */
class CoordinateSpaceTest {
    private val idle="[Statedef 0]\ntype=S\nmovetype=I\nphysics=N\nanim=0\nctrl=1"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-20,-50,20,0
        0,0,0,0,-1
        [Begin Action 400]
        Clsn1Default:1
        Clsn1[0]=-40,-100,40,0
        400,0,0,0,-1
    """.trimIndent()
    private fun definition(width: Int=320, height: Int=width*3/4, extra: String="", actions: String=air)=
        FighterDefinition.fromScript("$width-space",actions,idle+"\n"+extra,
            defText="[Info]\nlocalcoord=$width,$height")
    private fun fight(d: FighterDefinition, rival: FighterDefinition=definition())=
        DeterministicFight(FightingCharacter(d,1),FightingCharacter(rival,2))
    private fun value(text: String, actor: FightingCharacter, errors: MutableSet<String> = linkedSetOf())=
        CoreExpression.number(text,actor,errors)
    private fun effect(w: DeterministicFight, type: String="Explod", params: String="anim=0\nid=7\nremovetime=-1") {
        val c=MugenCnsParser.parse("[State 0, effect]\ntype=$type\ntrigger1=1\n$params").getValue(0).controllers.single()
        w.effects.execute(w.p1,c,w.p1.stateOwner)
    }

    @Test fun conversionRoundTripsCanonicalSubpixelsWithoutDrift() {
        for(width in listOf(160,320,640,1008,1920,4096)) {
            val space=MugenCoordinates(width)
            for(fixed in -2048..2048)assertEquals(fixed,space.toWorld(space.toLocal(fixed)),"$width/$fixed")
            for(fixed in listOf(Int.MIN_VALUE,Int.MAX_VALUE))
                assertEquals(fixed,space.toWorld(space.toLocal(fixed)),"$width/$fixed")
        }
        assertEquals(Fixed.ONE,MugenCoordinates(1008).toWorld(3.15))
        assertEquals(3.15,MugenCoordinates(1008).toLocal(Fixed.ONE))
    }

    @Test fun stateDefAndControllerVelocitiesProduceEquivalentWorldReplays() {
        fun run(width: Int): List<String> {
            val n=width/320
            val w=fight(definition(width,extra="""
                [Statedef 0]
                type=S
                physics=N
                anim=0
                velset=${3*n},${-2*n}
                [State 0, accelerate]
                type=VelAdd
                trigger1=Time=3
                x=$n
                y=$n
                [State 0, identity assignment]
                type=VelSet
                trigger1=Time=5
                x=Vel X
                y=Vel Y
            """.trimIndent()))
            return (0 until 60).map { w.step();w.checksum() }
        }
        assertEquals(run(320),run(640))
    }

    @Test fun fractionalNu13WidthStateDefVelocityQuantizesOnlyInStageSpace() {
        val f=FightingCharacter(definition(1008,extra="[Statedef 0]\nvelset=3.15,-6.3"),1)
        assertEquals(Fixed.ONE,f.velX)
        assertEquals(-2*Fixed.ONE,f.velY)
        assertEquals(3.15,value("Vel X",f))
        assertEquals(-6.3,value("Vel Y",f))
    }

    @Test fun spatialTriggersUseActiveScriptUnitsAndBothBodiesUseTheirOwnWidths() {
        val w=fight(definition(640,extra="[Size]\nground.front=30\nground.back=10"),
            definition(extra="[Size]\nground.front=20\nground.back=8"))
        w.p1.posX=10*Fixed.ONE;w.p1.posY=-5*Fixed.ONE;w.p1.velX=3*Fixed.ONE
        w.p2.posX=60*Fixed.ONE;w.p2.posY=-15*Fixed.ONE;w.p2.facingRight=false
        assertEquals(20.0,value("Pos X",w.p1))
        assertEquals(-10.0,value("Pos Y",w.p1))
        assertEquals(6.0,value("Vel X",w.p1))
        assertEquals(100.0,value("P2Dist X",w.p1))
        assertEquals(-20.0,value("P2Dist Y",w.p1))
        assertEquals(30.0,value("P2BodyDist X",w.p1)) // (50 - 15 - 20) * 2
        w.p2.facingRight=true
        assertEquals(54.0,value("P2BodyDist X",w.p1)) // (50 - 15 - 8) * 2
    }

    @Test fun ownGlobalsAndBorrowedControllersReadForeignUnitsThenSelfStateRestoresOwnUnits() {
        val owner=definition(1008,extra="""
            [Statedef 910]
            type=S
            movetype=H
            physics=N
            [State 910, observe]
            type=VarSet
            trigger1=Time=0
            fv=0
            value=Pos X
            [State 910, shift one world pixel]
            type=PosAdd
            trigger1=Time=0
            x=3.15
            [State 910, preserve physical velocity]
            type=VelSet
            trigger1=Time=0
            x=Vel X
            [State 910, return]
            type=SelfState
            trigger1=Time=1
            value=0
        """.trimIndent())
        val victim=definition(extra="""
            [Statedef -2]
            [State -2, own global in active foreign coordinates]
            type=VarSet
            trigger1=Time=0
            fv=1
            value=Pos X
        """.trimIndent())
        val w=fight(owner,victim)
        w.p2.posX=320*Fixed.ONE;w.p2.velX=3*Fixed.ONE
        assertTrue(w.p2.enterAuthoredState(910,w.p1,w.issues))
        assertEquals(320*Fixed.ONE,w.p2.posX)
        assertEquals(3*Fixed.ONE,w.p2.velX)
        assertEquals(1008.0,value("Pos X",w.p2))
        w.step()
        assertEquals(1008.0,w.p2.fvars[0])
        assertEquals(1008.0,w.p2.fvars[1])
        assertEquals(324*Fixed.ONE,w.p2.posX)
        assertEquals(0.0,w.p1.fvars[0])
        w.step()
        assertSame(w.p2,w.p2.stateOwner)
        assertEquals(324.0,value("Pos X",w.p2))
        assertEquals(3*Fixed.ONE,w.p2.velX)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun repeatedPosSetOfPosXDoesNotQuantizeBackwardsInHighResolutionStates() {
        val w=fight(definition(1008,extra="""
            [State 0, identity]
            type=PosSet
            trigger1=1
            x=Pos X
            y=Pos Y
        """.trimIndent()))
        w.p1.posX=12345;w.p1.posY=-12345
        repeat(1000){w.step()}
        assertEquals(12345,w.p1.posX)
        assertEquals(-12345,w.p1.posY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun hitDefAndTargetStateCanTransferMixedResolutionVictimsAndBindThem() {
        val attackAir="""
            [Begin Action 0]
            0,0,0,0,-1
            [Begin Action 200]
            Clsn1Default:1
            Clsn1[0]=0,-189,126,0
            200,0,0,0,-1
        """.trimIndent()
        for(implicit in listOf(false,true)) {
            val owner=definition(1008,extra="""
                [Statedef 200]
                type=S
                movetype=A
                anim=200
                [State 200, hit]
                type=HitDef
                trigger1=Time=0
                id=7
                damage=10
                ground.velocity=6.3,-3.15
                ${if(implicit)"p2stateno=910" else ""}
                ${if(!implicit)"[State 200, transfer]\ntype=TargetState\ntrigger1=Time=1\nid=7\nvalue=910" else ""}
                [State 200, attach]
                type=TargetBind
                trigger1=Time=1
                id=7
                time=2
                pos=31.5,-15.75
                [Statedef 910]
                type=S
                movetype=H
                physics=N
                [State 910, recover]
                type=SelfState
                trigger1=Time=1
                value=0
            """.trimIndent(),actions=attackAir)
            val w=fight(owner)
            w.p1.changeState(200);w.p2.posX=20*Fixed.ONE
            w.step()
            assertEquals(990,w.p2.life)
            assertEquals(2*Fixed.ONE,w.p2.velX)
            assertEquals(-Fixed.ONE,w.p2.velY)
            w.step()
            assertSame(w.p1,w.p2.stateOwner)
            assertEquals(10*Fixed.ONE,w.p2.posX)
            assertEquals(-5*Fixed.ONE,w.p2.posY)
            assertEquals(1,w.p2.binding?.ticksLeft)
            w.step()
            assertSame(w.p2,w.p2.stateOwner)
            assertNull(w.p2.binding)
            w.step()
            assertEquals(12*Fixed.ONE,w.p2.posX)
            assertTrue(w.issues.isEmpty(),w.issues.joinToString())
        }
    }

    @Test fun helperAndProjectileOffsetsAndVelocitiesConvertBeforeEntityCreation() {
        val w=fight(definition(640,extra="""
            [State 0, helper]
            type=Helper
            trigger1=Time=0
            stateno=300
            pos=20,-10
            [State 0, projectile]
            type=Projectile
            trigger1=Time=0
            projanim=400
            offset=20,-10
            velocity=4,0
            projremovetime=20
            [Statedef 300]
            anim=0
            velset=4,0
        """.trimIndent()))
        w.p2.posX=200*Fixed.ONE
        w.step()
        val helper=w.entities.helpers.single().actor
        val projectile=w.entities.projectiles.single()
        assertEquals(10*Fixed.ONE,helper.posX)
        assertEquals(-5*Fixed.ONE,helper.posY)
        assertEquals(2*Fixed.ONE,helper.velX)
        assertEquals(10*Fixed.ONE,projectile.x)
        assertEquals(2*Fixed.ONE,projectile.vx)
        assertEquals(40*Fixed.ONE,projectile.hitBoxes().single().let { it.x2-it.x1 })
        w.step()
        assertEquals(12*Fixed.ONE,helper.posX)
        assertEquals(12*Fixed.ONE,projectile.x)
    }

    @Test fun bindingOffsetsUseExecutorsUnitsAndHeadPointsUseAnchorsOwnDefinition() {
        val high=definition(1008,extra="""
            [Statedef 300]
            anim=0
            [State 300, attach]
            type=BindToTarget
            trigger1=Time=0
            id=7
            pos=3.15,3.15,Head
            time=-1
        """.trimIndent())
        val low=definition(extra="[Size]\nhead.pos=5,-70")
        val w=fight(high,low)
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,300,0,0,1,false,0)),w.issues)
        val h=w.entities.helpers.single().actor
        w.p2.receiveHit(HitDefinition(hitTime=600),true)
        h.captureTarget(w.p2,7)
        w.p2.posX=50*Fixed.ONE;w.p2.posY=-10*Fixed.ONE;w.p2.facingRight=false
        w.step()
        assertEquals(44*Fixed.ONE,h.posX)
        assertEquals(-79*Fixed.ONE,h.posY)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun highResolutionEffectsConvertMotionAndUnchangedPatchesKeepExactWorldValues() {
        val w=fight(definition(1008),definition(extra="[Statedef 910]\ntype=S\nmovetype=H"))
        effect(w,params="anim=0\nid=7\npos=31.5,-15.75\nvelocity=3.15,-6.3\naccel=3.15,3.15\nbindtime=0\nremovetime=-1")
        w.step()
        val e=w.effects.all.single()
        assertEquals(10*Fixed.ONE,e.x);assertEquals(-5*Fixed.ONE,e.y)
        w.step()
        assertEquals(11*Fixed.ONE,e.x);assertEquals(-7*Fixed.ONE,e.y)
        assertTrue(w.p1.enterAuthoredState(910,w.p2,w.issues))
        val config=e.config
        val velocity=e.velocityX
        effect(w,"ModifyExplod","id=7\nscale=2,2")
        assertEquals(config.offsetX,e.config.offsetX)
        assertEquals(config.offsetY,e.config.offsetY)
        assertEquals(config.velocityX,e.config.velocityX)
        assertEquals(velocity,e.velocityX)
        effect(w,"ModifyExplod","id=7\nvelocity=2,0")
        assertEquals(2*Fixed.ONE,e.velocityX,"Spatial patch uses active 320-wide state, not own 1008-wide art")
        assertEquals(1008,e.owner.definition.localCoordWidth)
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }

    @Test fun authoredSpriteSizeAndUniformCoordinateScaleDriveCompletePixelProjection() {
        val d=definition(640,360,"[Size]\nxscale=.5\nyscale=2",
            "[Begin Action 0]\n0,0,20,-10,-1")
        val w=fight(d)
        val plan=CorePresentationPlanner.snapshot(w,0)
        assertTrue(plan.contains("\"x\":487.0"),plan)
        assertTrue(plan.contains("\"y\":424.0"),plan)
        assertTrue(plan.contains("\"spriteScaleX\":0.25"),plan)
        assertTrue(plan.contains("\"spriteScaleY\":1.0"),plan)
        assertTrue(plan.contains("\"pixelScaleX\":0.35"),plan)
        assertTrue(plan.contains("\"pixelScaleY\":1.1"),plan)
    }

    @Test fun collisionTransformsRetainRationalPrecisionAndFacingSymmetry() {
        val space=MugenCoordinates(1008)
        val rect=MugenRect(-50,-100,100,0)
        val right=space.box(rect,0,0,true,Fixed.ONE,Fixed.ONE/2)
        val left=space.box(rect,0,0,false,Fixed.ONE,Fixed.ONE/2)
        assertEquals(-4063,right.x1)
        assertEquals(8126,right.x2)
        assertEquals(-4063,right.y1)
        assertEquals(-8126,left.x1)
        assertEquals(4063,left.x2)
        assertEquals(0L,(right.x1+left.x2).toLong())
        val extreme=space.box(MugenRect(Int.MIN_VALUE,Int.MIN_VALUE,Int.MAX_VALUE,Int.MAX_VALUE),
            0,0,true,65536,65536)
        assertEquals(Int.MIN_VALUE,extreme.x1)
        assertEquals(Int.MAX_VALUE,extreme.x2)
    }

    @Test fun arenaGravityAndLandingAreEquivalentAcrossCoordinateWidths() {
        fun replay(width: Int): List<String> {
            val multiplier=width/320
            val w=fight(definition(width,extra="""
                [Movement]
                yaccel=${0.5*multiplier}
                [Statedef 0]
                type=A
                physics=A
                anim=0
                velset=0,${-2*multiplier}
                [Statedef 52]
                type=S
                physics=N
                anim=0
            """.trimIndent()))
            w.configureArena(-250,250,push=false)
            w.p1.posY=-50*Fixed.ONE;w.p2.posX=200*Fixed.ONE
            return (0 until 120).map { w.step();w.checksum() }
        }
        assertEquals(replay(320),replay(640))
    }

    @Test fun pushWidthsUseEachCharactersBaseSpaceAndFacing() {
        val w=fight(definition(640,extra="[Size]\nground.front=40\nground.back=10"),
            definition(extra="[Size]\nground.front=15\nground.back=5"))
        w.configureArena(-250,250,push=true)
        w.p1.posX=-5*Fixed.ONE;w.p2.posX=5*Fixed.ONE;w.p2.facingRight=false
        w.step()
        assertEquals(35*Fixed.ONE,w.p2.posX-w.p1.posX)
    }

    @Test fun invalidCoordinateMetadataIsRejectedAndMalformedDefsKeepExistingDefaults() {
        assertFailsWith<IllegalArgumentException>{definition().copy(localCoordWidth=0)}
        assertFailsWith<IllegalArgumentException>{definition().copy(localCoordHeight=0)}
        assertFailsWith<IllegalArgumentException>{definition().copy(xScale=Int.MAX_VALUE)}
        val fallback=FighterDefinition.fromScript("bad",air,idle,defText="[Info]\nlocalcoord=0,-1")
        assertEquals(320,fallback.localCoordWidth)
        assertEquals(240,fallback.localCoordHeight)
    }
}
