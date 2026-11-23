"use client";
import Image from "next/image";
import { useState } from "react";
export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [i, setI] = useState(0);
  if (!images.length) return <div className="card grid aspect-[4/3] place-items-center opacity-60">প্রিভিউ নেই</div>;
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[repeating-conic-gradient(#e5e7eb_0_25%,#fff_0_50%)_50%/20px_20px]"><Image src={images[i]} alt={alt} fill priority sizes="(min-width:1024px) 600px, 100vw" className="object-contain" /></div>
      {images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{images.map((s, k) => (
        <button key={s} onClick={() => setI(k)} aria-label={`প্রিভিউ ${k + 1}`} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-emerald" : "border-transparent"}`}><Image src={s} alt="" fill sizes="64px" className="object-cover" loading="lazy" /></button>))}</div>}
    </div>
  );
}
