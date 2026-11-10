plugins {
    kotlin("multiplatform") version "2.4.21"
}
kotlin {
    jvm()
    wasmJs {
        browser()
        nodejs() // Execute the same deterministic tests against real Wasm.
        binaries.executable()
        generateTypeScriptDefinitions()
    }
    sourceSets {
        commonTest.dependencies { implementation(kotlin("test")) }
    }
}
