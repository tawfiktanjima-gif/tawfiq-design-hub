import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import CopyLink from "@/components/CopyLink";
import DownloadButton from "@/components/DownloadButton";
import ResourceSection from "@/components/ResourceSection";
import { getRelated, getResourceBySlug } from "@/lib/data";
import { bn, fmtDate, fmtSize, previewUrl } from "@/lib/utils";
type P = { params: { slug: string } };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const r = await getResourceBySlug(params.slug); if (!r) return {};
  const img = previewUrl(r.preview_image); const desc = r.description?.slice(0, 160) || `${r.title} ডাউনলোড করুন`;
  return { title: r.title, description: desc, alternates: { canonical: `/resource/${r.slug}` }, openGraph: { title: r.title, description: desc, type: "article", images: img ? [img] : undefined } };
}
export default async function ResourcePage({ params }: P) {
  const r = await getResourceBySlug(params.slug); if (!r) notFound();
  const related = await getRelated(r);
  const imgs = [r.preview_image, ...(r.preview_images ?? [])].map(previewUrl).filter((v, i, a): v is string => !!v && a.indexOf(v) === i);
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const ld = { "@context": "https://schema.org", "@type": "CreativeWork", name: r.title, description: r.description ?? undefined, image: imgs[0], url: `${site}/resource/${r.slug}`, datePublished: r.created_at, dateModified: r.updated_at, keywords: r.tags?.join(", ") || undefined, inLanguage: "bn" };
  const rows: [string, string | undefined][] = [["ক্যাটাগরি", r.categories?.name], ["ফাইল ফরম্যাট", r.file_type?.toUpperCase()], ["ফাইল সাইজ", fmtSize(r.file_size)], ["আপলোডের তারিখ", fmtDate(r.created_at)], ["ডাউনলোড", `${bn(r.download_count)} বার`]];
  return (
    <div className="wrap py-8">
      <nav aria-label="ব্রেডক্রাম্ব" className="mb-3 text-sm opacity-70"><Link href="/">হোম</Link> / <Link href="/resources">রিসোর্স</Link> / {r.categories && <><Link href={`/category/${r.categories.slug}`}>{r.categories.name}</Link> / </>}{r.title}</nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Gallery images={imgs} alt={r.title} />
        <div>
          <h1 className="mb-3 text-3xl font-bold">{r.title}</h1>
          <dl className="card divide-y divide-[#dbe7dc] dark:divide-[#244030]">{rows.map(([k, v]) => v && <div key={k} className="flex justify-between gap-3 px-4 py-2"><dt className="opacity-70">{k}</dt><dd className="font-semibold">{v}</dd></div>)}</dl>
          {r.tags?.length > 0 && <div className="my-4 flex flex-wrap gap-2">{r.tags.map((t) => <Link key={t} href={`/resources?q=${encodeURIComponent(t)}`} className="rounded-full bg-emerald-soft px-3 py-1 text-sm dark:bg-[#12301b]">#{t}</Link>)}</div>}
          <DownloadButton id={r.id} large />
          <CopyLink title={r.title} />
        </div>
      </div>
      {r.description && <section className="card mt-6 p-5"><h2 className="mb-2 text-xl font-bold">বিবরণ</h2><p className="whitespace-pre-line leading-relaxed opacity-90">{r.description}</p></section>}
      {related.length > 0 && <div className="mt-6"><ResourceSection title="সম্পর্কিত রিসোর্স" href={r.categories ? `/category/${r.categories.slug}` : "/resources"} items={related} /></div>}
    </div>
  );
}
