plugins {
    kotlin("multiplatform") version "2.4.21"
}
kotlin {
    jvm()
    wasmJs {
        browser()
        binaries.executable()
        generateTypeScriptDefinitions()
    }
    sourceSets {
        commonTest.dependencies { implementation(kotlin("test")) }
    }
}
