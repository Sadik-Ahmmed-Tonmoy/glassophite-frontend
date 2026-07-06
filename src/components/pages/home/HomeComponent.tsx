"use client";

import { FloatButton } from "@/components/ui/FloatButton/FloatButton";
import BestSellerCarouselSection from "./BestSellerCarouselSection";
import CollectionSpotlightSection from "./CollectionSpotlightSection";
import NewArrivalsSection from "./NewArrivalsSection";
// import BrandStatementSection from "./BrandStatementSection";
import FeaturedCollectionSection from "./FeaturedCollectionSection";
import GlassophitePromiseSection from "./GlassophitePromiseSection";
import HeroCinematicSection from "./HeroCinematicSection";
// import HorizontalScroll from "./HorizontalScroll/HorizontalScroll";
import SEOContentSection from "./SEOContentSection";
// import SocialProofSection from "./SocialProofSection";
import ScrollAnimationEffect from "./ScrollAnimationEffect";
import Testimonials from "./TestimonialsSection";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";
import HeroParallaxDemo from "./hero-parallax-demo";

const HomeComponent = () => {
  return (
    <div id="top">
      {/* <Banner /> */}
      <HeroCinematicSection />
      {/* <CollectionParallaxSection /> */}
      {/* <BrandStatementSection /> */}
      <WhyChooseGlassophiteSection />
      <CollectionSpotlightSection />
      <BestSellerCarouselSection />
      <NewArrivalsSection />
      <FeaturedCollectionSection />
      <HeroParallaxDemo />
      {/* <VideoShowcaseSection /> */}
          {/* <SmoothScroll> */}

      <ScrollAnimationEffect />
          {/* </SmoothScroll> */}
      <Testimonials />
      {/* <VirtualTryOn /> */}
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
