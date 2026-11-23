import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { bn, fmtDate } from "@/lib/utils";
export default async function Dashboard() {
  const { db } = await requireAdmin();
  const [r, c, dl, latest, pop] = await Promise.all([
    db.from("resources").select("id", { count: "exact", head: true }), db.from("categories").select("id", { count: "exact", head: true }), db.from("resources").select("download_count"),
    db.from("resources").select("id,title,created_at,status").order("created_at", { ascending: false }).limit(5), db.from("resources").select("id,title,download_count").order("download_count", { ascending: false }).limit(5)]);
  const total = (dl.data ?? []).reduce((s, x) => s + (x.download_count ?? 0), 0);
  const stats = [["মোট রিসোর্স", r.count ?? 0], ["মোট ক্যাটাগরি", c.count ?? 0], ["মোট ডাউনলোড", total]];
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">ড্যাশবোর্ড</h1>
      <div className="grid gap-3 sm:grid-cols-3">{stats.map(([k, v]) => <div key={k} className="card p-5"><p className="opacity-70">{k}</p><p className="text-3xl font-bold">{bn(v)}</p></div>)}</div>
      <div className="grid gap-4 md:grid-cols-2">
        <section className="card p-4"><h2 className="mb-2 font-bold">সর্বশেষ আপলোড</h2>{latest.data?.length ? latest.data.map((x) => <Link key={x.id} href={`/admin/resources/${x.id}/edit`} className="flex justify-between py-1.5"><span className="truncate">{x.title}</span><small className="opacity-70">{fmtDate(x.created_at)}</small></Link>) : <p className="opacity-70">এখনো কিছু নেই</p>}</section>
        <section className="card p-4"><h2 className="mb-2 font-bold">জনপ্রিয় রিসোর্স</h2>{pop.data?.length ? pop.data.map((x) => <Link key={x.id} href={`/admin/resources/${x.id}/edit`} className="flex justify-between py-1.5"><span className="truncate">{x.title}</span><small>⬇ {bn(x.download_count)}</small></Link>) : <p className="opacity-70">এখনো কিছু নেই</p>}</section>
      </div>
      <Link href="/admin/resources/new" className="btn">+ নতুন রিসোর্স আপলোড</Link>
    </div>
  );
}
