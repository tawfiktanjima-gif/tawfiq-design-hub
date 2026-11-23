import Link from "next/link";
import type { Resource } from "@/lib/types";
import ResourceCard from "./ResourceCard";
export default function ResourceSection({ title, href, items }: { title: string; href: string; items: Resource[] }) {
  return (
    <section className="card p-4">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-bold">{title}</h2><Link href={href} className="font-semibold text-emerald dark:text-green-400">সব দেখুন →</Link></div>
      {items.length ? <div className="grid gap-3">{items.map((r) => <ResourceCard key={r.id} r={r} />)}</div>
        : <p className="rounded-xl bg-emerald-soft p-4 text-center opacity-80 dark:bg-[#12301b]">এখনো কোনো রিসোর্স আপলোড করা হয়নি।</p>}
    </section>
  );
}
