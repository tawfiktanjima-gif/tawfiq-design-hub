import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ResourceSection from "@/components/ResourceSection";
import AboutContact from "@/components/AboutContact";
import { getCategories, getResources, getSettings } from "@/lib/data";
export const revalidate = 60;
export default async function Home() {
  const [cats, latest, popular, featured, s] = await Promise.all([getCategories(), getResources({ sort: "new" }), getResources({ sort: "popular" }), getResources({ featured: true }), getSettings()]);
  return (
    <>
      <Hero />
      <div className="wrap">
        <CategoryGrid categories={cats} />
        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          <ResourceSection title="🆕 নতুন আপলোড করা রিসোর্স" href="/resources?sort=new" items={latest} />
          <ResourceSection title="🏆 সর্বাধিক ডাউনলোড" href="/resources?sort=popular" items={popular} />
          <ResourceSection title="💎 বিশেষ রিসোর্স" href="/resources?featured=1" items={featured} />
        </div>
        <AboutContact s={s} />
      </div>
    </>
  );
}
