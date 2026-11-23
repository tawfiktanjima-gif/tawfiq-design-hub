"use client";
import { useState } from "react";
export default function CopyLink({ title }: { title: string }) {
  const [msg, setMsg] = useState("");
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  return (
    <div className="flex items-center gap-2">
      <button className="rounded-full border border-current px-4 py-1.5" onClick={async () => { try { await navigator.clipboard.writeText(location.href); flash("লিংক কপি হয়েছে"); } catch { flash("কপি করা যায়নি"); } }}>🔗 লিংক কপি</button>
      <button className="rounded-full border border-current px-4 py-1.5" onClick={async () => { if (navigator.share) { try { await navigator.share({ title, url: location.href }); } catch {} } else flash("এই ব্রাউজারে শেয়ার সমর্থিত নয়, লিংক কপি করুন"); }}>↗ শেয়ার</button>
      <span role="status" className="text-sm text-emerald">{msg}</span>
    </div>
  );
}
