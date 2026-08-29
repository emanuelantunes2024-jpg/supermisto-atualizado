import { Hero } from "@/components/home/Hero";
import {
  BenefitsRow,
  CategoryGrid,
  NewsletterSection,
  PopularTemplates,
  TestimonialsSection,
  WhyUsBand,
} from "@/components/home/HomeSections";
import { siteConfig } from "@/lib/config";
import {
  getCategoryCounts,
  getFeaturedCategoriesForHome,
  getFeaturedTemplatesForHome,
  getHomepageContent,
  getTestimonials,
} from "@/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [content, categories, popular, counts, testimonials] = await Promise.all([
    getHomepageContent(),
    getFeaturedCategoriesForHome(7),
    getFeaturedTemplatesForHome(4),
    getCategoryCounts(),
    getTestimonials(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            description: siteConfig.description,
          }),
        }}
      />

      <Hero hero={content.hero} categories={categories} mockups={popular} />
      <BenefitsRow benefits={content.benefits} />
      <CategoryGrid categories={categories} counts={counts} />
      <PopularTemplates templates={popular} />
      <WhyUsBand whyUs={content.why_us} />
      <TestimonialsSection testimonials={testimonials} />
      <NewsletterSection newsletter={content.newsletter} />
    </>
  );
}
