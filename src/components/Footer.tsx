import Link from "next/link";
import Logo from "./Logo";
import type { SiteSettings } from "@/lib/types";
import { waLink } from "@/lib/utils";
export default function Footer({ s }: { s: SiteSettings }) {
  return (
    <footer className="bg-forest py-7 text-center text-[#cfe6d3]">
      <div className="wrap">
        <div className="flex items-center justify-center gap-2"><Logo size={40} /><b className="text-xl text-white">Tawfiq Design Hub</b></div>
        <p>আপনার ডিজাইনের সহায়ক সঙ্গী</p>
        <nav className="my-3 flex flex-wrap justify-center gap-4" aria-label="ফুটার">
          <Link href="/">হোম</Link><Link href="/#categories">ক্যাটাগরি</Link><Link href="/#about">আমার সম্পর্কে</Link><Link href="/#contact">যোগাযোগ</Link>
          {s.facebook_url && <a href={s.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}<a href={waLink(s.whatsapp_number)}>WhatsApp</a>
          <Link href="/privacy">গোপনীয়তা নীতি</Link><Link href="/terms">ব্যবহারের শর্তাবলি</Link>
        </nav>
        <small className="opacity-80">© Tawfiq Design Hub. সর্বস্বত্ব সংরক্ষিত। | ডিজাইন ও পরিচালনায়: {s.owner_name}</small>
      </div>
    </footer>
  );
}
