package moe.celery.kenjatime

import kotlin.test.*

/** Shared eligibility contracts; native juggle/contact ordering is unverified. */
class HitFlagsTest {
    private val air="[Begin Action 0]\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n0,0,0,0,-1\n"+
        "[Begin Action 200]\nClsn1Default:1\nClsn1[0]=0,-40,40,0\nClsn2Default:1\nClsn2[0]=-10,-40,10,0\n200,0,0,0,-1"
    private fun state(id: Int,type: String="S",move: String="I")=
        "[Statedef $id]\ntype=$type\nmovetype=$move\nphysics=N\nctrl=1\nanim=0"
    private val states=listOf(state(0),state(700,move="H"),state(701,"C"),state(702,"A"),
        state(703,"A","H"),state(704,"L","H"),state(5000,move="H"),state(800),state(900,move="H"),
        state(120),state(130),state(131),state(132),state(140),state(150,move="H"),state(151,"C","H"),
        state(152,"A","H"),state(153,move="H"),state(154,move="H"),state(155,move="H")).joinToString("\n")
    private fun attack(params: String)="[Statedef 200]\ntype=S\nmovetype=A\nphysics=N\nanim=200\n"+
        "[State 200, hit]\ntype=HitDef\ntrigger1=Time=0\ndamage=10,2\nguardflag=HL\n$params"
    private fun shot(params: String)="[State 0, shot]\ntype=Projectile\ntrigger1=Time=0\nprojanim=200\n"+
        "projid=81\nprojhits=2\nprojremovetime=30\ndamage=10,2\nguardflag=HL\n$params"
    private fun fight(params: String="",extra: String=""): DeterministicFight {
        val a=FighterDefinition.fromScript("attacker",air,"$states\n${attack(params)}\n$extra")
        val b=FighterDefinition.fromScript("victim",air,"$states\n${attack(params)}")
        return DeterministicFight(FightingCharacter(a,1),FightingCharacter(b,2)).also {
            it.p2.posX=20*Fixed.ONE;it.p2.facingRight=false
        }
    }
    private fun accepts(w: DeterministicFight,flags: String)=w.p2.canReceive(HitDefinition(hitFlag=flags))

    @Test fun highLowAndMidSelectStandingAndCrouchingSeparately() {
        val w=fight()
        for((state,expected) in listOf(0 to "HM",701 to "LM")) {
            w.p2.changeState(state)
            for(flag in "HLMAFD")assertEquals(flag in expected,accepts(w,flag.toString()),"$state/$flag")
        }
    }
    @Test fun plusUsesMoveTypeInsteadOfConventionalHitStateNumbers() {
        val w=fight()
        for((state,expected) in listOf(0 to false,200 to false,700 to true,5000 to true)) {
            w.p2.changeState(state);assertEquals(expected,accepts(w,"M+"),"state=$state")
        }
    }
    @Test fun minusPreventsCombosButAllowsIdleAndAttackingVictims() {
        val w=fight()
        for((state,expected) in listOf(0 to true,200 to true,700 to false,5000 to false,150 to false)) {
            w.p2.changeState(state);assertEquals(expected,accepts(w,"M-"),"state=$state")
        }
    }
    @Test fun guardCommonStatesAreExcludedFromPlusFollowups() {
        val w=fight()
        for(state in listOf(120,130,131,132,140,150,151,152,153,154,155)) {
            w.p2.changeState(state);assertFalse(accepts(w,"MAFD+"),"state=$state")
        }
        w.p2.changeState(150);assertTrue(accepts(w,"M"));assertFalse(accepts(w,"M-"))
    }
    @Test fun airRequiresAAndFallingHitVictimsAdditionallyRequireF() {
        val w=fight();w.p2.changeState(702)
        assertTrue(accepts(w,"A"));assertFalse(accepts(w,"MF"));assertFalse(accepts(w,"M"))
        w.p2.receiveHit(HitDefinition(airFall=true),true);w.p2.changeState(703)
        assertFalse(accepts(w,"MA"));assertFalse(accepts(w,"MF"));assertTrue(accepts(w,"MAF"))
        assertTrue(accepts(w,"AF+"));assertFalse(accepts(w,"AF-"))
    }
    @Test fun staleFallMetadataDoesNotBlockRecoveredAirborneActors() {
        val w=fight();w.p2.receiveHit(HitDefinition(fall=true),true);w.p2.changeState(702)
        assertEquals(1.0,w.p2.getHitVar("fall"));assertTrue(accepts(w,"A-"))
    }
    @Test fun downFlagCannotSubstituteForAnAirOrGroundMask() {
        val w=fight();w.p2.changeState(704)
        assertFalse(accepts(w,"MAF"));assertTrue(accepts(w,"MD+"));assertFalse(accepts(w,"MD-"))
        w.p2.changeState(0);assertFalse(accepts(w,"D"))
    }
    @Test fun flagsNormalizeCaseAndWhitespaceAcrossAuthoredAndDirectPaths() {
        val w=fight("hitflag= m a f -");w.p1.changeState(200);w.p1.tick(w.issues)
        assertEquals("MAF-",w.p1.activeHitDef!!.hitFlag);assertTrue(accepts(w," m\ta\nf - "))
        assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun invalidDirectMasksRejectWithoutChangingTheVictim() {
        for(flags in listOf("M+-","MZ","","+")) {
            val w=fight();w.p2.receiveHit(HitDefinition(damage=10,hitFlag=flags),true,attacker=w.p1)
            assertEquals(1000,w.p2.life);assertEquals(0,w.p2.stateNo);assertTrue(w.p1.targets().isEmpty())
            assertTrue(w.issues.any { it.startsWith("Invalid hitflag:") },flags)
        }
    }
    @Test fun invalidAuthoredFlagsNeverReplaceALiveHitDefinition() {
        val w=fight("hitflag=M-","[State 200, invalid]\ntype=HitDef\ntrigger1=Time=1\nhitflag=M+-")
        w.p2.posX=1000*Fixed.ONE;w.p1.changeState(200);w.step();val hit=w.p1.activeHitDef
        w.step();assertSame(hit,w.p1.activeHitDef);assertTrue(w.issues.any { it.startsWith("Invalid hitflag:") })
        val first=fight("hitflag=MZ");first.p1.changeState(200);first.step()
        assertNull(first.p1.activeHitDef);assertEquals(1000,first.p2.life)
    }
    @Test fun projectileAliasIsValidatedWithStandardParameterPrecedence() {
        for(params in listOf("hitflag=M+-","projhitflag=unknown")) {
            val w=fight(extra=shot(params));w.step();assertTrue(w.entities.projectiles.isEmpty())
            assertTrue(w.issues.any { it.startsWith("Invalid hitflag:") })
        }
        val w=fight(extra=shot("hitflag=m-\nprojhitflag=unknown"));w.step();w.step()
        assertEquals(990,w.p2.life);assertTrue(w.issues.isEmpty(),w.issues.joinToString())
    }
    @Test fun hitAndProjectileControllersKeepNestedDamageAndRecoveryExpressionsIntact() {
        val params = """
            hitflag=MAFDP
            damage=Ceil(Cond(EnemyNear,Life=1000,22.25,90)),Cond(0,1/0,6)
            fall.recovertime=14+(EnemyNear,MoveType=A)*3-Cond(Var(5)<10,Var(5),10)
        """.trimIndent()
        val strike = fight(params)
        strike.p1.vars[5] = 4
        strike.p1.changeState(200)
        strike.step()
        assertEquals(23, strike.contacts.single().damage)
        assertEquals(977, strike.p2.life)
        assertEquals(10, strike.p1.activeHitDef?.fallRecoverTime)
        assertTrue(strike.issues.isEmpty(), strike.issues.toString())

        val projectile = fight(extra = shot(params))
        projectile.step()
        projectile.step(b = InputFrame(Directions.R))
        assertTrue(projectile.contacts.single().guarded)
        assertEquals(994, projectile.p2.life)
        assertTrue(projectile.issues.isEmpty(), projectile.issues.toString())
        assertFalse(accepts(projectile, "P"))
    }
    @Test fun rejectedComboHitKeepsItsWindowAndHasNoContactSideEffects() {
        val w=fight("hitflag=M+\npausetime=2,3\nid=71\np1stateno=800")
        w.p1.changeState(200);w.step()
        assertEquals(1000,w.p2.life);assertEquals(0,w.p2.stateNo);assertEquals(0,w.p2.hitPauseLeft)
        assertEquals(0,w.p1.hitPauseLeft);assertFalse(w.p1.moveContact);assertTrue(w.contacts.isEmpty())
        assertEquals(0.0,w.p2.getHitVar("damage"));assertTrue(w.p1.canHit(w.p2.id));assertTrue(w.p1.targets().isEmpty())
        w.p2.changeState(700);w.step()
        assertEquals(990,w.p2.life);assertEquals(1,w.contacts.size);assertEquals(800,w.p1.stateNo)
        assertEquals(listOf(w.p2),w.p1.targets(71));assertEquals(3,w.p2.hitPauseLeft)
    }
    @Test fun throwMinusCannotCaptureUntilTheVictimRecovers() {
        val w=fight("hitflag=M-\nid=71\np1stateno=800\np2stateno=900")
        w.p2.changeState(700);w.p1.changeState(200);w.step()
        assertEquals(1000,w.p2.life);assertEquals(700,w.p2.stateNo);assertEquals(200,w.p1.stateNo)
        assertTrue(w.p1.targets().isEmpty());assertTrue(w.p1.canHit(w.p2.id))
        w.p2.changeState(0);w.step()
        assertEquals(990,w.p2.life);assertEquals(800,w.p1.stateNo);assertEquals(900,w.p2.stateNo)
        assertSame(w.p1,w.p2.stateOwner);assertEquals(listOf(w.p2),w.p1.targets(71))
    }
    @Test fun helperContactsRespectTheSameEligibilityAndRetainTheirWindow() {
        val w=fight("hitflag=M+","[State 0, helper]\ntype=Helper\ntrigger1=Time=0\nstateno=200")
        w.step();w.step();val helper=w.entities.helpers.single().actor
        assertEquals(1000,w.p2.life);assertFalse(helper.moveContact);assertTrue(helper.canHit(w.p2.id))
        w.p2.changeState(700);w.step();assertEquals(990,w.p2.life);assertTrue(helper.moveHit)
    }
    @Test fun rejectedProjectileConsumesNoHitAllowancePauseOrHistory() {
        val w=fight(extra=shot("projhitflag=M+\npausetime=2,3"));w.step();w.step()
        val shot=w.entities.projectiles.single();assertEquals(2,shot.hitsLeft);assertEquals(0,shot.hitPauseLeft)
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty())
        assertEquals(-1.0,CoreExpression.number("ProjContactTime(81)",w.p1,w.issues))
        w.p2.changeState(700);w.step();assertEquals(990,w.p2.life);assertEquals(1,shot.hitsLeft)
        assertEquals(2,shot.hitPauseLeft);assertEquals(1.0,CoreExpression.number("ProjHitTime(81)",w.p1,w.issues))
    }
    @Test fun minusProjectileCannotComboIntoItsOwnFirstContact() {
        val w=fight(extra=shot("hitflag=M-"));w.step();w.step()
        assertEquals(990,w.p2.life);assertEquals(1,w.entities.projectiles.single().hitsLeft)
        w.step();assertEquals(990,w.p2.life);assertEquals(1,w.entities.projectiles.single().hitsLeft)
        assertTrue(w.contacts.isEmpty());assertEquals(2.0,CoreExpression.number("ProjHitTime(81)",w.p1,w.issues))
        w.p2.changeState(0);w.step();assertEquals(980,w.p2.life);assertTrue(w.entities.projectiles.isEmpty())
    }
    @Test fun eligibilityDoesNotBypassGuardabilityOrAttributeImmunity() {
        val guarded=fight("hitflag=M-");guarded.p1.changeState(200)
        guarded.step(b=InputFrame(Directions.R));assertEquals(998,guarded.p2.life);assertTrue(guarded.contacts.single().guarded)
        val w=fight("hitflag=M+");w.p2.changeState(700)
        val c=MugenCnsParser.parse("[Statedef 0]\n[State 0, protect]\ntype=NotHitBy\ntrigger1=1\nvalue=SCA\ntime=-1")
            .getValue(0).controllers.single()
        w.p2.hitFilters.execute(w.p2,c,w.issues);w.p1.changeState(200);w.step()
        assertEquals(1000,w.p2.life);assertTrue(w.contacts.isEmpty());assertTrue(w.p1.canHit(w.p2.id))
    }
    @Test fun tradesAndPresentationReadsPreserveContactEligibility() {
        val w=fight("hitflag=M-");w.p1.changeState(200);w.p2.changeState(200);w.step()
        assertEquals(990,w.p1.life);assertEquals(990,w.p2.life);assertEquals(2,w.contacts.size)
        val before=w.checksum();repeat(10){CorePresentationPlanner.snapshot(w,12)}
        assertEquals(before,w.checksum());assertEquals(2,w.contacts.size)
    }
}
