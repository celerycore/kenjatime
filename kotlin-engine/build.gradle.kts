plugins {
    kotlin("multiplatform") version "2.2.21"
}
kotlin {
    jvm()
    wasmJs {
        binaries.executable()
        nodejs()
        browser()
    }
    sourceSets {
        commonTest.dependencies { implementation(kotlin("test")) }
    }
}
