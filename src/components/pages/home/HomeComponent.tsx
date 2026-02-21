"use client"

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
import VirtualTryOnSection from "./VirtualTryOnSection";
import WhyChooseGlassophiteSection from "./WhyChooseGlassophiteSection";

const HomeComponent = () => {
    return (
        <div>
                {/* <Banner /> */}
      <HeroCinematicSection/>
      <SEOContentSection />
      <VirtualTryOn />
      <HorizontalScroll/>
      <GlassophitePromiseSection />
      <StyleInspirationSection />
      <SocialProofSection />
      <LimitedEditionHighlightSection />
      <BrandStatementSection/>
      <WhyChooseGlassophiteSection/>
      <BestSellerCarouselSection />
      <FeaturedCollectionSection/>
      <Footer/>

      {/* <HeroSection/> */}
      {/* <LoginWithGoogle /> */}
      {/* <ProductCard product={productMockData} /> */}
      {/* <ProductCard product={productMockData} /> */}
      {/* <HorizontalStorySection/> */}
      
        </div>
    );
};

export default HomeComponent;