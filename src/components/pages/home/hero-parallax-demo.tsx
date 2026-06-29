"use client";

import { HeroParallax } from "@/components/hero-parallax";
import { mockProducts } from "@/lib/productMockData";
import React from "react";

// Curated list of actual working sunglasses images from the mock dataset and public sources
const workingImages = [
  "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png",
  "https://i.ibb.co.com/qMPcw4zJ/Chat-GPT-Image-Apr-4-2025-03-27-28-PM.png",
  "https://images.pexels.com/photos/2587370/pexels-photo-2587370.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587371/pexels-photo-2587371.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587372/pexels-photo-2587372.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587373/pexels-photo-2587373.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587374/pexels-photo-2587374.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587375/pexels-photo-2587375.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587376/pexels-photo-2587376.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587377/pexels-photo-2587377.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587378/pexels-photo-2587378.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587379/pexels-photo-2587379.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/2587380/pexels-photo-2587380.jpeg?auto=compress&cs=tinysrgb&w=600",
];

export default function HeroParallaxDemo() {
  // Ensure we have exactly 15 items by padding if mockProducts is smaller
  const parallaxProducts = [...mockProducts, ...mockProducts, ...mockProducts]
    .slice(0, 15)
    .map((product, index) => {
      // Check if product has a valid loaded URL, otherwise fall back to a working asset URL
      const hasValidImage = product.img && (product.img.includes("jkktXJFP") || product.img.includes("qMPcw4zJ") || product.img.includes("pexels.com"));
      const thumbnail = hasValidImage ? product.img : workingImages[index % workingImages.length];

      return {
        title: product.title,
        link: `/product/${product.id}`,
        thumbnail,
      };
    });

  return <HeroParallax products={parallaxProducts} />;
}
