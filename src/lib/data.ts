import { supabaseServer, hasSupabase } from "./supabase/server";
import { DEFAULT_CATEGORIES, DEFAULT_SETTINGS } from "./defaults";
import type { Category, Resource, SiteSettings } from "./types";
export async function getSettings(): Promise<SiteSettings> {
  if (!hasSupabase()) return DEFAULT_SETTINGS;
  const { data } = await supabaseServer().from("site_settings").select("*").eq("id", 1).maybeSingle();
  return { ...DEFAULT_SETTINGS, ...Object.fromEntries(Object.entries(data ?? {}).filter(([, v]) => v != null)) };
}
export async function getCategories(): Promise<Category[]> {
  if (!hasSupabase()) return DEFAULT_CATEGORIES;
  const db = supabaseServer();
  const [{ data: cats }, { data: res }] = await Promise.all([db.from("categories").select("*").order("sort_order"), db.from("resources").select("category_id").eq("status", "published")]);
  if (!cats?.length) return DEFAULT_CATEGORIES;
  return cats.map((c) => ({ ...c, count: res?.filter((r) => r.category_id === c.id).length ?? 0 }));
}
export type ListOpts = { sort?: "new" | "popular"; featured?: boolean; limit?: number };
export async function getResources({ sort = "new", featured, limit = 4 }: ListOpts = {}): Promise<Resource[]> {
  if (!hasSupabase()) return [];
  let q = supabaseServer().from("resources").select("*, categories(name,slug)").eq("status", "published");
  if (featured) q = q.eq("featured", true);
  q = sort === "popular" ? q.order("download_count", { ascending: false }) : q.order("created_at", { ascending: false });
  const { data } = await q.limit(limit);
  return (data as Resource[]) ?? [];
}

/* ---------- Step 2: listing, category, details ---------- */
export const PER_PAGE = 12;
export type Query = { q?: string; category?: string; type?: string; sort?: "new" | "popular"; featured?: boolean; page?: number };
type SP = Record<string, string | string[] | undefined>;
const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);
export function parseQuery(sp: SP): Query {
  const page = Math.max(1, parseInt(one(sp.page) ?? "1", 10) || 1);
  return { q: one(sp.q)?.replace(/[%,()*\\"]/g, " ").trim().slice(0, 60) || undefined, category: one(sp.category) || undefined, type: one(sp.type)?.replace(/[^a-z0-9]/gi, "").toLowerCase() || undefined, sort: one(sp.sort) === "popular" ? "popular" : "new", featured: one(sp.featured) === "1", page };
}
export async function searchResources(o: Query) {
  if (!hasSupabase()) return { items: [] as Resource[], total: 0, pages: 0 };
  const db = supabaseServer();
  let q = db.from("resources").select("*, categories(name,slug)", { count: "exact" }).eq("status", "published");
  if (o.category) { const { data: c } = await db.from("categories").select("id").eq("slug", o.category).maybeSingle(); if (!c) return { items: [], total: 0, pages: 0 }; q = q.eq("category_id", c.id); }
  if (o.type) q = q.ilike("file_type", o.type);
  if (o.featured) q = q.eq("featured", true);
  if (o.q) {
    const { data: cs } = await db.from("categories").select("id").ilike("name", `%${o.q}%`);
    const ids = (cs ?? []).map((c) => c.id);
    q = q.or([`title.ilike.%${o.q}%`, `description.ilike.%${o.q}%`, `tags.cs.{${o.q}}`, ...(ids.length ? [`category_id.in.(${ids.join(",")})`] : [])].join(","));
  }
  q = o.sort === "popular" ? q.order("download_count", { ascending: false }) : q.order("created_at", { ascending: false });
  const from = ((o.page ?? 1) - 1) * PER_PAGE;
  const { data, count, error } = await q.range(from, from + PER_PAGE - 1);
  if (error) throw new Error(error.message);
  return { items: (data as Resource[]) ?? [], total: count ?? 0, pages: Math.ceil((count ?? 0) / PER_PAGE) };
}
export async function getFileTypes(): Promise<string[]> {
  if (!hasSupabase()) return [];
  const { data } = await supabaseServer().from("resources").select("file_type").eq("status", "published");
  return [...new Set((data ?? []).map((r) => r.file_type?.toLowerCase()).filter(Boolean))].sort() as string[];
}
const dec = (s: string) => { try { return decodeURIComponent(s); } catch { return s; } };
export async function getCategoryBySlug(slug: string) { const s = dec(slug); return (await getCategories()).find((c) => c.slug === s) ?? null; }
export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  if (!hasSupabase()) return null;
  const { data } = await supabaseServer().from("resources").select("*, categories(name,slug)").eq("slug", dec(slug)).eq("status", "published").maybeSingle();
  return (data as Resource) ?? null;
}
export async function getRelated(r: Resource, limit = 4): Promise<Resource[]> {
  let q = supabaseServer().from("resources").select("*, categories(name,slug)").eq("status", "published").neq("id", r.id);
  if (r.category_id) q = q.eq("category_id", r.category_id);
  const { data } = await q.order("download_count", { ascending: false }).limit(limit);
  return (data as Resource[]) ?? [];
}
