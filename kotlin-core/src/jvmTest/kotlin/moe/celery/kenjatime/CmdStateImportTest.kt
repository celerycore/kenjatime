package moe.celery.kenjatime

import java.io.File
import java.util.zip.ZipFile
import kotlin.test.*

/** Uses real repository KFM CMD (including state -1), not a synthetic move list. */
class CmdStateImportTest {
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
