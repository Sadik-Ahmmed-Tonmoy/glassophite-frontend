"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import BrandStatementSection from "./BrandStatementSection";
import FeaturedCollectionSection from "./FeaturedCollectionSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
import HorizontalScroll from "./HorizontalScroll/HorizontalScroll";
import LimitedEditionHighlightSection from "./LimitedEditionHighlightSection";
import SEOContentSection from "./SEOContentSection";
import Testimonials from "./TestimonialsSection";
import VirtualTryOn from "./VirtualTryOn";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";

const HomeComponent = () => {
  return (
    <div id="top">
      {/* <Banner /> */}
      <HeroCinematicSection />
      <WhyChooseGlassophiteSection />
      <BestSellerCarouselSection />
      <FeaturedCollectionSection />
      <Testimonials />
      <VirtualTryOn />
      {/* <StyleInspirationSection /> */}
      <LimitedEditionHighlightSection />
      {/* <SocialProofSection /> */}
      <GlassophitePromiseSection />
      <BrandStatementSection />
      <HorizontalScroll />
      <SEOContentSection />
      <div className="hidden md:block">
        <FloatButton.BackTop />
      </div>
      {/* <LoginWithGoogle /> */}
    </div>
  );
};

export default HomeComponent;
