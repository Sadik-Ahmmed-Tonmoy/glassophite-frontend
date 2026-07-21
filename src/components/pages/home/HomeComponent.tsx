"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import CollectionSpotlightSection from "./CollectionSpotlightSection";
import NewArrivalsSection from "./NewArrivalsSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
import SEOContentSection from "./SEOContentSection";
import ScrollAnimationEffect from "./ScrollAnimationEffect";
import Testimonials from "./TestimonialsSection";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";
import HeroParallaxDemo from "./hero-parallax-demo";

const HomeComponent = () => {
  return (
    <div id="top" className="w-full overflow-x-hidden">
      <HeroCinematicSection />
      <WhyChooseGlassophiteSection />
      <CollectionSpotlightSection />
      <BestSellerCarouselSection />
      <NewArrivalsSection />
      <HeroParallaxDemo />
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
