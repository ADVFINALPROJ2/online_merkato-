import { HeroSection } from '@/components/landing/hero_section';
import { CategoryGrid } from '@/components/landing/category-grid';
import { ProductListing } from '@/components/landing/product-listing';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main className="max-w-10xl mx-auto px-4 space-y-12">
      <HeroSection />
      <CategoryGrid />
      <ProductListing />
    </main>
  );
}