package moe.celery.kenjatime

import java.io.File
import java.util.zip.ZipFile
import kotlin.test.Test
import kotlin.test.assertTrue
import kotlin.test.assertNotNull

/**
 * Tests against REAL bundled KFM data, not a synthetic KFM lookalike.
 * This is a parser/simulation smoke gate, not 147-case native replay parity.
 */
class CharacterArchiveSmokeTest {
    @Test fun kfmParsersConsumeBundledCharacterAndReplayDeterministically() {
        val zip = listOf(File("public/kfm.zip"), File("../public/kfm.zip")).firstOrNull { it.isFile }
        assertNotNull(zip, "Kenjatime bundled public/kfm.zip must exist")
        ZipFile(zip).use { archive ->
            val entries = archive.entries().asSequence().filter { !it.isDirectory }.toList()
            fun contents(extension: String): List<String> = entries
                .filter { it.name.lowercase().endsWith(extension) }
                .map { e -> archive.getInputStream(e).bufferedReader(Charsets.ISO_8859_1).use { it.readText() } }
            val cmds = contents(".cmd")
            val airs = contents(".air")
            val states = contents(".cns") + contents(".st")
            val defs = contents(".def")
            assertTrue(cmds.isNotEmpty(), "KFM CMD missing")
            assertTrue(airs.isNotEmpty(), "KFM AIR missing")
            assertTrue(states.isNotEmpty(), "KFM state files missing")
            assertTrue(defs.isNotEmpty(), "KFM DEF missing")
            val commands = cmds.flatMap { MugenCommandParser.parseFile(it) }
            val animations = airs.flatMap { MugenAirParser.parse(it).values }
            val programs = states.flatMap { MugenCnsParser.parse(it).values }
            assertTrue(commands.isNotEmpty(), "No KFM commands parsed")
            assertTrue(animations.isNotEmpty(), "No KFM AIR actions parsed")
            assertTrue(programs.isNotEmpty(), "No KFM states parsed")
            assertTrue(defs.any { MugenDefParser.parse(it).section("Info") != null }, "KFM Info missing")
            val def = FighterDefinition("real-KFM", animations.associateBy { it.number },
                programs.associateBy { it.number })
            fun replay(): String {
                val a = FightingCharacter(def, 1, commands)
                val b = FightingCharacter(def, 2, commands)
                a.posX = -40 * Fixed.ONE
                b.posX = 40 * Fixed.ONE
                b.facingRight = false
                val w = DeterministicFight(a,b)
                repeat(360) { tick ->
                    val left = if (tick % 8 == 0) Directions.D else if (tick % 8 == 1) Directions.DF else Directions.R
                    w.step(InputFrame(left, if (tick % 8 == 2) setOf('a') else emptySet()))
                }
                return w.checksum()
            }
            assertTrue(replay() == replay())
            println("KFM Kotlin smoke: " + commands.size + " commands, " +
                animations.size + " AIR actions, " + programs.size +
                " CNS/ST definitions. Native scenario parity: NOT RUN.")
        }
    }

    /** Supply extracted source directories; RAR/7z decoding stays in the browser import adapter. */
    @Test fun optionalCharacterSourceDirectories() {
        val targets = listOf(
            "DARK_DONALD" to "KENJATIME_DARK_DONALD_DIR",
            "RARE_AKUMA" to "KENJATIME_RARE_AKUMA_DIR"
        )
        for ((name, env) in targets) {
            val location = System.getenv(env)
            if (location.isNullOrBlank()) {
                println(name + " Kotlin original archive smoke: NOT RUN (" + env + " missing)")
                continue
            }
            val root = File(location)
            assertTrue(root.isDirectory, env + " must be a directory of extracted source files")
            val scripts = root.walkTopDown().filter { it.isFile && it.length() < 16_777_216L }.toList()
            val states = scripts.filter { it.extension.lowercase() in setOf("cns", "st") }
            val cmds = scripts.filter { it.extension.equals("cmd", true) }
            val airs = scripts.filter { it.extension.equals("air", true) }
            assertTrue(states.isNotEmpty() && cmds.isNotEmpty() && airs.isNotEmpty(),
                name + " must have state, CMD and AIR scripts")
            var stateCount = 0
            var commandCount = 0
            var animationCount = 0
            for (script in states) stateCount += MugenCnsParser.parse(script.readText(Charsets.ISO_8859_1)).size
            for (script in cmds) commandCount += MugenCommandParser.parseFile(script.readText(Charsets.ISO_8859_1)).size
            for (script in airs) animationCount += MugenAirParser.parse(script.readText(Charsets.ISO_8859_1)).size
            assertTrue(stateCount > 0 && commandCount > 0 && animationCount > 0)
            println(name + " Kotlin actual source smoke: " + stateCount + " states, " +
                commandCount + " commands, " + animationCount + " AIR actions. Native parity: NOT RUN.")
        }
    }
}
