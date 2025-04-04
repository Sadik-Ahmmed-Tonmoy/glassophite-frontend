/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation"

import ProductDetails from "@/components/pages/productDetails/productDetails"


const CardArr = [
    {
      img: "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png",
      title: "Black Horizon",
      shortDescription:
        "A sleek and elegant design featuring a black matte finish.",
      longDescription:
        "These sunglasses combine modern design with sophisticated style, featuring a matte black frame and high-quality lenses that offer superior UV protection. Perfect for both casual and formal settings.",
      color: "#232323",
      priceAfterDiscount: 120,
      mainPrice: 150,
      discountPercent: 20,
      inStock: true,
      quantity: 5,
      productCode: "BL-2025-001",
      brand: "Luxura",
      material: "Matte Plastic",
      dimensions: "Medium",
      weight: "150g",
      shippingInfo: "Ships within 2-4 business days",
      frameType: "Full-Rim",
      lensType: "Polarized",
      warranty: "1-year warranty for manufacturing defects",
      countryOfOrigin: "Italy",
      targetAudience: "Unisex, Fashion Enthusiasts",
      careInstructions: "Clean with a microfiber cloth. Avoid direct heat.",
      reviews: [
        { rating: 5, comment: "Love the sleek design and comfort!" },
        { rating: 4, comment: "Great quality, but a bit tight on the sides." },
      ],
      imgList: [
        "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png",
        "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-19-44-PM.png", 
        "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-20-44-PM.png", 
      ],
    },
    {
      img: "https://i.ibb.co.com/qMPcw4zJ/Chat-GPT-Image-Apr-4-2025-03-27-28-PM.png",
      title: "Blue Horizon",
      shortDescription:
        "A vibrant blue design that adds a bold statement to your style.",
      longDescription:
        "With its bold blue color and modern shape, the Blue Horizon sunglasses are perfect for those who want to stand out. Designed with both style and comfort in mind, these sunglasses are perfect for sunny days and outdoor activities.",
      color: "#1d81c8",
      inStock: false,
      quantity: 0,
      productCode: "NA1-2025-002",
      brand: "Vivid Shades",
      material: "Polycarbonate",
      dimensions: "Large",
      weight: "160g",
      shippingInfo: "Currently out of stock",
      frameType: "Semi-Rimless",
      lensType: "UV400 Protection",
      warranty: "6-month warranty for manufacturing defects",
      countryOfOrigin: "USA",
      targetAudience: "Male, Outdoorsy Lifestyle",
      careInstructions: "Store in case when not in use. Avoid dropping.",
      reviews: [
        { rating: 5, comment: "Perfect for outdoor activities. Highly recommend!" },
        { rating: 3, comment: "The fit is good, but a bit too large for my face." },
      ],
      imgList: [
        "https://i.ibb.co.com/qMPcw4zJ/Chat-GPT-Image-Apr-4-2025-03-27-28-PM.png",
        "https://i.ibb.co.com/qMPcw4zJ/Chat-GPT-Image-Apr-4-2025-03-28-28-PM.png", 
        "https://i.ibb.co.com/qMPcw4zJ/Chat-GPT-Image-Apr-4-2025-03-29-28-PM.png", 
      ],
    },
    {
      img: "https://i.ibb.co.com/cSPHCJpb/Chat-GPT-Image-Apr-4-2025-03-26-17-PM.png",
      title: "Red Horizon",
      shortDescription:
        "A fiery red frame that captures attention and adds a unique flair.",
      longDescription:
        "The Red Horizon sunglasses are designed for those who love making bold fashion choices. With their eye-catching red frame and premium UV protection lenses, they are as functional as they are stylish.",
      color: "#e0241b",
      inStock: true,
      quantity: 3,
      productCode: "NA2-2025-003",
      brand: "Bold Vision",
      material: "Acetate",
      dimensions: "Small",
      weight: "145g",
      shippingInfo: "Ships within 1-3 business days",
      frameType: "Full-Rim",
      lensType: "Polarized, Anti-Glare",
      warranty: "2-year warranty for manufacturing defects",
      countryOfOrigin: "Japan",
      targetAudience: "Unisex, Fashion Forward",
      careInstructions: "Wipe lenses gently with a soft cloth to avoid scratches.",
      reviews: [
        { rating: 4, comment: "Great color and protection, but a little tight." },
        { rating: 5, comment: "Stylish and perfect for bright days!" },
      ],
      imgList: [
        "https://i.ibb.co.com/cSPHCJpb/Chat-GPT-Image-Apr-4-2025-03-26-17-PM.png",
        "https://i.ibb.co.com/cSPHCJpb/Chat-GPT-Image-Apr-4-2025-03-27-17-PM.png", 
        "https://i.ibb.co.com/cSPHCJpb/Chat-GPT-Image-Apr-4-2025-03-28-17-PM.png", 
      ],
    },
    {
      img: "https://i.ibb.co.com/RpdmpMC6/Chat-GPT-Image-Apr-4-2025-03-20-49-PM.png",
      title: "Purple Horizon",
      shortDescription:
        "A luxury purple frame that exudes sophistication and class.",
      longDescription:
        "Purple Horizon sunglasses are the epitome of luxury. With their rich purple color and elegant design, they are perfect for those who want to add a touch of class to their accessory collection.",
      color: "#c6a7cb",
      inStock: false,
      quantity: 0,
      productCode: "AD-2025-004",
      brand: "Elite Styles",
      material: "Metal Alloy",
      dimensions: "Medium",
      weight: "170g",
      shippingInfo: "Currently out of stock",
      frameType: "Full-Rim",
      lensType: "UV400 Protection, Anti-Scratch",
      warranty: "1-year warranty for manufacturing defects",
      countryOfOrigin: "France",
      targetAudience: "Unisex, Luxury Seekers",
      careInstructions: "Store in a protective case. Clean lenses with a microfiber cloth.",
      reviews: [
        { rating: 5, comment: "Elegant and luxurious. A great buy!" },
        { rating: 4, comment: "Love the color and feel, but a bit heavier than expected." },
      ],
      imgList: [
        "https://i.ibb.co.com/RpdmpMC6/Chat-GPT-Image-Apr-4-2025-03-20-49-PM.png",
        "https://i.ibb.co.com/RpdmpMC6/Chat-GPT-Image-Apr-4-2025-03-21-49-PM.png", 
        "https://i.ibb.co.com/RpdmpMC6/Chat-GPT-Image-Apr-4-2025-03-22-49-PM.png", 
      ],
    },
  ];

export default async function ProductPage({ params }: any) {
  // Await the params to properly handle asynchronous fetching
//   const productId = await Number.parseInt(params?.productId)
  const { productId } = await params;
  // Check if the productId is valid
//   if (isNaN(productId) || productId < 0 || productId >= CardArr.length) {
//     notFound() // Return a 404 if the productId is invalid
//   }

  // Retrieve the product based on the productId
  const product = await CardArr[parseInt(productId)]
  console.log(productId, product);

  return ( 
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={product} allProducts={CardArr} currentIndex={productId} />
    </main>
  )
}
