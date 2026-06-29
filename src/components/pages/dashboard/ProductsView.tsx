"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { mockProducts } from "@/lib/productMockData";

export default function ProductsView() {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState("");
  const newProdBrand = "Glassophite";
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Sunglasses");
  const [newProdStock, setNewProdStock] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Zod validation schema
  const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    brand: z.string().min(2, "Brand must be specified."),
    price: z.number().positive("Price must be a positive number."),
    stock: z.number().int().nonnegative("Stock level cannot be negative."),
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      name: newProdName,
      brand: newProdBrand,
      price: Number(newProdPrice),
      stock: Number(newProdStock),
    };

    const validationResult = productSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      toast.error("Form Validation Error", {
        description: "Please correct the errors in the fields.",
      });
      return;
    }

    const newProduct = {
      id: `GP-${Math.floor(100 + Math.random() * 900)}`,
      title: newProdName,
      brand: newProdBrand,
      shortDescription: `Luxury crafted ${newProdCategory} glasses with premium materials.`,
      longDescription: `Full description of customized ${newProdName} frames.`,
      img: "/placeholder.svg",
      mainPrice: Number(newProdPrice),
      priceAfterDiscount: Number(newProdPrice),
      discountPercent: "0",
      inStock: Number(newProdStock) > 0,
      color: "#007C74",
      reviews: [],
      variants: [
        {
          id: Math.floor(1000 + Math.random() * 9000).toString(),
          title: newProdName,
          productCode: `GPCODE-${Math.floor(100 + Math.random() * 900)}`,
          mainPrice: Number(newProdPrice),
          priceAfterDiscount: Number(newProdPrice),
          discountPercent: 0,
          inStock: Number(newProdStock) > 0,
          quantity: Number(newProdStock),
          shortDescription: "Premium Acetate",
          longDescription: "Detailed description",
          color: "#007C74",
          imgList: [{ image: "/placeholder.svg", id: Math.random().toString() }],
        }
      ],
    };

    setProducts([newProduct, ...products]);
    toast.success("Product Added Successfully!", {
      description: `${newProdName} has been added to Glassophite collections catalog.`,
    });

    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const handleDeleteProduct = (prodId: string, name: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
    toast.success("Product Deleted", {
      description: `${name} has been removed from the inventory list.`,
    });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Products</h1>
          <p className="text-xs text-neutral-500">Manage and edit your collection catalog listings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl text-xs bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 w-full sm:w-64 text-neutral-950 dark:text-white"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#007c74]/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Eyewear</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Frame Model</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative w-8 h-8 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                    <Image
                      src={p.img || "/placeholder.svg"}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 dark:text-white">{p.title}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{p.id}</p>
                  </div>
                </td>
                <td className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">{p.brand}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-neutral-150 dark:bg-neutral-800 text-[10px] font-bold rounded text-neutral-800 dark:text-neutral-200">
                    {p.variants[0]?.shortDescription || "Eyewear"}
                  </span>
                </td>
                <td className="p-4 font-semibold">
                  {p.variants[0]?.inStock ? (
                    <span className="text-green-550 dark:text-green-400 font-bold">{p.variants[0]?.quantity} In Stock</span>
                  ) : (
                    <span className="text-red-500 font-bold">Out of Stock</span>
                  )}
                </td>
                <td className="p-4 font-bold text-[#007C74]">৳{p.mainPrice}</td>
                <td className="p-4 flex justify-center gap-1.5">
                  <button
                    onClick={() => handleDeleteProduct(p.id, p.title)}
                    className="p-1.5 bg-neutral-100 hover:bg-red-500/10 dark:bg-neutral-800 dark:hover:bg-red-550/20 text-neutral-500 hover:text-red-550 dark:hover:text-red-400 rounded-lg border border-neutral-200 dark:border-neutral-850 transition-colors cursor-pointer"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal Drawer */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel max-w-md w-full p-6 rounded-2xl relative z-10 space-y-4 border border-[#007C74]/25 shadow-2xl bg-white dark:bg-neutral-900"
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#007C74]" />
                <span>Add Premium Eyewear</span>
              </h3>
              
              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Frame Model Name</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Titanium Aviator Gold"
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                  />
                  {formErrors.name && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.name}</span>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Price (BDT)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                    />
                    {formErrors.price && (
                      <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.price}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Stock Qty</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                    />
                    {formErrors.stock && (
                      <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.stock}</span>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Category Selection</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                  >
                    <option value="Sunglasses">Sunglasses Collection</option>
                    <option value="Optical">Optical Glasses</option>
                    <option value="Limited">Limited Edition</option>
                  </select>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-[#007c74]/15"
                  >
                    Save Eyewear
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
