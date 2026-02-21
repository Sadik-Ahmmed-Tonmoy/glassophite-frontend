"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import Footer from "@/components/shared/Footer/Footer";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import BrandStatementSection from "./BrandStatementSection";
import FeaturedCollectionSection from "./FeaturedCollectionSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
import HorizontalScroll from "./HorizontalScroll/HorizontalScroll";
import LimitedEditionHighlightSection from "./LimitedEditionHighlightSection";
import SEOContentSection from "./SEOContentSection";
import SocialProofSection from "./SocialProofSection";
import StyleInspirationSection from "./StyleInspirationSection";
import VirtualTryOn from "./VirtualTryOn";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";
import Testimonials from "./TestimonialsSection";

const HomeComponent = () => {
  return (
    <div id="top">
      {/* <Banner /> */}
      <HeroCinematicSection />
      <Testimonials />
      <SEOContentSection />
      <VirtualTryOn />
      <HorizontalScroll />
      <GlassophitePromiseSection />
      <StyleInspirationSection />
      <SocialProofSection />
      <LimitedEditionHighlightSection />
      <BrandStatementSection />
      <WhyChooseGlassophiteSection />
      <BestSellerCarouselSection />
      <FeaturedCollectionSection />
      <Footer />
  <div className="hidden md:block">
         <FloatButton.BackTop  />
        </div>
      {/* <LoginWithGoogle /> */}
    </div>
  );
};

export default HomeComponent;
