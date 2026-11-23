export default function Loading() {
  return (<div className="wrap py-8" aria-busy="true" aria-label="লোড হচ্ছে"><div className="mb-5 h-10 w-64 animate-pulse rounded-xl bg-emerald-soft dark:bg-[#12301b]" /><div className="mb-5 h-28 animate-pulse rounded-2xl bg-emerald-soft dark:bg-[#12301b]" />
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-36 animate-pulse rounded-2xl bg-emerald-soft dark:bg-[#12301b]" />)}</div></div>);
}
