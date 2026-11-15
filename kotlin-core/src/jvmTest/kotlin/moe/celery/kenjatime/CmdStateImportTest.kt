package moe.celery.kenjatime

import java.io.File
import java.util.zip.ZipFile
import kotlin.test.*

/** Uses real repository KFM CMD (including state -1), not a synthetic move list. */
class CmdStateImportTest {
    @Test fun originalKfmWoodExplodsExecuteTheirAuthoredMotionAndExpire() {
        val archive=listOf(File("public/kfm.zip"),File("../public/kfm.zip")).firstOrNull{it.isFile}
        assertNotNull(archive)
        ZipFile(archive).use { zip ->
            val files=zip.entries().asSequence().filter{!it.isDirectory}.toList()
            fun load(vararg extensions:String)=files.filter { entry ->
                extensions.any { entry.name.lowercase().endsWith(it) }
            }.joinToString("\n") { entry ->
                zip.getInputStream(entry).bufferedReader(Charsets.ISO_8859_1).use{it.readText()}
            }
            val definition=FighterDefinition.fromScript("KFM",load(".air"),load(".cns",".st"),load(".cmd"))
            val a=FightingCharacter(definition,1)
            val w=DeterministicFight(a,FightingCharacter(FighterDefinition("neutral"),2))
            a.changeState(191)
            w.step()
            val first=w.effects.all.single()
            assertEquals(191,first.animation.action.number)
            assertEquals(260*Fixed.ONE,first.x)
            assertEquals(-90*Fixed.ONE,first.y)
            assertEquals(Fixed.of(-4.2),first.velocityX)
            w.step()
            assertEquals(260*Fixed.ONE+Fixed.of(-4.2),first.x)
            assertEquals(-97*Fixed.ONE,first.y)
            val observed=mutableSetOf(191)
            repeat(180){w.step();w.effects.all.forEach{observed.add(it.animation.action.number)}}
            assertEquals(setOf(191,192),observed)
            assertTrue(w.effects.all.isEmpty(),"Both authored finite-lifetime wood effects must expire")
            assertTrue(w.issues.none{it.contains("Explod",true)},w.issues.joinToString())
            // Common F5 sound expressions are a separate, still-unimplemented audio path.
        }
    }

    @Test fun originalKfmLandingRegainsControlOnNegativeElementOffsetAndReturnsToNeutral() {
        val archive = listOf(File("public/kfm.zip"),File("../public/kfm.zip")).firstOrNull{it.isFile}
        assertNotNull(archive)
        ZipFile(archive).use { zip ->
            val files=zip.entries().asSequence().filter{!it.isDirectory}.toList()
            fun load(vararg extensions:String) = files.filter { entry ->
                extensions.any { entry.name.lowercase().endsWith(it) }
            }.joinToString("\n") { entry ->
                zip.getInputStream(entry).bufferedReader(Charsets.ISO_8859_1).use { it.readText() }
            }
            val definition=FighterDefinition.fromScript("KFM",load(".air"),load(".cns",".st"),load(".cmd"))
            val a=FightingCharacter(definition,1)
            val b=FightingCharacter(FighterDefinition("neutral"),2)
            val fight=DeterministicFight(a,b)
            a.changeState(1052)
            a.control=false
            val frames=definition.animations.getValue(1052).frames
            val controlTick=frames.take(2).sumOf { it.duration }-1
            val total=frames.sumOf { it.duration }
            assertTrue(frames.all{it.duration>0})
            repeat(total+1) { tick ->
                fight.step()
                assertEquals(tick >= controlTick,a.control,"KFM recovery at tick $tick")
            }
            assertEquals(0,a.stateNo,"Authored AnimTime=0 must leave landing state 1052")
            assertEquals(Fixed.of(-15.0),a.posX,"AnimElem=4 PosAdd should run once")
            assertTrue(fight.issues.isEmpty(),fight.issues.joinToString())
        }
    }

    @Test fun originalKfmCmdStateDefMinusOneEnablesMoveSelection() {
        val archive = listOf(File("public/kfm.zip"),File("../public/kfm.zip")).firstOrNull{it.isFile}
        assertNotNull(archive)
        ZipFile(archive).use { zip ->
            val files=zip.entries().asSequence().filter{!it.isDirectory}.toList()
            fun load(ext:String) = files.filter{it.name.lowercase().endsWith(ext)}
                .joinToString("\n") { entry ->
                    zip.getInputStream(entry).bufferedReader(Charsets.ISO_8859_1).use{it.readText()}
                }
            val cmd=load(".cmd")
            val cns=load(".cns")+ "\n"+load(".st")
            val air=load(".air")
            assertTrue(cmd.isNotBlank() && cns.isNotBlank() && air.isNotBlank())
            val merged=FighterDefinition.fromScript("KFM",air,cns,cmd)
            val controls=merged.states[-1]?.controllers.orEmpty()
            assertTrue(controls.isNotEmpty(),"Actual CMD StateDef -1 controllers must be loaded")
            assertTrue(merged.states.containsKey(200),"KFM authored attack StateDef 200 missing")
            val commands=MugenCommandParser.parseFile(cmd)
            assertTrue(commands.any{it.name.isNotBlank()})
            println("KFM CMD StateDef -1 loaded: "+controls.size+
                " controllers, "+commands.size+" command inputs")
        }
    }
}
