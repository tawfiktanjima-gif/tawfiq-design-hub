import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import RowActions from "@/components/admin/RowActions";
import { bn, fmtDate, fmtSize } from "@/lib/utils";
import { inp } from "@/components/admin/ui";
export default async function Page({ searchParams }: { searchParams: { q?: string } }) {
  const { db } = await requireAdmin(); const q = (searchParams.q ?? "").replace(/[%,()*\\"]/g, " ").trim().slice(0, 60);
  let s = db.from("resources").select("id,title,status,featured,download_count,file_type,file_size,created_at,categories(name)").order("created_at", { ascending: false }).limit(100);
  if (q) s = s.ilike("title", `%${q}%`);
  const { data } = await s;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-bold">রিসোর্স ম্যানেজমেন্ট</h1><Link href="/admin/resources/new" className="btn ml-auto">+ নতুন আপলোড</Link></div>
      <form className="flex gap-2"><input name="q" defaultValue={q} placeholder="নাম দিয়ে খুঁজুন" className={inp} /><button className="btn">খুঁজুন</button></form>
      {!data?.length ? <p className="card p-8 text-center opacity-80">কোনো রিসোর্স নেই।</p> : (
        <div className="card overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="text-sm opacity-70"><tr><th className="p-3">নাম</th><th>ক্যাটাগরি</th><th>ফরম্যাট</th><th>ডাউনলোড</th><th>স্ট্যাটাস</th><th>তারিখ</th><th>অ্যাকশন</th></tr></thead>
          <tbody>{data.map((r) => { const cat = r.categories as unknown as { name: string } | null; return (
            <tr key={r.id} className="border-t border-[#dbe7dc] align-top dark:border-[#244030]"><td className="p-3 font-semibold">{r.title}</td><td>{cat?.name ?? "—"}</td><td>{r.file_type?.toUpperCase()} {fmtSize(r.file_size)}</td><td>{bn(r.download_count)}</td><td>{r.status === "published" ? "প্রকাশিত" : "ড্রাফট"}</td><td>{fmtDate(r.created_at)}</td><td className="py-2 pr-3"><RowActions id={r.id} title={r.title} status={r.status} featured={r.featured} /></td></tr>); })}</tbody></table></div>)}
    </div>
  );
}
