import Link from "next/link";
import { bn } from "@/lib/utils";
export default function Pagination({ base, params, page, pages }: { base: string; params: Record<string, string | undefined>; page: number; pages: number }) {
  if (pages <= 1) return null;
  const href = (p: number) => { const u = new URLSearchParams(); Object.entries(params).forEach(([k, v]) => v && u.set(k, v)); if (p > 1) u.set("page", String(p)); const s = u.toString(); return s ? `${base}?${s}` : base; };
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2);
  return (
    <nav aria-label="পেজ" className="my-8 flex flex-wrap justify-center gap-2">
      {page > 1 && <Link href={href(page - 1)} className="card px-3 py-1.5">← আগের</Link>}
      {nums.map((n, i) => <Link key={n} href={href(n)} aria-current={n === page ? "page" : undefined} className={`card px-3 py-1.5 ${n === page ? "!bg-emerald !text-white" : ""}`}>{i && n - nums[i - 1] > 1 ? "… " : ""}{bn(n)}</Link>)}
      {page < pages && <Link href={href(page + 1)} className="card px-3 py-1.5">পরের →</Link>}
    </nav>
  );
}
