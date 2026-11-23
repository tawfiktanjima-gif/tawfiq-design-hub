import type { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabase/public";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const out: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 }, { url: `${base}/resources`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 }, { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 }];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const db = supabasePublic();
      const [c, r] = await Promise.all([db.from("categories").select("slug"), db.from("resources").select("slug,updated_at").eq("status", "published").order("updated_at", { ascending: false }).limit(5000)]);
      c.data?.forEach((x) => out.push({ url: `${base}/category/${encodeURIComponent(x.slug)}`, changeFrequency: "daily", priority: 0.7 }));
      r.data?.forEach((x) => out.push({ url: `${base}/resource/${encodeURIComponent(x.slug)}`, lastModified: x.updated_at, changeFrequency: "weekly", priority: 0.8 }));
    } catch { /* sitemap still lists static pages */ }
  }
  return out;
}
