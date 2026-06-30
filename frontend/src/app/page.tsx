import { HeroSection } from '@/components/landing/hero_section';
import { FlashDeals } from '@/components/landing/flash-deal';
import { CategoryGrid } from '@/components/landing/category-grid';
import { BestSellers } from '@/components/landing/best-sellers';
// import { SellerStories } from '@/components/landing/seller-stories';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <main className="max-w-10xl mx-auto px-4 space-y-12">
      <HeroSection />
      <CategoryGrid />
      <FlashDeals />
      <BestSellers />
      {/* <SellerStories /> */}
    </main>
  );
}