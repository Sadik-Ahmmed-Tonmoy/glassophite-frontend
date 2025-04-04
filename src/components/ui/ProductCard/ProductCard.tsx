"use client";
import { Heart, XCircle, Barcode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import AddToCartButton from "../buttons/AddToCartButton/AddToCartButton";
import ViewDetailsButton from "../buttons/ViewDetailsButton/view-details-button";
import Link from "next/link";

export const CardArr = [
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
  

function ProductCard() {
  const [selectedImage, setSelectedImage] = useState(CardArr[0].img);
  const [selectedColor, setSelectedColor] = useState(CardArr[0].color);
  const [selectedVariant, setSelectedVariant] = useState(CardArr[0]);
  const [isActive, setIsActive] = useState(false);

  const handleColorButtonClick = (variant: (typeof CardArr)[0]) => {
    setSelectedImage(variant.img);
    setSelectedColor(variant.color);
    setSelectedVariant(variant);
  };

  const handleClick = () => {
    setIsActive((prevState) => !prevState);
  };

  const handleViewDetails = () => {
    // Handle view details action
    console.log("View details for:", selectedVariant.title);
  };

  const handleAddToCart = () => {
    // Handle add to cart action
    if (selectedVariant.inStock) {
      console.log("Added to cart:", selectedVariant.title);
    }
  };

  return (
    <div className="w-[350px] mx-auto">
      <div className="dark:bg-white bg-gray-100 rounded-md">
        <div className="w-full h-52 relative">
          <motion.button
            className="absolute top-2 right-2 z-20 text-2xl text-white"
            onClick={handleClick}
            animate={{ scale: isActive ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 1000, damping: 10 }}
          >
            {isActive ? <Heart className="fill-white" /> : <Heart />}
          </motion.button>

          {/* Product Code Badge */}
          <div className="absolute bottom-2 left-2 z-20 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
            Code :<span className="ps-1">{selectedVariant.productCode}</span>
          </div>

          {CardArr.map((data, index) => (
            <div key={index} className="relative">
              <Image
                src={data?.img || "/placeholder.svg"}
                alt="shoes"
                width={400}
                height={400}
                priority
                quality={80}
                placeholder="blur"
                blurDataURL={data.img}
                className={`absolute h-52 w-full rounded-t-md object-cover ${
                  selectedColor === data.color
                    ? "z-10 transition-all duration-500"
                    : "transition-all delay-500"
                }`}
                style={{
                  clipPath:
                    selectedColor === data.color
                      ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%) "
                      : "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%) ",
                }}
              />
              {selectedColor === data.color && !data.inStock && (
                <div className="absolute inset-4 bg-black/50 z-20 flex flex-col items-center justify-center">
                  <XCircle className="w-12 h-12 text-white mb-2" />
                  <span className="text-white font-bold text-xl">
                    STOCK OUT
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <article className="text-black pt-2 p-2">
          <div className="flex justify-between">
            <h1 className="font-semibold text-xl text-green-primary">
              {selectedVariant.title.length > 15
                ? `${selectedVariant.title.slice(0, 15)}...`
                : selectedVariant.title}
            </h1>
            {!selectedVariant.inStock ? (
              <span className="text-red-500 font-medium text-sm">
                Out of Stock
              </span>
            ) : (
              <span className="text-green-secondary font-medium text-sm">
                {selectedVariant.quantity <= 5
                  ? `Only ${selectedVariant.quantity} left!`
                  : "In Stock"}
              </span>
            )}
          </div>
          <p className="text-xs">
            {selectedVariant.shortDescription.length > 40
              ? `${selectedVariant.shortDescription.slice(0, 40)}...`
              : selectedVariant.shortDescription}
          </p>
          <div className="flex justify-between py-2">
            <h1 className="font-semibold text-2xl text-green-primary">
              ৳ {selectedVariant.priceAfterDiscount ?? 0} BDT
            </h1>
            <div className="flex gap-2 items-center">
              <span className="text-xl text-gray-400 line-through">
                ৳ 
                {selectedVariant.mainPrice ?? 0}
                 BDT
              </span>
              <span className="text-lg text-green-secondary">
                {selectedVariant.discountPercent ?? 0}
                % off</span>
            </div>
          </div>
          <div className="flex justify-between py-2">
            <div className="flex gap-2 items-center">
              {CardArr.map((data, index) => (
                <button
                  key={index}
                  onClick={() => handleColorButtonClick(data)}
                  className={`relative w-6 h-6 border rounded-full grid place-content-center transition-all ${
                    selectedColor === data.color
                      ? "border-black"
                      : "border-gray-200"
                  } ${!data.inStock ? "opacity-60" : ""}`}
                  title={
                    data.inStock
                      ? `Available: ${data.quantity}`
                      : "Out of Stock"
                  }
                >
                  <span
                    className="w-4 h-4 rounded-full inline-block"
                    style={{
                      backgroundColor: data.color,
                    }}
                  ></span>
                  {!data.inStock && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-[1px] bg-red-500 rotate-45"></div>
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Product Code (Alternative Position) */}
            <div className="text-xs text-gray-500 flex items-center">
              <span className="font-mono">
                SKU: {selectedVariant.productCode}
              </span>
            </div>
          </div>

          {/* Button Group */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Link href={`/product/2`} passHref className="w-full">
            <ViewDetailsButton />
            </Link>
            <AddToCartButton />
          </div>
        </article>
      </div>
    </div>
  );
}

export default ProductCard;
