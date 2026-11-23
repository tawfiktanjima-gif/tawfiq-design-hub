import type { Resource } from "@/lib/types";
import ResourceCard from "./ResourceCard";
import { bn } from "@/lib/utils";
export default function ResourceList({ items, total, filtered }: { items: Resource[]; total: number; filtered: boolean }) {
  if (!items.length) return (
    <div className="card p-10 text-center"><p className="text-xl font-semibold">{filtered ? "কোনো রিসোর্স পাওয়া যায়নি" : "এখনো কোনো রিসোর্স আপলোড করা হয়নি"}</p><p className="mt-1 opacity-70">{filtered ? "অন্য শব্দ বা ফিল্টার দিয়ে চেষ্টা করুন।" : "শীঘ্রই নতুন রিসোর্স যোগ করা হবে।"}</p></div>);
  return (<><p className="mb-3 opacity-70">মোট {bn(total)} টি রিসোর্স</p><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map((r) => <ResourceCard key={r.id} r={r} />)}</div></>);
}
