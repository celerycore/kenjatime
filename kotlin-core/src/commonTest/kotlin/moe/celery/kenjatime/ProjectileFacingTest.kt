package moe.celery.kenjatime

import kotlin.test.*

/** Projectile-owned orientation contracts, not native multi-hit/clash parity. */
class ProjectileFacingTest {
    private val idle="[Statedef 0]\ntype=S\nphysics=N\nanim=0\nctrl=1"
    private val air="""
        [Begin Action 0]
        Clsn2Default:1
        Clsn2[0]=-5,-40,5,0
        0,0,0,0,-1
        [Begin Action 200]
        Clsn1Default:1
        Clsn1[0]=0,-40,10,0
        200,0,0,0,-1
    """.trimIndent()
    private fun fight(extra: String="",width: Int=320): DeterministicFight {
        val owner=FighterDefinition.fromScript("owner",air,idle+"\n"+extra,
            defText="[Info]\nlocalcoord=$width,${width*3/4}")
        return DeterministicFight(FightingCharacter(owner,1),
            FightingCharacter(FighterDefinition.fromScript("victim",air,idle),2))
    }
    private fun spawn(w: DeterministicFight,owner: FightingCharacter=w.p1,offset: Int=0,
                      speed: Int=2*Fixed.ONE,hit: HitDefinition=HitDefinition(damage=10,velocityX=3*Fixed.ONE)):
        CoreProjectile {
        w.entities.add(listOf(EntityRequest.Projectile(owner,7,200,offset,0,speed,0,120,hit)),w.issues)
        return w.entities.projectiles.last()
    }

    @Test fun creatorTurnsDoNotMirrorLiveProjectileGeometryOrPresentation() {
        for(right in listOf(true,false)) {
            val w=fight();w.p2.posX=200*Fixed.ONE
            w.p1.facingRight=right
            val p=spawn(w,offset=10*Fixed.ONE)
            val boxes=p.hitBoxes()
            w.p1.facingRight=!right
            assertEquals(right,p.facingRight)
            assertEquals(boxes,p.hitBoxes())
            val plan=CorePresentationPlanner.snapshot(w,0)
            val draw=plan.substringAfter("\"kind\":\"projectile\"")
            assertTrue(draw.contains("\"facing\":${if(right)1 else -1}"),plan)
            w.step()
            assertEquals((if(right)12 else -12)*Fixed.ONE,p.x)
            assertTrue(w.issues.isEmpty(),w.issues.joinToString())
        }
    }

    @Test fun requestCapturesFacingBeforeLaterControllersTurnTheCreator() {
        val w=fight("""
            [State 0, fire]
            type=Projectile
            trigger1=Time=0
            projid=7
            projanim=200
            offset=10,0
            velocity=2,0
            [State 0, turn after firing]
            type=Turn
            trigger1=Time=0
        """.trimIndent())
        w.p2.posX=200*Fixed.ONE
        w.step()
        val p=w.entities.projectiles.single()
        assertFalse(w.p1.facingRight)
        assertTrue(p.facingRight)
        assertEquals(10*Fixed.ONE,p.x)
        assertEquals(2*Fixed.ONE,p.vx)
        w.step()
        assertEquals(12*Fixed.ONE,p.x)
    }

    @Test fun oppositeShotsFromOneCreatorKeepIndependentFacing() {
        val w=fight();w.p2.posX=200*Fixed.ONE
        val first=spawn(w)
        w.p1.facingRight=false
        val second=spawn(w)
        w.p1.facingRight=true
        w.step()
        assertTrue(first.facingRight)
        assertFalse(second.facingRight)
        assertEquals(2*Fixed.ONE,first.x)
        assertEquals(-2*Fixed.ONE,second.x)
        assertEquals(10*Fixed.ONE,first.hitBoxes().single().let { it.x2-it.x1 })
        assertEquals(10*Fixed.ONE,second.hitBoxes().single().let { it.x2-it.x1 })
    }

    @Test fun hitKnockbackFollowsProjectileLaunchFacingAfterCreatorTurns() {
        for(right in listOf(true,false)) {
            val w=fight();w.p1.facingRight=right
            w.p2.posX=(if(right)15 else -15)*Fixed.ONE
            val p=spawn(w,offset=10*Fixed.ONE)
            w.p1.facingRight=!right
            w.step()
            assertEquals(990,w.p2.life)
            assertEquals((if(right)3 else -3)*Fixed.ONE,w.p2.velX)
            assertEquals(p.entityId,w.contacts.single().attacker)
            assertTrue(w.entities.projectiles.isEmpty())
        }
    }

    @Test fun guardAndChipContactStillUseCapturedProjectileDirection() {
        val w=fight();w.p2.posX=15*Fixed.ONE;w.p2.facingRight=false
        spawn(w,offset=10*Fixed.ONE,hit=HitDefinition(damage=100,guardDamage=2,
            guardFlag="M",guardVelocityX=Fixed.ONE))
        w.p1.facingRight=false
        w.step(b=InputFrame(Directions.R))
        assertEquals(998,w.p2.life)
        assertEquals(Fixed.ONE,w.p2.velX)
        assertTrue(w.contacts.single().guarded)
    }

    @Test fun helperOwnedProjectilesKeepLaunchSideWhenHelperTurns() {
        val w=fight();w.p2.posX=200*Fixed.ONE
        w.entities.add(listOf(EntityRequest.Helper(w.p1,1,0,0,0,1,false,0)),w.issues)
        val helper=w.entities.helpers.single().actor
        val p=spawn(w,owner=helper)
        helper.facingRight=false;w.p1.facingRight=false
        w.step()
        assertTrue(p.facingRight)
        assertEquals(2*Fixed.ONE,p.x)
        val draw=CorePresentationPlanner.snapshot(w,0).substringAfter("\"kind\":\"projectile\"")
        assertTrue(draw.contains("\"facing\":1"),draw)
    }

    @Test fun mixedCoordinateGeometryKeepsLaunchFacingAndExactScale() {
        val w=fight(width=1008);w.p2.posX=200*Fixed.ONE
        val p=spawn(w,speed=Fixed.ONE)
        val before=p.hitBoxes().single()
        assertEquals(812,before.x2)
        w.p1.facingRight=false
        assertEquals(before,p.hitBoxes().single())
        assertEquals(320.0/1008,p.owner.definition.coordinates.scale)
    }

    @Test fun skippedPresentationDoesNotChangeProjectileLifetimeOrContacts() {
        fun replay(render: Boolean): List<String> {
            val w=fight();w.p2.posX=100*Fixed.ONE
            spawn(w)
            return (0 until 60).map { tick ->
                w.p1.facingRight=tick%2==0
                w.step()
                if(render)repeat(3){CorePresentationPlanner.snapshot(w,12)}
                w.checksum()+":"+w.entities.projectiles.joinToString { "${it.x}/${it.facingRight}/${it.ticksLeft}" }
            }
        }
        assertEquals(replay(false),replay(true))
    }
}
