import CategoryManager from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";
export default async function Page() {
  const { db } = await requireAdmin();
  const [{ data: cats }, { data: res }] = await Promise.all([db.from("categories").select("*").order("sort_order").order("created_at"), db.from("resources").select("category_id")]);
  const list = ((cats as Category[]) ?? []).map((c) => ({ ...c, count: res?.filter((x) => x.category_id === c.id).length ?? 0 }));
  return <div><h1 className="mb-4 text-2xl font-bold">ক্যাটাগরি ম্যানেজমেন্ট</h1><CategoryManager cats={list} /></div>;
}
