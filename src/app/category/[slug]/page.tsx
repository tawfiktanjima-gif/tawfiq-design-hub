import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ResourceFilters from "@/components/ResourceFilters";
import ResourceList from "@/components/ResourceList";
import Pagination from "@/components/Pagination";
import { getCategoryBySlug, getFileTypes, parseQuery, searchResources } from "@/lib/data";
type P = { params: { slug: string }; searchParams: Record<string, string | string[] | undefined> };
export async function generateMetadata({ params, searchParams }: P): Promise<Metadata> {
  const c = await getCategoryBySlug(params.slug); if (!c) return {};
  return { title: c.name, description: c.description || `${c.name} ক্যাটাগরির সব ডিজাইন রিসোর্স`, alternates: { canonical: `/category/${c.slug}` }, openGraph: { title: c.name, type: "website" }, robots: Object.keys(searchParams).length ? { index: false, follow: true } : undefined };
}
export default async function CategoryPage({ params, searchParams }: P) {
  const c = await getCategoryBySlug(params.slug); if (!c) notFound();
  const q = { ...parseQuery(searchParams), category: c.slug };
  const [{ items, total, pages }, types] = await Promise.all([searchResources(q), getFileTypes()]);
  return (
    <div className="wrap py-8">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-2 text-sm opacity-70"><Link href="/">হোম</Link> / <Link href="/resources">রিসোর্স</Link> / {c.name}</nav>
      <h1 className="mb-1 text-3xl font-bold">{c.icon} {c.name}</h1>{c.description && <p className="mb-4 opacity-80">{c.description}</p>}
      <div className="mt-4"><ResourceFilters action={`/category/${c.slug}`} q={q} types={types} /></div>
      <ResourceList items={items} total={total} filtered={!!(q.q || q.type)} />
      <Pagination base={`/category/${c.slug}`} page={q.page ?? 1} pages={pages} params={{ q: q.q, type: q.type, sort: q.sort === "popular" ? "popular" : undefined }} />
    </div>
  );
}
