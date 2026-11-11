package moe.celery.kenjatime

import kotlin.test.*

/** Extracted grammar patterns from the uploaded original Dark Donald scripts.
 * Character code/assets are not copied into this fixture.
 */
class LegacyOpponentRedirectTest {
    @Test fun enemyNearNamePostureDistanceAndStateCompareToActualOpponent() {
        val a=FightingCharacter(FighterDefinition("Dark Donald"),1)
        val b=FightingCharacter(FighterDefinition("Rare Akuma"),2)
        DeterministicFight(a,b)
        val issues=linkedSetOf<String>()
        assertTrue(CoreExpression.test("EnemyNear, Name = \"Rare Akuma\"",a,issues))
        assertFalse(CoreExpression.test("EnemyNear,Name = \"Colonel\"",a,issues))
        assertTrue(CoreExpression.test("EnemyNear,StateType != A",a,issues))
        assertTrue(CoreExpression.test("EnemyNear,MoveType = I",a,issues))
        assertTrue(CoreExpression.test("EnemyNear,StateNo = 0",a,issues))
        assertTrue(CoreExpression.test("EnemyNear,Life >= 1000",a,issues))
        assertTrue(CoreExpression.test("EnemyNear,Ctrl = 1",a,issues))
        assertTrue(issues.isEmpty(),issues.joinToString())
    }

    @Test fun prevStateNoChangesOnAuthoredStateTransition() {
        val a=FightingCharacter(FighterDefinition("Donald"),1)
        val b=FightingCharacter(FighterDefinition("Dummy"),2)
        DeterministicFight(a,b)
        a.changeState(190)
        a.changeState(191)
        val errors=linkedSetOf<String>()
        assertTrue(CoreExpression.test("PrevStateNo = 190 && StateNo = 191",a,errors))
        assertTrue(errors.isEmpty())
    }

    @Test fun unknownEnemyRedirectsFailClosedInsteadOfGuessingIntroBranches() {
        val a=FightingCharacter(FighterDefinition("Dark Donald"),1)
        val b=FightingCharacter(FighterDefinition("Dummy"),2)
        DeterministicFight(a,b)
        val errors=linkedSetOf<String>()
        assertFalse(CoreExpression.test("EnemyNear,AuthorName = \"kishio\"",a,errors))
        assertTrue(errors.any { it.startsWith("Unsupported expression") })
    }
}
