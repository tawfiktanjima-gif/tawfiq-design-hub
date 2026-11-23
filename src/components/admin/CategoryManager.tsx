"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { deleteCategory, moveCategory, saveCategory } from "@/app/admin/actions";
import { bn } from "@/lib/utils";
import { inp } from "./ui";
const empty = { id: undefined as string | undefined, name: "", slug: "", icon: "", description: "" };
export default function CategoryManager({ cats }: { cats: Category[] }) {
  const r = useRouter(); const [p, start] = useTransition(); const [f, setF] = useState(empty); const [err, setErr] = useState("");
  const run = (fn: () => Promise<{ error?: string }>, after?: () => void) => start(async () => { const x = await fn(); if (x.error) setErr(x.error); else { setErr(""); after?.(); r.refresh(); } });
  const b = "rounded-full border border-current px-2.5 py-1 text-sm disabled:opacity-50";
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
      <form className="card space-y-3 self-start p-4" onSubmit={(e) => { e.preventDefault(); run(() => saveCategory(f), () => setF(empty)); }}>
        <h2 className="font-bold">{f.id ? "ক্যাটাগরি এডিট" : "নতুন ক্যাটাগরি"}</h2>
        <input aria-label="নাম" placeholder="নাম *" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} />
        <input aria-label="Slug" placeholder="slug (ফাঁকা রাখলে নাম থেকে হবে)" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className={inp} />
        <input aria-label="আইকন" placeholder="আইকন (ইমোজি, যেমন 🕌)" maxLength={8} value={f.icon} onChange={(e) => setF({ ...f, icon: e.target.value })} className={inp} />
        <textarea aria-label="বিবরণ" placeholder="বিবরণ" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={inp} />
        {err && <p role="alert" className="text-red-600">{err}</p>}
        <div className="flex gap-2"><button className="btn" disabled={p}>সংরক্ষণ</button>{f.id && <button type="button" className={b} onClick={() => setF(empty)}>বাতিল</button>}</div>
      </form>
      <div className="card divide-y divide-[#dbe7dc] dark:divide-[#244030]">
        {cats.map((c, i) => (
          <div key={c.id} className="flex flex-wrap items-center gap-2 p-3">
            <span className="text-2xl">{c.icon}</span><div className="min-w-0 flex-1"><b>{c.name}</b> <small className="opacity-70">/{c.slug} • {bn(c.count ?? 0)} টি রিসোর্স</small></div>
            <button className={b} disabled={p || i === 0} aria-label="উপরে" onClick={() => run(() => moveCategory(c.id, -1))}>↑</button>
            <button className={b} disabled={p || i === cats.length - 1} aria-label="নিচে" onClick={() => run(() => moveCategory(c.id, 1))}>↓</button>
            <button className={b} onClick={() => setF({ id: c.id, name: c.name, slug: c.slug, icon: c.icon ?? "", description: c.description ?? "" })}>এডিট</button>
            <button className={`${b} text-red-600`} disabled={p} onClick={() => { if (confirm(`সতর্কতা: “${c.name}” মুছে ফেললে এর ${bn(c.count ?? 0)} টি রিসোর্স “ক্যাটাগরি ছাড়া” হয়ে যাবে (রিসোর্স মুছবে না)। চালিয়ে যাবেন?`)) run(() => deleteCategory(c.id)); }}>ডিলিট</button>
          </div>))}
        {!cats.length && <p className="p-6 text-center opacity-70">এখনো কোনো ক্যাটাগরি নেই। seed.sql চালান অথবা বামে নতুন যোগ করুন।</p>}
      </div>
    </div>
  );
}
