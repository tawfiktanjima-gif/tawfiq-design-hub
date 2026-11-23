import Link from "next/link";
import type { Category } from "@/lib/types";
import { bn } from "@/lib/utils";
export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section id="categories" className="scroll-mt-20">
      <h2 className="mb-3 mt-8 border-l-[5px] border-emerald pl-2.5 text-2xl font-bold">রিসোর্স ক্যাটাগরি</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(135px,1fr))] gap-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/category/${c.slug}`} className="flex flex-col gap-0.5 rounded-2xl border border-[#dbe7dc] bg-emerald-soft p-3 text-center transition hover:-translate-y-1 hover:shadow-lg dark:border-[#244030] dark:bg-[#12301b]">
            <b className="text-3xl">{c.icon}</b><span className="font-semibold">{c.name}</span><small className="opacity-70">{bn(c.count ?? 0)} টি রিসোর্স</small>
          </Link>))}
      </div>
    </section>
  );
}
