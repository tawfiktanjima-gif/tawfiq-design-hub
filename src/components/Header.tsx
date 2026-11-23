"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
const links = [["/", "হোম"], ["/#categories", "ক্যাটাগরি"], ["/resources?sort=new", "নতুন আপলোড"], ["/resources?sort=popular", "জনপ্রিয়"], ["/#about", "আমার সম্পর্কে"], ["/#contact", "যোগাযোগ"]];
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleTheme = () => { const d = document.documentElement.classList.toggle("dark"); localStorage.setItem("theme", d ? "dark" : "light"); };
  return (
    <header className="sticky top-0 z-50 bg-forest text-white">
      <div className="wrap flex h-[68px] items-center gap-3">
        <Link href="/" className="flex items-center gap-2"><Logo /><span><b className="block text-xl leading-none">Tawfiq Design Hub</b><small className="text-xs opacity-80">আপনার ডিজাইনের সহায়ক সঙ্গী</small></span></Link>
        <nav aria-label="প্রধান মেনু" className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-[68px] flex-col gap-1 bg-forest p-3 md:static md:ml-auto md:flex md:flex-row`}>
          {links.map(([h, t]) => <Link key={h} href={h} onClick={() => setOpen(false)} className="rounded-full px-3 py-2 hover:bg-emerald">{t}</Link>)}
        </nav>
        <button onClick={toggleTheme} aria-label="থিম পরিবর্তন" className="ml-auto h-10 w-10 rounded-full bg-white/15 md:ml-0">🌓</button>
        <button onClick={() => setOpen(!open)} aria-label="মেনু" aria-expanded={open} className="h-10 w-10 rounded-full bg-white/15 md:hidden">☰</button>
      </div>
    </header>
  );
}
