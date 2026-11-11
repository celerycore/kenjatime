plugins {
    kotlin("multiplatform") version "2.2.21"
}
kotlin {
    jvm()
    wasmJs {
        nodejs()
        browser()
    }
    sourceSets {
        commonTest.dependencies { implementation(kotlin("test")) }
    }
}
