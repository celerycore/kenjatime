package moe.celery.kenjatime

internal enum class ProjectileContactKind(val label: String) { HIT("hit"),GUARDED("guarded"),CANCEL("cancel") }
internal data class ProjectileContactRecord(val id: Int,val kind: ProjectileContactKind,val tick: Long)

/** Actor-owned records outlive a shot. Null query kind means hit OR guard.
 * Time triggers inspect the last overall event; legacy predicates can inspect
 * the most recent matching ID/kind even after another projectile contacts. */
internal class CoreProjectileHistory {
    companion object { const val LIMIT = 4096 }
    private data class Key(val id: Int,val kind: ProjectileContactKind)
    private val records=linkedMapOf<Key,ProjectileContactRecord>()
    private val byKind=mutableMapOf<ProjectileContactKind,ProjectileContactRecord>()
    private var last: ProjectileContactRecord? = null

    fun record(id: Int,kind: ProjectileContactKind,tick: Long,issues: MutableSet<String>) {
        val key=Key(id,kind)
        records.remove(key)
        if(records.size >= LIMIT) {
            val oldest=records.entries.first()
            // If the oldest entry is also the latest of its kind, that kind
            // has no other entries remaining in this recency-ordered map.
            if(byKind[oldest.value.kind] == oldest.value)byKind.remove(oldest.value.kind)
            records.remove(oldest.key)
            issues.add("Projectile history resource limit exceeded; oldest record discarded")
        }
        val entry=ProjectileContactRecord(id,kind,tick)
        records[key]=entry;byKind[kind]=entry;last=entry
    }
    private fun matches(record: ProjectileContactRecord,kind: ProjectileContactKind?,id: Int): Boolean =
        (id <= 0 || id == record.id) &&
            (if(kind == null)record.kind != ProjectileContactKind.CANCEL else record.kind == kind)
    private fun age(record: ProjectileContactRecord?,now: Long): Long =
        if(record == null || now < record.tick)-1L else now-record.tick
    fun time(kind: ProjectileContactKind?,id: Int,now: Long): Long =
        age(last?.takeIf { matches(it,kind,id) },now)
    fun latestAge(kind: ProjectileContactKind?,id: Int,now: Long): Long {
        fun find(k: ProjectileContactKind)=if(id <= 0)byKind[k] else records[Key(id,k)]
        val entry=if(kind != null)find(kind) else {
            val hit=find(ProjectileContactKind.HIT);val guard=find(ProjectileContactKind.GUARDED)
            if(hit == null)guard else if(guard == null || hit.tick >= guard.tick)hit else guard
        }
        return age(entry,now)
    }
    fun snapshot(): List<ProjectileContactRecord> = records.values.toList()
}
