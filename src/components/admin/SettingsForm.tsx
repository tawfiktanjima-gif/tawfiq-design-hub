"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "@/app/admin/actions";
import { inp, lbl } from "./ui";
const fields: [keyof SiteSettings, string, boolean?][] = [["site_name", "ওয়েবসাইটের নাম"], ["site_description", "ওয়েবসাইটের বিবরণ"], ["owner_name", "আপনার নাম"], ["owner_title", "পেশা"], ["mobile_number", "মোবাইল নম্বর"], ["whatsapp_number", "WhatsApp নম্বর"], ["facebook_url", "Facebook লিংক (https://...)"], ["profile_image", "প্রোফাইল ছবির লিংক (ফাঁকা রাখলে ডিফল্ট ছবি)"], ["about_text", "আমার পরিচিতি", true]];
export default function SettingsForm({ s }: { s: SiteSettings }) {
  const r = useRouter(); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  return (
    <form className="card max-w-2xl space-y-4 p-5" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setMsg(""); setErr(""); const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>; const x = await saveSettings(f); setBusy(false); if (x.error) setErr(x.error); else { setMsg("সংরক্ষিত হয়েছে"); r.refresh(); } }}>
      {fields.map(([k, t, area]) => <div key={k}><label className={lbl} htmlFor={k}>{t}</label>{area ? <textarea id={k} name={k} rows={5} defaultValue={(s[k] as string) ?? ""} className={inp} /> : <input id={k} name={k} defaultValue={(s[k] as string) ?? ""} className={inp} />}</div>)}
      {err && <p role="alert" className="text-red-600">{err}</p>}{msg && <p role="status" className="text-emerald">{msg}</p>}
      <button className="btn" disabled={busy}>{busy ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}</button>
    </form>
  );
}
