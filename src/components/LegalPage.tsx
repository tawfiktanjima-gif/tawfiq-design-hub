export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: [string, string][] }) {
  return (
    <div className="wrap max-w-3xl py-10">
      <h1 className="mb-1 border-l-[5px] border-emerald pl-2.5 text-3xl font-bold">{title}</h1>
      <p className="mb-6 opacity-70">সর্বশেষ হালনাগাদ: {updated}</p>
      <div className="card space-y-5 p-6">{sections.map(([h, t], i) => <section key={h}><h2 className="mb-1 text-xl font-bold">{i + 1}. {h}</h2><p className="whitespace-pre-line leading-relaxed opacity-90">{t}</p></section>)}</div>
    </div>
  );
}
