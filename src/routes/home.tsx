import { Helmet } from 'react-helmet-async';
import { Hero } from '@/components/site/Hero';
import { Categories } from '@/components/site/Categories';
import { Products } from '@/components/site/Products';
import { BestSellers } from '@/components/site/BestSellers';
import { RecentlyViewed } from '@/components/site/RecentlyViewed';
import { Showcase } from '@/components/site/Showcase';
import { Why } from '@/components/site/Why';
import { Brands } from '@/components/site/Brands';
import { Testimonials } from '@/components/site/Testimonials';
import { CtaBanner } from '@/components/site/CtaBanner';
import { Faq } from '@/components/site/Faq';
import { Achievements } from '@/components/site/Achievements';

export function Component() {
  return (
    <>
      <Helmet>
        <title>AgriForge - Industrial Agricultural Machinery Marketplace</title>
        <meta name="description" content="Industrial-grade machinery, genuine tractor spare parts, and heavy-duty components engineered to outlast every season — delivered to your farm, workshop or dealership." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <main>
          <Hero />
          <Brands />
          <Categories />
          <Products />
          <BestSellers />
          <Showcase />
          <Why />
          <RecentlyViewed />
          <Testimonials />
          <Achievements />
          <Faq />
          <CtaBanner />
        </main>
      </div>
    </>
  );
}
