"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
import NewArrivalsSection from "./NewArrivalsSection";
import SEOContentSection from "./SEOContentSection";
import ScrollAnimationEffect from "./ScrollAnimationEffect";
import Testimonials from "./TestimonialsSection";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";
import MoreProductsShowcaseSection from "./MoreProductsShowcaseSection";

const HomeComponent = () => {
  return (
    <div id="top" className="w-full relative">
      <HeroCinematicSection />
      <BestSellerCarouselSection />
      <WhyChooseGlassophiteSection />
      {/* <CollectionSpotlightSection /> */}
      <NewArrivalsSection />
      <MoreProductsShowcaseSection />
      {/* <StyleLookbookShowcaseSection /> */}
      <ScrollAnimationEffect />
      <Testimonials />
      <GlassophitePromiseSection />
      <SEOContentSection />
      <div className="hidden md:block">
        <FloatButton.BackTop />
      </div>
    </div>
  );
};

export default HomeComponent;
