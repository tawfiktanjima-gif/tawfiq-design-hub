import type { Query } from "@/lib/data";
import type { Category as C } from "@/lib/types";
const sel = "rounded-xl border border-[#cfe0d1] bg-white px-3 py-2 dark:border-[#244030] dark:bg-[#132017]";
export default function ResourceFilters({ action, q, cats, types }: { action: string; q: Query; cats?: C[]; types: string[] }) {
  return (
    <form action={action} role="search" className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
      <input name="q" defaultValue={q.q} aria-label="অনুসন্ধান" placeholder="রিসোর্সের নাম, বিবরণ বা ট্যাগ লিখুন..." className={sel} />
      {cats && <select name="category" defaultValue={q.category ?? ""} aria-label="ক্যাটাগরি" className={sel}><option value="">সব ক্যাটাগরি</option>{cats.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>}
      <select name="type" defaultValue={q.type ?? ""} aria-label="ফাইল টাইপ" className={sel}><option value="">সব ফাইল টাইপ</option>{types.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
      <select name="sort" defaultValue={q.sort} aria-label="সাজান" className={sel}><option value="new">নতুন আগে</option><option value="popular">জনপ্রিয় আগে</option></select>
      <div className="flex gap-2"><button className="btn">খুঁজুন</button><a href={action} className="rounded-full border border-current px-4 py-2">মুছুন</a></div>
    </form>
  );
}
