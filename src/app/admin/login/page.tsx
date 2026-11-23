import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
export const metadata: Metadata = { title: "অ্যাডমিন লগইন", robots: { index: false, follow: false } };
export default function Page() { return <div className="wrap"><LoginForm /></div>; }
