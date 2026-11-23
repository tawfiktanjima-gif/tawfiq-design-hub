"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Resource } from "@/lib/types";
import { ACCEPT_FILE, validateFile } from "@/lib/files";
import { putSigned } from "@/lib/upload-client";
import { prepareUpload, saveResource } from "@/app/admin/actions";
import { fmtSize } from "@/lib/utils";
import { inp, lbl } from "./ui";
type Up = { file: File; kind: "file" | "preview"; role: "main" | "preview" | "gallery" };
export default function ResourceForm({ cats, r }: { cats: Category[]; r?: Resource }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [pct, setPct] = useState(0); const [err, setErr] = useState("");
  const [keep, setKeep] = useState<string[]>(r?.preview_images ?? []);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setErr(""); const f = new FormData(e.currentTarget);
    const main = f.get("file") as File, prev = f.get("preview") as File, gal = (f.getAll("gallery") as File[]).filter((x) => x.size);
    const ups: Up[] = []; if (main?.size) ups.push({ file: main, kind: "file", role: "main" }); if (prev?.size) ups.push({ file: prev, kind: "preview", role: "preview" }); gal.forEach((g) => ups.push({ file: g, kind: "preview", role: "gallery" }));
    if (!r && !main?.size) return setErr("মূল ফাইল নির্বাচন করুন");
    for (const u of ups) { const m = validateFile(u.file.name, u.file.type, u.file.size, u.kind); if (m) return setErr(m); }
    setBusy(true); setPct(0);
    try {
      let slots: { path: string; url: string }[] = [];
      if (ups.length) { const p = await prepareUpload(ups.map((u) => ({ name: u.file.name, type: u.file.type, size: u.file.size, kind: u.kind }))); if (p.error || !p.items) throw new Error(p.error); slots = p.items; }
      const total = ups.reduce((s, u) => s + u.file.size, 0) || 1, done = ups.map(() => 0);
      await Promise.all(ups.map((u, i) => putSigned(slots[i].url, u.file, (p) => { done[i] = p * u.file.size; setPct(Math.round((done.reduce((a, b) => a + b, 0) / total) * 100)); })));
      const at = (role: Up["role"]) => ups.findIndex((u) => u.role === role);
      const res = await saveResource({ id: r?.id, title: String(f.get("title")), description: String(f.get("description")), category_id: String(f.get("category_id")), tags: String(f.get("tags")), featured: f.get("featured") === "on", status: String(f.get("status")),
        file: at("main") >= 0 ? { path: slots[at("main")].path, name: main.name } : undefined, preview: at("preview") >= 0 ? { path: slots[at("preview")].path } : undefined, gallery: ups.flatMap((u, i) => (u.role === "gallery" ? [slots[i].path] : [])), keep });
      if (res.error) throw new Error(res.error);
      router.push("/admin/resources"); router.refresh();
    } catch (x) { setErr(x instanceof Error && x.message ? x.message : "আপলোড ব্যর্থ হয়েছে"); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="card max-w-3xl space-y-4 p-5">
      <div><label className={lbl} htmlFor="title">রিসোর্সের নাম *</label><input id="title" name="title" required maxLength={200} defaultValue={r?.title} className={inp} /></div>
      <div><label className={lbl} htmlFor="d">বিবরণ</label><textarea id="d" name="description" rows={4} defaultValue={r?.description ?? ""} className={inp} /></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className={lbl} htmlFor="c">ক্যাটাগরি</label><select id="c" name="category_id" defaultValue={r?.category_id ?? ""} className={inp}><option value="">— নির্বাচন করুন —</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div><label className={lbl} htmlFor="t">ট্যাগ (কমা দিয়ে আলাদা করুন)</label><input id="t" name="tags" defaultValue={r?.tags?.join(", ")} className={inp} /></div>
      </div>
      <div><label className={lbl} htmlFor="file">মূল ফাইল {r ? `(বর্তমান: ${r.file_name} ${fmtSize(r.file_size)} — বদলাতে নতুন ফাইল দিন)` : "*"}</label><input id="file" name="file" type="file" accept={ACCEPT_FILE} className={inp} /><small className="opacity-70">সর্বোচ্চ ৫০ MB। PNG, JPG, WEBP, SVG, PDF, ZIP, RAR, 7Z, TTF, OTF, WOFF, WOFF2, MP4, PSD, AI, EPS, APK</small></div>
      <div><label className={lbl} htmlFor="pv">প্রিভিউ ছবি {r?.preview_image && "(নতুন দিলে বদলে যাবে)"}</label><input id="pv" name="preview" type="file" accept=".png,.jpg,.jpeg,.webp" className={inp} /></div>
      <div><label className={lbl} htmlFor="g">অতিরিক্ত প্রিভিউ ছবি (একাধিক)</label><input id="g" name="gallery" type="file" multiple accept=".png,.jpg,.jpeg,.webp" className={inp} />
        {keep.length > 0 && <ul className="mt-2 space-y-1 text-sm">{keep.map((p) => <li key={p} className="flex items-center gap-2"><span className="truncate">{p.split("/").pop()}</span><button type="button" className="text-red-600" onClick={() => setKeep(keep.filter((x) => x !== p))}>সরান</button></li>)}</ul>}</div>
      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={r?.featured} /> বিশেষ রিসোর্স (Featured)</label>
        <select name="status" defaultValue={r?.status ?? "published"} aria-label="স্ট্যাটাস" className={`${inp} !w-auto`}><option value="published">প্রকাশিত (Publish)</option><option value="draft">ড্রাফট</option></select>
      </div>
      {busy && <div role="progressbar" aria-valuenow={pct} className="h-3 overflow-hidden rounded-full bg-emerald-soft"><div className="h-full bg-emerald transition-all" style={{ width: `${pct}%` }} /></div>}
      {err && <p role="alert" className="text-red-600">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? `আপলোড হচ্ছে… ${pct}%` : "সংরক্ষণ করুন"}</button>
    </form>
  );
}
