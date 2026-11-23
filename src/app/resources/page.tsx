import type { Metadata } from "next";
import ResourceFilters from "@/components/ResourceFilters";
import ResourceList from "@/components/ResourceList";
import Pagination from "@/components/Pagination";
import { getCategories, getFileTypes, parseQuery, searchResources } from "@/lib/data";
export async function generateMetadata({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }): Promise<Metadata> {
  const filtered = Object.keys(searchParams).length > 0; // filtered/paged/search URLs are not indexed; /resources itself is
  return { title: "সব রিসোর্স", description: "PNG, ফন্ট, ব্যাকগ্রাউন্ড, টেমপ্লেটসহ সব ডিজাইন রিসোর্স খুঁজুন ও ডাউনলোড করুন।", alternates: { canonical: "/resources" }, robots: filtered ? { index: false, follow: true } : undefined };
}
export default async function ResourcesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const q = parseQuery(searchParams);
  const [{ items, total, pages }, cats, types] = await Promise.all([searchResources(q), getCategories(), getFileTypes()]);
  const filtered = !!(q.q || q.category || q.type || q.featured);
  return (
    <div className="wrap py-8">
      <h1 className="mb-4 border-l-[5px] border-emerald pl-2.5 text-3xl font-bold">{q.featured ? "বিশেষ রিসোর্স" : q.q ? `“${q.q}” এর ফলাফল` : "সব রিসোর্স"}</h1>
      <ResourceFilters action="/resources" q={q} cats={cats} types={types} />
      <ResourceList items={items} total={total} filtered={filtered} />
      <Pagination base="/resources" page={q.page ?? 1} pages={pages} params={{ q: q.q, category: q.category, type: q.type, sort: q.sort === "popular" ? "popular" : undefined, featured: q.featured ? "1" : undefined }} />
    </div>
  );
}
