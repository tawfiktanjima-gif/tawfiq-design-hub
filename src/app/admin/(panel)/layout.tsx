import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin";
import { logout } from "../actions";
export const metadata: Metadata = { title: "অ্যাডমিন প্যানেল", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
const nav = [["/admin", "ড্যাশবোর্ড"], ["/admin/resources", "রিসোর্স"], ["/admin/resources/new", "নতুন আপলোড"], ["/admin/categories", "ক্যাটাগরি"], ["/admin/settings", "সেটিংস ও প্রোফাইল"]];
export default async function Layout({ children }: { children: React.ReactNode }) {
  if (!(await getAdmin())) redirect("/admin/login");
  return (
    <div className="wrap py-6">
      <div className="card mb-5 flex flex-wrap items-center gap-2 p-3">
        {nav.map(([h, t]) => <Link key={h} href={h} className="rounded-full px-3 py-1.5 hover:bg-emerald-soft dark:hover:bg-[#12301b]">{t}</Link>)}
        <Link href="/" className="ml-auto rounded-full px-3 py-1.5 opacity-70">সাইট দেখুন ↗</Link>
        <form action={logout}><button className="rounded-full border border-current px-3 py-1.5">লগআউট</button></form>
      </div>
      {children}
    </div>
  );
}
