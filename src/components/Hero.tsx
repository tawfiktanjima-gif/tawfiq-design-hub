import Image from "next/image";
const tags = ["PNG", "ইসলামিক", "ফন্ট", "ব্যাকগ্রাউন্ড", "PixelLab"];
export default function Hero() {
  return (
    <section className="overflow-hidden bg-[radial-gradient(circle_at_75%_40%,#1a7a35,#06210f_70%)] text-white">
      <div className="wrap grid items-end gap-5 pt-10 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <h1 className="mb-3 text-[clamp(32px,5vw,54px)] leading-tight">আপনার ডিজাইনের প্রয়োজনীয় সব <em className="not-italic text-gold">রিসোর্স</em> এক জায়গায়</h1>
          <p className="mb-5 text-lg">PNG, ফন্ট, টেমপ্লেট, ব্যাকগ্রাউন্ড, ডিজাইন বেস ও প্রয়োজনীয় অ্যাপ সংগ্রহ করুন সহজেই।</p>
          <form action="/resources" role="search" className="flex max-w-[540px] rounded-full bg-white p-1.5">
            <input name="q" aria-label="অনুসন্ধান" placeholder="যে কোনো রিসোর্সের নাম লিখে খুঁজুন..." className="min-w-0 flex-1 bg-transparent px-4 text-[#10281a] outline-none" />
            <button className="btn">খুঁজুন</button>
          </form>
          <div className="my-4 mb-8 flex flex-wrap items-center gap-2"><b>জনপ্রিয় সার্চ:</b>
            {tags.map((t) => <a key={t} href={`/resources?q=${encodeURIComponent(t)}`} className="rounded-full border border-white/40 bg-white/10 px-3.5 py-0.5 hover:bg-white/25">{t}</a>)}</div>
        </div>
        <div className="justify-self-center md:justify-self-end">
          <Image src="/profile.jpg" alt="মোঃ তাওফীকুর রহমান" width={430} height={491} priority className="max-w-full rounded-t-[28px] [mask-image:linear-gradient(#000_85%,transparent)]" style={{ objectFit: "cover", objectPosition: "50% 15%" }} />
        </div>
      </div>
    </section>
  );
}
