package moe.celery.kenjatime

import java.io.File
import java.nio.charset.Charset
import java.nio.charset.CodingErrorAction
import java.util.zip.ZipFile
import kotlin.test.*

/**
 * Optional tests against the USER-SUPPLIED originals. No sprites/audio or
 * proprietary character code is committed to the public repository.
 *
 * Set:
 * KENJATIME_RARE_AKUMA_2007_ZIP=/path/to/Rare_Akuma.zip
 * KENJATIME_RARE_AKUMA_2026_ZIP=/path/to/RareAkuma.zip
 * KENJATIME_DARK_DONALD_DIR=/path/to/unpacked/D-Donald
 * KENJATIME_REQUIRE_ORIGINALS=1 (forces missing inputs to fail, not skip).
 *
 * Parser validation/limited simulation are NOT full native capture parity.
 */
class OriginalCharacterArchiveRegressionTest {
    private val mandatory = System.getenv("KENJATIME_REQUIRE_ORIGINALS") == "1"
    private fun requiredLocation(key: String): File? {
        val location = System.getenv(key).orEmpty().trim()
        if (location.isEmpty()) {
            if (mandatory) fail("Original character archive required: $key")
            println("ORIGINAL CHARACTER NOT TESTED: missing $key")
            return null
        }
        val file = File(location)
        assertTrue(file.exists(), "Archive source does not exist: $key")
        return file
    }
    private fun source(bytes: ByteArray): String {
        // Legacy MUGEN characters often use CP932 / Windows ANSI. Decode without
        // replacing valid ASCII script keywords or interpreting binary resources.
        val utf8 = Charsets.UTF_8.newDecoder()
            .onMalformedInput(CodingErrorAction.REPORT)
            .onUnmappableCharacter(CodingErrorAction.REPORT)
        return try { utf8.decode(java.nio.ByteBuffer.wrap(bytes)).toString() }
        catch (_: java.nio.charset.CharacterCodingException) {
            String(bytes, Charset.forName("windows-31j"))
        }
    }
    private class Scripts(val names: List<String>, val load: (String) -> String) {
        private val files = names.associateBy { it.replace('\\','/').lowercase() }
        val defPath = names.singleOrNull { it.lowercase().endsWith(".def") }
            ?: error("Expected exactly one character DEF")
        private val base = defPath.substringBeforeLast('/','').let { if (it.isEmpty()) "" else "$it/" }
        val def = MugenDefParser.parse(load(defPath))
        val filesSection = def.section("Files") ?: error("Character DEF has no [Files]")
        fun getFile(key: String): String {
            val value = filesSection.get(key)?.trim()
                ?: error("Character lacks authored [Files] reference: $key")
            val path = files[(base + value).replace('\\','/').lowercase()]
                ?: error("Missing authored resource $key=$value")
            return load(path)
        }
        fun orderedStateFiles(): List<String> {
            val seen = mutableSetOf<String>()
            return filesSection.entries.filter { (key, _) ->
                key.equals("cns", true) || Regex("st\\d*").matches(key)
            }.mapNotNull { (_, value) ->
                val normalized = (base + value.trim()).replace('\\','/').lowercase()
                val path = files[normalized]
                    ?: error("Missing referenced CNS/ST state file: $normalized")
                if (seen.add(normalized)) load(path) else null
            }
        }
        fun zssRefs(): List<String> = filesSection.entries.filter { (key,value) ->
            (key.equals("cns",true) || Regex("st\\d*").matches(key))
                && value.lowercase().endsWith(".zss")
        }.map { it.second }
    }

    private fun zipScripts(file: File, block: (Scripts) -> Unit) {
        assertTrue(file.isFile && file.length() <= 256L * 1024 * 1024,
            "Unrecognized/oversized source archive")
        ZipFile(file).use { archive ->
            val entries = archive.entries().asSequence().filter { !it.isDirectory }.toList()
            assertTrue(entries.size in 1..5000, "Unsafe source archive entry count")
            val index = entries.associateBy { it.name.replace('\\','/').lowercase() }
            fun load(path: String): String {
                val e = index[path.replace('\\','/').lowercase()]
                    ?: error("Missing package entry: $path")
                assertTrue(e.size in 0..2_097_152, "State script exceeds 2 MiB")
                return archive.getInputStream(e).use { source(it.readBytes()) }
            }
            block(Scripts(entries.map { it.name }, ::load))
        }
    }

    private fun extractedScripts(directory: File, block: (Scripts) -> Unit) {
        assertTrue(directory.isDirectory, "Dark Donald source must be an extracted folder")
        val all = directory.walkTopDown().filter { it.isFile }.take(5001).toList()
        assertTrue(all.size in 1..5000, "Unexpected folder size")
        val names = all.map { it.relativeTo(directory).invariantSeparatorsPath }
        val index = all.associateBy { it.relativeTo(directory).invariantSeparatorsPath.lowercase() }
        fun load(path: String): String {
            val file = index[path.replace('\\','/').lowercase()]
                ?: error("Missing extracted file: $path")
            assertTrue(file.length() in 0..2_097_152, "State script exceeds 2 MiB")
            return source(file.readBytes())
        }
        block(Scripts(names, ::load))
    }

    @Test fun realRareAkuma2007LegacyScriptsParseAndReplay() {
        val file = requiredLocation("KENJATIME_RARE_AKUMA_2007_ZIP") ?: return
        zipScripts(file) { source ->
            assertTrue(source.def.section("Info")?.get("name")?.contains("Rare Akuma",true) == true)
            assertTrue(source.zssRefs().isEmpty())
            val states = source.orderedStateFiles()
            val cmd = source.getFile("cmd")
            val air = source.getFile("anim")
            val definition = FighterDefinition.fromScripts("Rare Akuma 2007", air, states, cmd)
            val commands = MugenCommandParser.parseFile(cmd)
            assertTrue(definition.states.size >= 130, "2007 Rare Akuma states absent")
            assertTrue(definition.states[-1]?.controllers?.isNotEmpty() == true)
            assertTrue(commands.size >= 140)
            assertTrue(definition.animations.size >= 300)
            fun replay(): String {
                val a = FightingCharacter(definition,1,commands)
                val b = FightingCharacter(definition,2,commands)
                a.posX = -80 * Fixed.ONE; b.posX = 80 * Fixed.ONE
                b.facingRight = false
                val fight = DeterministicFight(a,b)
                repeat(90) { tick ->
                    val press = if (tick % 12 == 0) setOf('a') else emptySet()
                    fight.step(InputFrame(Directions.R,press))
                }
                return fight.checksum()
            }
            assertEquals(replay(),replay(), "Legacy Rare Akuma replay changed across runs")
            println("RARE AKUMA 2007: real ZIP parsed and 90-tick deterministic script smoke passed; native parity NOT PROVEN")
        }
    }

    @Test fun realRareAkuma2026ZssIsExplicitlyRejectedByKotlin() {
        val file = requiredLocation("KENJATIME_RARE_AKUMA_2026_ZIP") ?: return
        zipScripts(file) { source ->
            assertTrue(source.zssRefs().size >= 6, "Expected original six ZSS state programs")
            val commandSource = source.getFile("cmd") // The CMD file has a .cns extension.
            val commands = MugenCommandParser.parseFile(commandSource)
            assertTrue(commands.size >= 160, "RareAkuma 2026 commands not parsed")
            val allZss = source.orderedStateFiles()
            assertFailsWith<IllegalArgumentException> {
                FighterDefinition.fromScripts("RareAkuma 2026",source.getFile("anim"),allZss,commandSource)
            }
            println("RARE AKUMA 2026: original ZIP and CMD parsed; Kotlin ZSS execution BLOCKED, NOT CERTIFIED")
        }
    }

    @Test fun realDarkDonaldLegacyIntroAndStateFilesLoadWithoutDuplicateRefs() {
        val directory = requiredLocation("KENJATIME_DARK_DONALD_DIR") ?: return
        extractedScripts(directory) { source ->
            val name=source.def.section("Info")?.get("displayname")
            assertTrue(name?.contains("Dark Donald",true) == true)
            val cns = source.orderedStateFiles()
            val cmd = source.getFile("cmd")
            assertEquals(6,cns.size, "Donald.cns listed multiple times; expected six unique state scripts")
            assertTrue(cns.any { it.contains("[Statedef 190]",true) }, "Original intro state missing")
            val definition = FighterDefinition.fromScripts("Dark Donald",source.getFile("anim"),cns,cmd)
            val commands = MugenCommandParser.parseFile(cmd)
            assertTrue(definition.states.size >= 270, "Dark Donald states missing")
            assertTrue(commands.size >= 110, "Dark Donald commands missing")
            assertTrue(definition.animations.size >= 280, "Dark Donald AIR actions missing")
            assertTrue(definition.states[-1]?.controllers?.isNotEmpty() == true)
            fun replay(): String {
                val a = FightingCharacter(definition,1,commands)
                val b = FightingCharacter(definition,2,commands)
                a.posX=-90*Fixed.ONE; b.posX=90*Fixed.ONE
                b.facingRight=false
                val fight=DeterministicFight(a,b)
                repeat(60) { tick ->
                    val buttons = if (tick%9==0) setOf('a') else emptySet()
                    fight.step(InputFrame(Directions.R,buttons))
                }
                return fight.checksum()
            }
            assertEquals(replay(),replay())
            println("DARK DONALD: original extracted RAR sources imported with intro/AI/OPTION and replayed; native combo/camera parity NOT PROVEN")
        }
    }
}
