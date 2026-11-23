import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";
const bn = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-bn", display: "swap" });
const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Tawfiq Design Hub – তাওফীক ডিজাইন হাব", template: "%s | Tawfiq Design Hub" },
  description: "আপনার ডিজাইনের প্রয়োজনীয় সব রিসোর্স এক জায়গায়। PNG, ফন্ট, ব্যাকগ্রাউন্ড, টেমপ্লেট ও আরও অনেক কিছু।",
  openGraph: { type: "website", locale: "bn_BD", siteName: "Tawfiq Design Hub", images: ["/profile.jpg"] },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang="bn" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} /></head>
      <body className={bn.variable}><Header /><main>{children}</main><Footer s={s} /></body>
    </html>
  );
}
