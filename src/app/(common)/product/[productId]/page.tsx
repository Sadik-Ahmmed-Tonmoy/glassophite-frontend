/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation"


import ProductDetails from "@/components/pages/productDetails/productDetails"
import { productMockData } from "@/lib/productMockData";

export default async function ProductPage({ params }: any) {
  const { productId } = await params;

 


  return (
    <main className="container mx-auto px-4 py-8">
      <ProductDetails product={productMockData} />
    </main>
  )
}

