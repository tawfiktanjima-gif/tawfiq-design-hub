import { notFound } from "next/navigation";
import ResourceForm from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/admin";
import type { Category, Resource } from "@/lib/types";
export default async function Page({ params }: { params: { id: string } }) {
  const { db } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/.test(params.id)) notFound();
  const [{ data: r }, { data: cats }] = await Promise.all([db.from("resources").select("*").eq("id", params.id).maybeSingle(), db.from("categories").select("*").order("sort_order")]);
  if (!r) notFound();
  return <div><h1 className="mb-4 text-2xl font-bold">রিসোর্স এডিট</h1><ResourceForm cats={(cats as Category[]) ?? []} r={r as Resource} /></div>;
}
