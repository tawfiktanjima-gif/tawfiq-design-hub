"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/admin/actions";
import { inp, lbl } from "./ui";
export default function LoginForm() {
  const r = useRouter(); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  return (
    <form className="card mx-auto my-16 max-w-sm space-y-4 p-6" onSubmit={async (e) => { e.preventDefault(); setBusy(true); setErr(""); const f = new FormData(e.currentTarget); const res = await login(String(f.get("email")), String(f.get("password"))); if (res.ok) { r.push("/admin"); r.refresh(); } else { setErr(res.error ?? "ত্রুটি"); setBusy(false); } }}>
      <h1 className="text-2xl font-bold">অ্যাডমিন লগইন</h1>
      <div><label className={lbl} htmlFor="email">ইমেইল</label><input id="email" name="email" type="email" required autoComplete="username" className={inp} /></div>
      <div><label className={lbl} htmlFor="pw">পাসওয়ার্ড</label><input id="pw" name="password" type="password" required autoComplete="current-password" className={inp} /></div>
      {err && <p role="alert" className="text-red-600">{err}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? "অপেক্ষা করুন..." : "লগইন করুন"}</button>
    </form>
  );
}
