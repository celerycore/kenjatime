@file:OptIn(kotlin.js.ExperimentalJsExport::class)

package kenjatime.core

import kotlin.js.JsExport

/**
 * Kotlin/Wasm currently exports top-level functions, not classes.
 *
 * The host sees a small integer handle, never an object graph or Kotlin
 * collection. Every active kernel must be destroyed by its JS owner.
 */
private val activeKernels = mutableMapOf<Int, ProjectileClashKernel>()
private var nextKernel = 1

private fun find(handle: Int): ProjectileClashKernel =
    activeKernels[handle] ?: error("Unknown or closed combat kernel handle")

@JsExport
fun createCombatKernel(capacity: Int): Int {
    require(activeKernels.size < 128) { "Too many active combat kernels" }
    val handle = nextKernel++
    activeKernels[handle] = ProjectileClashKernel(capacity)
    return handle
}
@JsExport
fun destroyCombatKernel(handle: Int): Boolean = activeKernels.remove(handle) != null

@JsExport
fun resetCombatKernel(handle: Int) = find(handle).clear()

@JsExport
fun addCombatProjectile(
    handle: Int, x0: Double, y0: Double, x1: Double, y1: Double,
    team: Int, frozen: Boolean, removing: Boolean
) = find(handle).add(x0, y0, x1, y1, team, frozen, removing)

@JsExport
fun collectCombatPairs(handle: Int, inclusive: Boolean): Int =
    find(handle).collect(inclusive)

@JsExport
fun combatPairLeft(handle: Int, index: Int): Int = find(handle).left(index)

@JsExport
fun combatPairRight(handle: Int, index: Int): Int = find(handle).right(index)

@JsExport
fun combatExaminedPairs(handle: Int): Int = find(handle).examinedPairs

@JsExport
fun combatPhaseMask(
    root: Boolean, keyCtrl: Boolean, ownsState: Boolean,
    worldPaused: Boolean, initializing: Boolean, destroyed: Boolean
): Int = GlobalCombatSchedule.mask(
    root, keyCtrl, ownsState, worldPaused, initializing, destroyed
)
