"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import NewArrivalsSection from "./NewArrivalsSection";
import CollectionSpotlightSection from "./CollectionSpotlightSection";
// import BrandStatementSection from "./BrandStatementSection";
import FeaturedCollectionSection from "./FeaturedCollectionSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
// import HorizontalScroll from "./HorizontalScroll/HorizontalScroll";
import SEOContentSection from "./SEOContentSection";
// import SocialProofSection from "./SocialProofSection";
import Testimonials from "./TestimonialsSection";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";
import HeroParallaxDemo from "./hero-parallax-demo";
import VirtualTryOn from "./VirtualTryOn";

const HomeComponent = () => {
  return (
    <div id="top">
      {/* <Banner /> */}
      <HeroCinematicSection />
      {/* <BrandStatementSection /> */}
      <WhyChooseGlassophiteSection />
      <CollectionSpotlightSection />
      <BestSellerCarouselSection />
      <NewArrivalsSection />
      <FeaturedCollectionSection />
      <HeroParallaxDemo />
      <Testimonials />
      <VirtualTryOn />
      {/* <StyleInspirationSection /> */}
      {/* <LimitedEditionHighlightSection /> */}
      {/* <SocialProofSection /> */}
      <GlassophitePromiseSection />
      {/* <HorizontalScroll /> */}
      <SEOContentSection />
      <div className="hidden md:block">
        <FloatButton.BackTop />
      </div>
      {/* <LoginWithGoogle /> */}
    </div>
  );
};

export default HomeComponent;
