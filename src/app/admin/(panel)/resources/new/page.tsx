import ResourceForm from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";
export default async function Page() {
  const { db } = await requireAdmin(); const { data } = await db.from("categories").select("*").order("sort_order");
  return <div><h1 className="mb-4 text-2xl font-bold">নতুন রিসোর্স আপলোড</h1><ResourceForm cats={(data as Category[]) ?? []} /></div>;
}
