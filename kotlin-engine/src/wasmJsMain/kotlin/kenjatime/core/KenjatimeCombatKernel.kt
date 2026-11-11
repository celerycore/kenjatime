@file:OptIn(kotlin.js.ExperimentalJsExport::class)

package kenjatime.core

import kotlin.js.JsExport

/**
 * Stable primitive-only JS / Kotlin/Wasm ABI. No JS object graph crosses
 * into Kotlin. The host converts AIR boxes into bounding envelopes.
 *
 * The browser must feature-gate this adapter and retain the original
 * JavaScript path until identical per-frame traces have been verified.
 */
@JsExport
class KenjatimeCombatKernel(capacity: Int) {
    private val clash = ProjectileClashKernel(capacity)

    fun clear() = clash.clear()
    fun add(
        x0: Double, y0: Double, x1: Double, y1: Double,
        team: Int, frozen: Boolean, removing: Boolean
    ) = clash.add(x0, y0, x1, y1, team, frozen, removing)

    fun collect(inclusive: Boolean): Int = clash.collect(inclusive)
    fun left(pair: Int): Int = clash.left(pair)
    fun right(pair: Int): Int = clash.right(pair)
    fun examinedPairs(): Int = clash.examinedPairs
    fun envelopePairs(): Int = clash.envelopePairs

    fun phaseMask(
        root: Boolean, keyCtrl: Boolean, ownsState: Boolean,
        worldPaused: Boolean, initializing: Boolean, destroyed: Boolean
    ): Int = GlobalCombatSchedule.mask(
        root, keyCtrl, ownsState, worldPaused, initializing, destroyed
    )
}
