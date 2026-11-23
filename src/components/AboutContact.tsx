import Image from "next/image";
import type { SiteSettings as S } from "@/lib/types";
import { waLink } from "@/lib/utils";
const MSG = "আসসালামু আলাইকুম, আমি Tawfiq Design Hub থেকে যোগাযোগ করছি।";
export default function AboutContact({ s }: { s: S }) {
  return (
    <div className="my-9 grid gap-4 md:grid-cols-[1.2fr_1fr_1fr]">
      <section id="about" className="card flex scroll-mt-20 overflow-hidden">
        <div className="relative w-[38%] min-h-[220px]"><Image src={s.profile_image || "/profile.jpg"} alt={s.owner_name} fill sizes="200px" className="object-cover object-top" /></div>
        <div className="p-4"><h3 className="text-xl font-bold">আমার সম্পর্কে</h3><b>{s.owner_name}</b><p className="opacity-70">{s.owner_title}</p><p className="mt-2 opacity-80">{s.about_text}</p></div>
      </section>
      <section id="contact" className="card scroll-mt-20 p-4">
        <h3 className="mb-2 text-xl font-bold">🎧 যোগাযোগ করুন</h3>
        <a className="my-2 block font-semibold" href={`tel:${s.mobile_number}`}>📞 মোবাইল: {s.mobile_number}</a>
        <a className="my-2 block font-semibold" href={waLink(s.whatsapp_number)}>💬 হোয়াটসঅ্যাপ: {s.whatsapp_number}</a>
        {s.facebook_url && <a className="my-2 block font-semibold text-blue-600" href={s.facebook_url} target="_blank" rel="noopener noreferrer">ফেসবুক প্রোফাইল</a>}
        <a className="btn mt-2 w-full" href={`tel:${s.mobile_number}`}>কল করুন</a>
      </section>
      <section className="card bg-gradient-to-br from-[#d9f7d6] to-[#9be58f] p-4 text-center text-forest dark:from-[#12301b] dark:to-[#0f7a2f] dark:text-white">
        <h3 className="mb-2 text-xl font-bold">সরাসরি WhatsApp-এ যোগাযোগ করুন</h3>
        <a className="btn mb-2 w-full" href={waLink(s.whatsapp_number)}>WhatsApp-এ যোগাযোগ করুন</a>
        <a className="btn w-full !bg-white !text-emerald" href={waLink(s.whatsapp_number, MSG)}>WhatsApp-এ মেসেজ করুন</a>
      </section>
    </div>
  );
}
