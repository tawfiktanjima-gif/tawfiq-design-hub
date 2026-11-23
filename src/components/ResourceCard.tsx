import Image from "next/image";
import Link from "next/link";
import DownloadButton from "./DownloadButton";
import type { Resource } from "@/lib/types";
import { bn, fmtSize, previewUrl, isNew } from "@/lib/utils";
export default function ResourceCard({ r }: { r: Resource }) {
  return (
    <article className="card flex gap-3 p-3">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[repeating-conic-gradient(#e5e7eb_0_25%,#fff_0_50%)_50%/16px_16px]">
        {r.preview_image && <Image src={previewUrl(r.preview_image)!} alt={r.title} fill sizes="112px" className="object-cover" loading="lazy" />}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold">{r.title} {isNew(r.created_at) && <span className="rounded bg-gold px-1.5 text-xs text-forest">নতুন</span>}</h3>
        <p className="truncate text-sm opacity-70">{r.categories?.name}</p>
        <p className="line-clamp-1 text-sm opacity-70">{r.description}</p>
        <p className="text-sm">{r.file_type?.toUpperCase()} • {fmtSize(r.file_size)} • ⬇ {bn(r.download_count)} বার</p>
        <div className="mt-1.5 flex gap-2">
          <DownloadButton id={r.id} />
          <Link href={`/resource/${r.slug}`} className="rounded-full border border-current px-3 py-1 text-sm">বিস্তারিত</Link>
        </div>
      </div>
    </article>
  );
}
