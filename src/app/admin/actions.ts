"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseServer, hasSupabase } from "@/lib/supabase/server";
import { getAdmin } from "@/lib/admin";
import { FILE_EXT, MAX_FILE, MAX_PREVIEW, PREVIEW_EXT, extOf, okPath, safeName, slugify, validateFile } from "@/lib/files";
import type { R, Resource, SaveInput } from "@/lib/types";

type Out = R & { items?: { bucket: string; path: string; url: string }[] };
async function guard(fn: (db: SupabaseClient) => Promise<Out>): Promise<Out> {
  const a = await getAdmin(); if (!a) return { error: "অনুমতি নেই। আবার লগইন করুন।" };
  try { const r = await fn(a.db); if (r.ok) revalidatePath("/", "layout"); return r; } catch { return { error: "অপ্রত্যাশিত সমস্যা হয়েছে, আবার চেষ্টা করুন।" }; }
}
const rm = async (db: SupabaseClient, list: { bucket: string; path: string | null | undefined }[]) => {
  for (const b of ["resource-files", "previews"]) { const p = list.filter((x) => x.bucket === b && x.path).map((x) => x.path!) ; if (p.length) await db.storage.from(b).remove(p); }
};

export async function login(email: string, password: string): Promise<R> {
  if (!hasSupabase()) return { error: "Supabase কনফিগার করা হয়নি" };
  const db = supabaseServer();
  const { data, error } = await db.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) return { error: error?.message ?? "Supabase login failed" };
  if (data.user.app_metadata?.role !== "admin") { await db.auth.signOut(); return { error: "এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই" }; }
  return { ok: true };
}
export async function logout() { await supabaseServer().auth.signOut(); redirect("/admin/login"); }

export async function prepareUpload(items: { name: string; type: string; size: number; kind: "file" | "preview" }[]): Promise<Out> {
  return guard(async (db) => {
    if (!items.length || items.length > 12) return { error: "অবৈধ অনুরোধ" };
    const dir = crypto.randomUUID(), out: NonNullable<Out["items"]> = [];
    for (const it of items) {
      const err = validateFile(it.name, it.type, it.size, it.kind); if (err) return { error: err };
      const bucket = it.kind === "file" ? "resource-files" : "previews", path = `${dir}/${Date.now()}-${safeName(it.name)}`;
      const { data, error } = await db.storage.from(bucket).createSignedUploadUrl(path);
      if (error || !data) return { error: "আপলোড প্রস্তুত করা যায়নি" };
      out.push({ bucket, path, url: data.signedUrl });
    }
    return { items: out };
  });
}
async function verify(db: SupabaseClient, bucket: string, path: string, kind: "file" | "preview"): Promise<number | string> {
  if (!okPath(path)) return "অবৈধ ফাইল পাথ";
  const ext = extOf(path); if (!(kind === "preview" ? PREVIEW_EXT.includes(ext) : !!FILE_EXT[ext])) return "অসমর্থিত ফাইল ফরম্যাট";
  const [dir, name] = path.split("/");
  const { data, error } = await db.storage.from(bucket).list(dir, { search: name });
  const f = data?.find((x) => x.name === name); if (error || !f) return "ফাইল আপলোড সম্পূর্ণ হয়নি";
  const size = Number((f.metadata as { size?: number } | null)?.size ?? 0);
  if (!size || size > (kind === "file" ? MAX_FILE : MAX_PREVIEW)) return "ফাইলের সাইজ সীমা অতিক্রম করেছে";
  return size;
}
export async function saveResource(i: SaveInput): Promise<R> {
  return guard(async (db) => {
    const title = i.title.trim(); if (!title || title.length > 200) return { error: "রিসোর্সের নাম দিন (সর্বোচ্চ ২০০ অক্ষর)" };
    if (!["draft", "published"].includes(i.status)) return { error: "অবৈধ স্ট্যাটাস" };
    let old: Resource | null = null;
    if (i.id) { const { data } = await db.from("resources").select("*").eq("id", i.id).maybeSingle(); if (!data) return { error: "রিসোর্স পাওয়া যায়নি" }; old = data as Resource; }
    const fresh: { bucket: string; path: string }[] = [], gone: { bucket: string; path: string | null | undefined }[] = [];
    const row: Record<string, unknown> = { title, description: i.description.trim() || null, category_id: i.category_id || null, featured: !!i.featured, status: i.status, tags: [...new Set(i.tags.split(/[,،]/).map((t) => t.trim()).filter(Boolean))].slice(0, 20), updated_at: new Date().toISOString() };
    const fail = async (error: string) => { await rm(db, fresh); return { error }; };
    if (i.file) {
      const v = await verify(db, "resource-files", i.file.path, "file"); fresh.push({ bucket: "resource-files", path: i.file.path }); if (typeof v === "string") return fail(v);
      Object.assign(row, { file_path: i.file.path, file_name: i.file.name.slice(0, 200), file_type: extOf(i.file.path), file_size: v }); if (old) gone.push({ bucket: "resource-files", path: old.file_path });
    } else if (!old) return { error: "মূল ফাইল আবশ্যক" };
    if (i.preview) {
      const v = await verify(db, "previews", i.preview.path, "preview"); fresh.push({ bucket: "previews", path: i.preview.path }); if (typeof v === "string") return fail(v);
      row.preview_image = i.preview.path; if (old?.preview_image) gone.push({ bucket: "previews", path: old.preview_image });
    }
    const keep = (old?.preview_images ?? []).filter((p) => i.keep.includes(p));
    for (const p of i.gallery) { const v = await verify(db, "previews", p, "preview"); fresh.push({ bucket: "previews", path: p }); if (typeof v === "string") return fail(v); }
    row.preview_images = [...keep, ...i.gallery];
    (old?.preview_images ?? []).filter((p) => !keep.includes(p)).forEach((p) => gone.push({ bucket: "previews", path: p }));
    if (old) { const { error } = await db.from("resources").update(row).eq("id", old.id); if (error) return fail("সংরক্ষণ করা যায়নি"); }
    else {
      const base = slugify(title) || "resource"; let ok = false;
      for (let a = 0; a < 5 && !ok; a++) { const { error } = await db.from("resources").insert({ ...row, slug: a ? `${base}-${Math.random().toString(36).slice(2, 6)}` : base }); if (!error) ok = true; else if (error.code !== "23505") return fail("সংরক্ষণ করা যায়নি"); }
      if (!ok) return fail("সংরক্ষণ করা যায়নি");
    }
    await rm(db, gone); return { ok: true };
  });
}
export async function deleteResource(id: string): Promise<R> {
  return guard(async (db) => {
    const { data } = await db.from("resources").select("*").eq("id", id).maybeSingle(); if (!data) return { error: "রিসোর্স পাওয়া যায়নি" };
    const r = data as Resource; const { error } = await db.from("resources").delete().eq("id", id); if (error) return { error: "মুছে ফেলা যায়নি" };
    await rm(db, [{ bucket: "resource-files", path: r.file_path }, { bucket: "previews", path: r.preview_image }, ...(r.preview_images ?? []).map((p) => ({ bucket: "previews", path: p }))]); return { ok: true };
  });
}
export async function toggleResource(id: string, field: "featured" | "status", value: boolean | string): Promise<R> {
  return guard(async (db) => {
    if (field === "status" && !["draft", "published"].includes(String(value))) return { error: "অবৈধ মান" };
    const { error } = await db.from("resources").update({ [field]: value, updated_at: new Date().toISOString() }).eq("id", id); return error ? { error: "আপডেট করা যায়নি" } : { ok: true };
  });
}

type Cat = { id?: string; name: string; slug: string; icon: string; description: string };
export async function saveCategory(c: Cat): Promise<R> {
  return guard(async (db) => {
    const name = c.name.trim(); if (!name || name.length > 80) return { error: "ক্যাটাগরির নাম দিন" };
    const slug = slugify(c.slug || name); if (!slug) return { error: "বৈধ slug দিন (ইংরেজি বা বাংলা অক্ষর)" };
    const row = { name, slug, icon: c.icon.trim().slice(0, 8) || null, description: c.description.trim() || null };
    if (c.id) { const { error } = await db.from("categories").update(row).eq("id", c.id); return error ? { error: error.code === "23505" ? "এই slug আগে থেকেই আছে" : "সংরক্ষণ করা যায়নি" } : { ok: true }; }
    const { data: last } = await db.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
    const { error } = await db.from("categories").insert({ ...row, sort_order: (last?.[0]?.sort_order ?? 0) + 1 });
    return error ? { error: error.code === "23505" ? "এই slug আগে থেকেই আছে" : "সংরক্ষণ করা যায়নি" } : { ok: true };
  });
}
export async function deleteCategory(id: string): Promise<R> {
  return guard(async (db) => { const { error } = await db.from("categories").delete().eq("id", id); return error ? { error: "মুছে ফেলা যায়নি" } : { ok: true }; });
}
export async function moveCategory(id: string, dir: -1 | 1): Promise<R> {
  return guard(async (db) => {
    const { data } = await db.from("categories").select("id").order("sort_order").order("created_at"); const ids = (data ?? []).map((x) => x.id as string);
    const i = ids.indexOf(id), j = i + dir; if (i < 0 || j < 0 || j >= ids.length) return { ok: true };
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const res = await Promise.all(ids.map((x, k) => db.from("categories").update({ sort_order: k + 1 }).eq("id", x)));
    return res.some((r) => r.error) ? { error: "ক্রম পরিবর্তন করা যায়নি" } : { ok: true };
  });
}
export async function saveSettings(s: Record<string, string>): Promise<R> {
  return guard(async (db) => {
    const phone = /^[0-9+\-\s]{6,20}$/; if (!phone.test(s.mobile_number ?? "") || !phone.test(s.whatsapp_number ?? "")) return { error: "সঠিক ফোন নম্বর দিন" };
    const fb = (s.facebook_url ?? "").trim(); if (fb && !/^https:\/\//.test(fb)) return { error: "Facebook লিংক https:// দিয়ে শুরু হতে হবে" };
    const pi = (s.profile_image ?? "").trim(); if (pi && !/^(https:\/\/|\/)/.test(pi)) return { error: "ছবির লিংক অবৈধ" };
    const t = (k: string, n = 500) => (s[k] ?? "").trim().slice(0, n) || null;
    const { error } = await db.from("site_settings").update({ site_name: t("site_name", 80) ?? "Tawfiq Design Hub", site_description: t("site_description"), owner_name: t("owner_name", 80) ?? "", owner_title: t("owner_title", 120) ?? "", mobile_number: s.mobile_number.trim(), whatsapp_number: s.whatsapp_number.trim(), facebook_url: fb || null, profile_image: pi || null, about_text: t("about_text", 2000), updated_at: new Date().toISOString() }).eq("id", 1);
    return error ? { error: "সংরক্ষণ করা যায়নি" } : { ok: true };
  });
}
