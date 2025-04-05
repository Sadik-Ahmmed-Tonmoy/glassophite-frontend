import LoginWithGoogle from "@/components/LoginWithGoogle";
import Banner from "@/components/pages/home/Banner/Banner";
import ProductCard from "@/components/ui/ProductCard/ProductCard";
import { productMockData } from "@/lib/productMockData";
import React from "react";



const page = () => {
  return (
    <div>
      <Banner />
      <LoginWithGoogle />
      <ProductCard product={productMockData} />
    </div>
  );
};

export default page;
