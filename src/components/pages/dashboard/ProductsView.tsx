"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Upload,
  Check,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { mockProducts, saveProductsToStorage } from "@/lib/productMockData";
import { TProduct, TVariant } from "@/types/types";

export default function ProductsView() {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

  // Expanded products list for variants inspection
  const [expandedProducts, setExpandedProducts] = useState<Record<string, boolean>>({});

  // Deletion confirmation overlay state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "product" | "variant" | null;
    productId: string;
    variantIndex: number | null;
    title: string;
  }>({
    isOpen: false,
    type: null,
    productId: "",
    variantIndex: null,
    title: "",
  });

  // Dynamic products load
  useEffect(() => {
    setProducts([...mockProducts]);
  }, []);

  // Main Form States
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("all");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [material, setMaterial] = useState("Metal Alloy");
  const [dimensions, setDimensions] = useState("Medium");
  const [weight, setWeight] = useState("170g");
  const [shippingInfo, setShippingInfo] = useState("Available for immediate shipment");
  const [frameType, setFrameType] = useState("Full-Rim");
  const [lensType, setLensType] = useState("UV400 Protection, Anti-Scratch");
  const [warranty, setWarranty] = useState("1-year warranty");
  const [countryOfOrigin, setCountryOfOrigin] = useState("France");
  const [targetAudience, setTargetAudience] = useState("Unisex, Luxury Seekers");
  const [careInstructions, setCareInstructions] = useState("Clean lenses with a microfiber cloth.");
  const [isFeatured, setIsFeatured] = useState(false);

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Variants List for current product
  const [variantsList, setVariantsList] = useState<TVariant[]>([]);

  // Sub-Form States for Variant Builder
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  const [varTitle, setVarTitle] = useState("");
  const [varColor, setVarColor] = useState("#232323");
  const [varMainPrice, setVarMainPrice] = useState("");
  const [varDiscountPercent, setVarDiscountPercent] = useState("0");
  const [varQuantity, setVarQuantity] = useState("");
  const [varProductCode, setVarProductCode] = useState("");
  const [varShortDescription, setVarShortDescription] = useState("");
  const [varImgList, setVarImgList] = useState<{ image: string; id: string }[]>([]);

  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zod Schemas
  const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    brand: z.string().min(2, "Brand is required."),
    category: z.string().min(1, "Category is required."),
    shortDescription: z.string().min(5, "Short description is required."),
  });

  const variantSchema = z.object({
    title: z.string().min(2, "Variant title must be specified."),
    color: z.string().min(4, "Color hex is required."),
    mainPrice: z.number().positive("Price must be positive."),
    discountPercent: z.number().min(0).max(100, "Discount range is 0-100%."),
    quantity: z.number().int().nonnegative("Quantity cannot be negative."),
    productCode: z.string().min(3, "Product code (SKU) is required."),
  });

  const toggleExpand = (prodId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [prodId]: !prev[prodId],
    }));
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setTitle("");
    setBrand("Elite Styles");
    setCategory("all");
    setShortDescription("");
    setLongDescription("");
    setMaterial("Metal Alloy");
    setDimensions("Medium");
    setWeight("170g");
    setShippingInfo("Available for immediate shipment");
    setFrameType("Full-Rim");
    setLensType("UV400 Protection, Anti-Scratch");
    setWarranty("1-year warranty for manufacturing defects");
    setCountryOfOrigin("France");
    setTargetAudience("Unisex, Luxury Seekers");
    setCareInstructions("Store in a protective case. Clean lenses with a microfiber cloth.");
    setIsFeatured(false);

    setVariantsList([]);
    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setFormErrors({});
    setIsOpenModal(true);
  };

  const handleOpenEdit = (p: TProduct) => {
    setEditingProduct(p);
    setTitle(p.title);
    setBrand(p.brand || "Elite Styles");
    setCategory(p.category || "all");
    setShortDescription(p.shortDescription || "");
    setLongDescription(p.longDescription || "");
    setMaterial(p.material || "Metal Alloy");
    setDimensions(p.dimensions || "Medium");
    setWeight(p.weight || "170g");
    setShippingInfo(p.shippingInfo || "Available for immediate shipment");
    setFrameType(p.frameType || "Full-Rim");
    setLensType(p.lensType || "UV400 Protection");
    setWarranty(p.warranty || "1-year warranty");
    setCountryOfOrigin(p.countryOfOrigin || "France");
    setTargetAudience(p.targetAudience || "Unisex");
    setCareInstructions(p.careInstructions || "Clean lenses with a microfiber cloth.");
    setIsFeatured(!!p.isFeatured);

    setVariantsList([...p.variants]);
    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setFormErrors({});
    setIsOpenModal(true);
  };

  // Variant Form Handlers
  const handleOpenAddVariant = () => {
    setEditingVariantIndex(null);
    setVarTitle("");
    setVarColor("#232323");
    setVarMainPrice("");
    setVarDiscountPercent("0");
    setVarQuantity("");
    setVarProductCode(`GP-${Math.floor(1000 + Math.random() * 9000)}`);
    setVarShortDescription("");
    setVarImgList([]);
    setUrlInput("");
    setFormErrors({});
    setShowVariantForm(true);
  };

  const handleOpenEditVariant = (index: number) => {
    const v = variantsList[index];
    setEditingVariantIndex(index);
    setVarTitle(v.title);
    setVarColor(v.color);
    setVarMainPrice(v.mainPrice.toString());
    setVarDiscountPercent(v.discountPercent.toString());
    setVarQuantity(v.quantity.toString());
    setVarProductCode(v.productCode);
    setVarShortDescription(v.shortDescription || "");
    setVarImgList([...v.imgList]);
    setUrlInput("");
    setFormErrors({});
    setShowVariantForm(true);
  };

  const handleSaveVariant = (e: React.MouseEvent) => {
    e.preventDefault();
    const dataToValidate = {
      title: varTitle,
      color: varColor,
      mainPrice: Number(varMainPrice),
      discountPercent: Number(varDiscountPercent),
      quantity: Number(varQuantity),
      productCode: varProductCode,
    };

    const valResult = variantSchema.safeParse(dataToValidate);
    if (!valResult.success) {
      const errors: Record<string, string> = {};
      valResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[`variant_${err.path[0].toString()}`] = err.message;
        }
      });
      setFormErrors((prev) => ({ ...prev, ...errors }));
      toast.error("Variant Validation Error", {
        description: "Please check all fields inside the variant editor.",
      });
      return;
    }

    const calculatedPriceAfterDiscount = Math.round(
      Number(varMainPrice) * (1 - Number(varDiscountPercent) / 100)
    );

    const finalImgList =
      varImgList.length > 0
        ? varImgList
        : [
            {
              id: `${varProductCode}-img-default`,
              image: "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png",
            },
          ];

    const targetVariant: TVariant = {
      id: editingVariantIndex !== null ? variantsList[editingVariantIndex].id : `VAR-${Math.floor(100 + Math.random() * 900)}`,
      title: varTitle,
      color: varColor,
      mainPrice: Number(varMainPrice),
      discountPercent: Number(varDiscountPercent),
      priceAfterDiscount: calculatedPriceAfterDiscount,
      inStock: Number(varQuantity) > 0,
      quantity: Number(varQuantity),
      productCode: varProductCode,
      shortDescription: varShortDescription || `${varTitle} eyewear frame edition.`,
      imgList: finalImgList,
    };

    if (editingVariantIndex !== null) {
      const updated = [...variantsList];
      updated[editingVariantIndex] = targetVariant;
      setVariantsList(updated);
      toast.success("Variant Updated", { description: `${varTitle} variant changes applied.` });
    } else {
      setVariantsList([...variantsList, targetVariant]);
      toast.success("Variant Created", { description: `${varTitle} variant added to listing builder.` });
    }

    setShowVariantForm(false);
    setEditingVariantIndex(null);
  };

  // Triggers deletion warning modal
  const triggerDeleteProduct = (prodId: string, titleStr: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: "product",
      productId: prodId,
      variantIndex: null,
      title: titleStr,
    });
  };

  const triggerDeleteVariant = (index: number, titleStr: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: "variant",
      productId: "",
      variantIndex: index,
      title: titleStr,
    });
  };

  // Confirmed execution of deletion
  const executeDelete = () => {
    if (deleteConfirm.type === "product") {
      const updated = products.filter((p) => p.id !== deleteConfirm.productId);
      setProducts(updated);
      saveProductsToStorage(updated);
      toast.success("Product Deleted", {
        description: `"${deleteConfirm.title}" listing has been deleted.`,
      });
    } else if (deleteConfirm.type === "variant" && deleteConfirm.variantIndex !== null) {
      const updated = variantsList.filter((_, i) => i !== deleteConfirm.variantIndex);
      setVariantsList(updated);
      toast.success("Variant Removed", {
        description: `"${deleteConfirm.title}" variant removed from temporary listing.`,
      });
    }
    setDeleteConfirm({ isOpen: false, type: null, productId: "", variantIndex: null, title: "" });
  };

  // Mock File Upload Simulation
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((old) => {
        if (old >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const simulatedUrl = URL.createObjectURL(file);
            setVarImgList((prev) => [
              ...prev,
              {
                id: `IMG-${Math.floor(1000 + Math.random() * 9000)}`,
                image: simulatedUrl,
              },
            ]);
            setIsUploading(false);
            setUploadProgress(0);
            toast.success("Image Uploaded", {
              description: `Uploaded ${file.name} successfully. (Simulated URL preview)`,
            });
          }, 450);
          return 100;
        }
        return old + Math.floor(15 + Math.random() * 20);
      });
    }, 150);
  };

  const handleAddUrlImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setVarImgList((prev) => [
      ...prev,
      {
        id: `IMG-${Math.floor(1000 + Math.random() * 9000)}`,
        image: urlInput.trim(),
      },
    ]);
    setUrlInput("");
    toast.success("External Image Added", { description: "Image link attached." });
  };

  const handleRemoveVariantImg = (imgId: string) => {
    setVarImgList((prev) => prev.filter((img) => img.id !== imgId));
  };

  // Main Submit Handler
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const mainVal = productSchema.safeParse({
      title,
      brand,
      category,
      shortDescription,
    });

    if (!mainVal.success) {
      const errors: Record<string, string> = {};
      mainVal.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      toast.error("Form Validation Error", {
        description: "Please check standard product fields.",
      });
      return;
    }

    if (variantsList.length === 0) {
      toast.error("Missing Variants", {
        description: "A product must have at least one variant configuration.",
      });
      return;
    }

    const primaryVar = variantsList[0];
    const totalStock = variantsList.reduce((acc, v) => acc + v.quantity, 0);
    const anyInStock = totalStock > 0;
    const finalMainPrice = primaryVar.mainPrice;
    const finalDiscountPercent = primaryVar.discountPercent;
    const finalPriceAfterDiscount = primaryVar.priceAfterDiscount;
    const finalColor = primaryVar.color;
    const finalImg = primaryVar.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png";

    if (editingProduct) {
      // EDIT MODE
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            title,
            brand,
            category,
            shortDescription,
            longDescription,
            material,
            dimensions,
            weight,
            shippingInfo,
            frameType,
            lensType,
            warranty,
            countryOfOrigin,
            targetAudience,
            careInstructions,
            isFeatured,
            img: finalImg,
            color: finalColor,
            mainPrice: finalMainPrice,
            discountPercent: finalDiscountPercent.toString(),
            priceAfterDiscount: finalPriceAfterDiscount,
            inStock: anyInStock,
            variants: variantsList,
          };
        }
        return p;
      });

      setProducts(updated);
      saveProductsToStorage(updated);
      toast.success("Product Updated", {
        description: `${title} has been updated with ${variantsList.length} variants.`,
      });
    } else {
      // CREATE MODE
      const newId = (products.length + 1).toString();
      const newProduct: TProduct = {
        id: newId,
        title,
        brand,
        category,
        shortDescription,
        longDescription,
        material,
        dimensions,
        weight,
        shippingInfo,
        frameType,
        lensType,
        warranty,
        countryOfOrigin,
        targetAudience,
        careInstructions,
        isFeatured,
        img: finalImg,
        color: finalColor,
        mainPrice: finalMainPrice,
        discountPercent: finalDiscountPercent.toString(),
        priceAfterDiscount: finalPriceAfterDiscount,
        inStock: anyInStock,
        reviews: [],
        variants: variantsList,
      };

      const updated = [newProduct, ...products];
      setProducts(updated);
      saveProductsToStorage(updated);
      toast.success("Product Created", {
        description: `${title} collection listing added to database catalog.`,
      });
    }

    setIsOpenModal(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Products Catalog
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure eyewear products, custom multi-variants, pricing tiers, and inventories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by model, brand, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add Eyewear</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4 w-10"></th>
              <th className="p-4">Frame Model</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Total Stock</th>
              <th className="p-4">Starting Price</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground bg-card/25">
                  No products found matching &quot;{searchTerm}&quot;.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const totalStock = p.variants?.reduce((acc, v) => acc + v.quantity, 0) || 0;
                const isExpanded = !!expandedProducts[p.id];
                const activeColor = p.color || "#ccc";

                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleExpand(p.id)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded border border-border bg-muted overflow-hidden flex-shrink-0">
                          <Image
                            src={p.img || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-foreground">
                              {p.title}
                            </p>
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 bg-yellow-400/10 text-yellow-500 rounded text-[9px] font-bold flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2 items-center text-[10px] text-muted-foreground font-medium">
                            <span className="font-mono">ID: {p.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ backgroundColor: activeColor }}
                              />
                              {p.variants?.length || 0} variant(s)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-muted-foreground">
                        {p.brand}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-muted text-[10px] font-bold rounded text-foreground capitalize">
                          {p.category || "all"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        {totalStock > 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">
                            {totalStock} units
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-md">Out of Stock</span>
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-primary">
                        ৳{p.priceAfterDiscount ?? p.mainPrice}
                      </td>
                      <td className="p-4 flex justify-center gap-1.5 mt-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                          title="Edit product specs & variants"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerDeleteProduct(p.id, p.title)}
                          className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"
                          title="Delete catalog item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Collapsible Nested Variants row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-muted/10 p-4 border-l-2 border-primary">
                          <div className="space-y-3">
                            <div className="flex items-center gap-1 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                              <Package className="w-3.5 h-3.5" />
                              <span>Variant Stock Specifications</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {p.variants?.map((v) => (
                                <div
                                  key={v.id}
                                  className="glass-panel p-3 rounded-xl border border-border flex items-center gap-3 bg-card"
                                >
                                  <div className="relative w-12 h-12 rounded overflow-hidden border border-border bg-muted flex-shrink-0">
                                    <Image
                                      src={v.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"}
                                      alt={v.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0 text-xs">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-extrabold text-foreground truncate">
                                        {v.title}
                                      </span>
                                      <span
                                        className="w-3 h-3 rounded-full border border-border shadow-sm"
                                        style={{ backgroundColor: v.color }}
                                      />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground font-mono mb-1">
                                      Code: {v.productCode}
                                    </p>
                                    <div className="flex justify-between items-center text-[11px]">
                                      <span className="font-bold text-primary">৳{v.priceAfterDiscount}</span>
                                      <span
                                        className={`font-bold ${
                                          v.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
                                        }`}
                                      >
                                        {v.quantity} in stock
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card text-card-foreground p-6 rounded-2xl relative z-10 border border-border shadow-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto max-h-[90vh]"
            >
              {/* Form Side */}
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2 mb-2">
                  <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <Package className="w-5 h-5" />
                  </span>
                  <span>{editingProduct ? `Edit Eyewear: ${title}` : "Create Premium Eyewear"}</span>
                </h3>

                <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
                  {/* Name and Brand */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">
                        Frame Model Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Horizon Premium Aviator"
                        className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {formErrors.title && <span className="text-red-500 text-[10px]">{formErrors.title}</span>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">
                        Brand Manufacturer
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="e.g. Elite Styles"
                        className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {formErrors.brand && <span className="text-red-500 text-[10px]">{formErrors.brand}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">
                        Category Selection
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                      >
                        <option value="all">General (All)</option>
                        <option value="aviator">Aviator Classic</option>
                        <option value="wayfarer">Wayfarer Retro</option>
                        <option value="luxury">Luxury Style</option>
                        <option value="optical">Optical Frame</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">
                        Featured Status
                      </label>
                      <div className="flex items-center h-8">
                        <input
                          id="prod_featured"
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_featured" className="ml-2 font-bold text-foreground cursor-pointer">
                          Featured listing on homepage
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">
                      Short Catalog Tagline
                    </label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="e.g. A luxury frame that exudes sophistication."
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {formErrors.shortDescription && <span className="text-red-500 text-[10px]">{formErrors.shortDescription}</span>}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">
                      Long Editorial Description
                    </label>
                    <textarea
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={3}
                      placeholder="Purple Horizon sunglasses are the epitome of luxury..."
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-3 gap-3 text-[10px]">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Material</label>
                      <input
                        type="text"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Dimensions</label>
                      <input
                        type="text"
                        value={dimensions}
                        onChange={(e) => setDimensions(e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Weight</label>
                      <input
                        type="text"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-2 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Shipping Info</label>
                      <input
                        type="text"
                        value={shippingInfo}
                        onChange={(e) => setShippingInfo(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Frame Tech</label>
                      <input
                        type="text"
                        value={frameType}
                        onChange={(e) => setFrameType(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Lens Coatings</label>
                      <input
                        type="text"
                        value={lensType}
                        onChange={(e) => setLensType(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Warranty</label>
                      <input
                        type="text"
                        value={warranty}
                        onChange={(e) => setWarranty(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                      />
                    </div>
                  </div>
                </form>
              </div>

                {/* Variants builder column */}
                <div className="lg:col-span-6 space-y-4 border-t lg:border-t-0 lg:border-l border-border lg:pl-6 pt-6 lg:pt-0">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider">
                      Product Variant Builder ({variantsList.length})
                    </h4>
                    {!showVariantForm && (
                      <button
                        type="button"
                        onClick={handleOpenAddVariant}
                        className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-span text-[10px] font-extrabold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Variant</span>
                      </button>
                    )}
                  </div>

                  {/* Inline Variant Form Drawer */}
                  <AnimatePresence mode="wait">
                    {showVariantForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl border border-primary/20 bg-muted/20 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                            {editingVariantIndex !== null ? "Edit Variant Details" : "Configure New Variant"}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowVariantForm(false)}
                            className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Variant Name</label>
                            <input
                              type="text"
                              value={varTitle}
                              onChange={(e) => setVarTitle(e.target.value)}
                              placeholder="e.g. Classic Black"
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                            {formErrors.variant_title && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_title}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Frame Color Hex</label>
                            <div className="flex gap-1 items-center">
                              <input
                                type="color"
                                value={varColor}
                                onChange={(e) => setVarColor(e.target.value)}
                                className="w-7 h-7 rounded border border-border bg-background cursor-pointer p-0"
                              />
                              <input
                                type="text"
                                value={varColor}
                                onChange={(e) => setVarColor(e.target.value)}
                                className="flex-1 min-w-0 px-2 py-1.5 border border-border rounded-lg bg-background text-foreground font-mono"
                              />
                            </div>
                            {formErrors.variant_color && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_color}</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Original Price</label>
                            <input
                              type="number"
                              value={varMainPrice}
                              onChange={(e) => setVarMainPrice(e.target.value)}
                              placeholder="1200"
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                            {formErrors.variant_mainPrice && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_mainPrice}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Discount %</label>
                            <input
                              type="number"
                              value={varDiscountPercent}
                              onChange={(e) => setVarDiscountPercent(e.target.value)}
                              placeholder="20"
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                            {formErrors.variant_discountPercent && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_discountPercent}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Stock Qty</label>
                            <input
                              type="number"
                              value={varQuantity}
                              onChange={(e) => setVarQuantity(e.target.value)}
                              placeholder="10"
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                            {formErrors.variant_quantity && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_quantity}</span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">SKU Code</label>
                            <input
                              type="text"
                              value={varProductCode}
                              onChange={(e) => setVarProductCode(e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground font-mono uppercase"
                            />
                            {formErrors.variant_productCode && (
                              <span className="text-red-500 text-[9px] block">{formErrors.variant_productCode}</span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-muted-foreground">Short Note</label>
                            <input
                              type="text"
                              value={varShortDescription}
                              onChange={(e) => setVarShortDescription(e.target.value)}
                              placeholder="Luxury black frame coating."
                              className="w-full px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                          </div>
                        </div>

                        {/* Image Upload Simulator for Variant */}
                        <div className="space-y-2 text-xs border-t border-border pt-3">
                          <span className="font-bold text-muted-foreground block mb-1">
                            Variant Image Gallery ({varImgList.length})
                          </span>

                          {/* Image preview grid */}
                          {varImgList.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {varImgList.map((imgObj) => (
                                <div
                                  key={imgObj.id}
                                  className="relative w-12 h-12 rounded border border-border overflow-hidden group bg-muted"
                                >
                                  <Image src={imgObj.image} alt="preview" fill className="object-cover" />
                                  <button
                                    onClick={() => handleRemoveVariantImg(imgObj.id)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Controls for adding image */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              placeholder="Or paste external image URL..."
                              className="flex-1 px-2.5 py-1.5 border border-border rounded-lg bg-background text-foreground"
                            />
                            <button
                              type="button"
                              onClick={handleAddUrlImage}
                              className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg font-bold text-foreground text-[10px] border border-border cursor-pointer"
                            >
                              Add URL
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              type="button"
                              disabled={isUploading}
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full py-2 border-2 border-dashed border-border hover:border-primary rounded-xl flex items-center justify-center gap-1.5 text-muted-foreground hover:text-primary font-semibold transition-all cursor-pointer bg-background"
                            >
                              {isUploading ? (
                                <div className="flex flex-col items-center w-full px-4">
                                  <span className="text-[10px] font-black text-muted-foreground mb-1">
                                    Simulating Server Upload... {uploadProgress}%
                                  </span>
                                  <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full transition-all duration-150"
                                      style={{ width: `${uploadProgress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Simulate Mock File Upload</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Sub-form actions */}
                        <div className="flex gap-2 justify-end pt-2 border-t border-border">
                          <button
                            type="button"
                            onClick={() => setShowVariantForm(false)}
                            className="px-3 py-1.5 bg-background hover:bg-muted text-foreground rounded-lg font-bold border border-border cursor-pointer"
                          >
                            Discard
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveVariant}
                            className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Variant</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Variant Cards Listing */}
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {variantsList.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <Package className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[11px] font-bold">No Variants Added Yet</span>
                        <span className="text-[9px] text-muted-foreground">
                          You must configure at least one variant configuration to list this eyewear.
                        </span>
                      </div>
                    ) : (
                      variantsList.map((v, index) => (
                        <div
                          key={v.id}
                          className="glass-panel p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded border border-border overflow-hidden bg-muted">
                              <Image
                                src={v.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"}
                                alt={v.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-foreground">
                                  {v.title}
                                </span>
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-border shadow-sm"
                                  style={{ backgroundColor: v.color }}
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                SKU: {v.productCode} • Qty: {v.quantity} units
                              </p>
                              <p className="text-[10px] text-primary font-bold">
                                ৳{v.priceAfterDiscount} <span className="text-muted-foreground line-through font-normal">৳{v.mainPrice}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditVariant(index)}
                              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerDeleteVariant(index, v.title)}
                              className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Submission and Close buttons */}
                  <div className="flex gap-2 justify-end pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setIsOpenModal(false)}
                      className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold transition-colors cursor-pointer border border-border"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitProduct}
                      className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-primary/15"
                    >
                      {editingProduct ? "Save All Changes" : "Save Eyewear Listing"}
                    </button>
                  </div>
                </div>

              {/* Top Close Button */}
              <button
                onClick={() => setIsOpenModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm({ isOpen: false, type: null, productId: "", variantIndex: null, title: "" })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card text-card-foreground border border-border p-6 rounded-2xl relative z-10 max-w-sm w-full space-y-4 shadow-xl text-xs"
            >
              <h3 className="text-base font-bold text-foreground">Confirm Deletion</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete {deleteConfirm.type === "product" ? `the product listing "${deleteConfirm.title}"` : `the variant "${deleteConfirm.title}"`}? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, type: null, productId: "", variantIndex: null, title: "" })}
                  className="px-3 py-2 bg-background hover:bg-muted text-foreground font-semibold rounded-lg border border-border transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-red-600/10"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
