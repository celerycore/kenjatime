package moe.celery.kenjatime

/** Camera is visual only and cannot modify deterministic simulation state. */
data class CameraConfig(
    val left: Double = -1000.0, val right: Double = 1000.0,
    val top: Double = -600.0, val bottom: Double = 0.0,
    val minZoom: Double = 0.75, val maxZoom: Double = 1.0,
    val width: Int = 1280, val height: Int = 720, val tension: Double = 150.0
)
class MugenCamera(val config: CameraConfig = CameraConfig()) {
    var x: Double = 0.0
        private set
    var y: Double = 0.0
        private set
    var zoom: Double = 1.0
        private set
    fun update(p1: FightingCharacter, p2: FightingCharacter) {
        val a = Fixed.pixels(p1.posX); val b = Fixed.pixels(p2.posX)
        val c = Fixed.pixels(p1.posY); val d = Fixed.pixels(p2.posY)
        val zx = config.width / (kotlin.math.abs(a - b) + config.tension * 2.0)
        val zy = config.height / (kotlin.math.abs(c - d) + 300.0)
        val min = minOf(config.minZoom, config.maxZoom)
        val max = maxOf(config.minZoom, config.maxZoom)
        zoom += (minOf(zx, zy).coerceIn(min, max) - zoom) * 0.1
        val hw = config.width / (2.0 * zoom)
        val hh = config.height / (2.0 * zoom)
        fun clampTarget(v: Double, lo: Double, hi: Double, half: Double): Double =
            if (hi - lo < 2.0 * half) (lo + hi) / 2.0 else v.coerceIn(lo + half, hi - half)
        x += (clampTarget((a + b) / 2.0, config.left, config.right, hw) - x) * 0.15
        y += (clampTarget((c + d) / 2.0, config.top, config.bottom, hh) - y) * 0.15
    }
    fun worldToScreen(worldX: Double, worldY: Double): Pair<Double, Double> =
        Pair(config.width / 2.0 + (worldX - x) * zoom, config.height / 2.0 + (worldY - y) * zoom)
}
