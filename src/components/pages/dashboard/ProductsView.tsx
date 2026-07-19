/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
  Package,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image";
import { TProduct, TVariant } from "@/types/types";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useLazyGenerateSKUQuery,
} from "@/redux/features/product/productApi";
import { useGetAllNavbarMenusQuery } from "@/redux/features/navbar/navbarApi";
import { Select } from "antd";
import { MultiSelect } from "@/components/ui/multi-select";

export default function ProductsView() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isFetching } = useGetAllProductsQuery({ page: currentPage, limit });
  const products: TProduct[] = (data?.data || []) as TProduct[];
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [addVariant] = useAddVariantMutation();
  const [updateVariant] = useUpdateVariantMutation();
  const [deleteVariant] = useDeleteVariantMutation();
  const [triggerGenerateSKU, { isFetching: isGeneratingSKU }] = useLazyGenerateSKUQuery();

  // Fetch a DB-verified unique SKU from the backend
  const fetchSKUFromBackend = async (categoryHint?: string): Promise<string> => {
    try {
      const result = await triggerGenerateSKU(categoryHint || categories[0] || "").unwrap();
      return (result as any)?.data?.sku || (result as any)?.sku || "";
    } catch {
      return "";
    }
  };

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
    variantId: string;
    title: string;
  }>({
    isOpen: false,
    type: null,
    productId: "",
    variantId: "",
    title: "",
  });

  // Main Form States
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const { data: navbarData } = useGetAllNavbarMenusQuery(undefined);

  const categoryOptions = useMemo(() => {
    const navbarMenus = ((navbarData?.data || []) as any[]);
    return navbarMenus
      .filter((m: any) => m.menu && m.menu !== "Brands" && m.menu !== "Blogs")
      .map((m: any) => ({ label: m.menu, value: m.menu.toLowerCase() }));
  }, [navbarData]);

  const selectedNavMenus = useMemo(() => {
    const navbarMenus = ((navbarData?.data || []) as any[]);
    return navbarMenus.filter((m: any) =>
      categories.includes(m.menu?.toLowerCase())
    );
  }, [navbarData, categories]);

  const subCategoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: { label: string; value: string }[] = [];
    for (const menu of selectedNavMenus) {
      for (const sub of menu.subMenu || []) {
        if (sub.subMenuTitle && !seen.has(sub.subMenuTitle)) {
          seen.add(sub.subMenuTitle);
          opts.push({ label: sub.subMenuTitle, value: sub.subMenuTitle });
        }
      }
    }
    subCategories.forEach((sc) => {
      if (sc && !seen.has(sc)) {
        seen.add(sc);
        opts.push({ label: sc, value: sc });
      }
    });
    return opts;
  }, [selectedNavMenus, subCategories]);

  const typeOptions = useMemo(() => {
    const seen = new Set<string>();
    const opts: { label: string; value: string }[] = [];
    for (const menu of selectedNavMenus) {
      for (const sub of menu.subMenu || []) {
        if (subCategories.includes(sub.subMenuTitle)) {
          for (const child of sub.chieldMenu || []) {
            if (child.chieldMenuTitle && !seen.has(child.chieldMenuTitle)) {
              seen.add(child.chieldMenuTitle);
              opts.push({ label: child.chieldMenuTitle, value: child.chieldMenuTitle });
            }
          }
        }
      }
    }
    types.forEach((t) => {
      if (t && !seen.has(t)) {
        seen.add(t);
        opts.push({ label: t, value: t });
      }
    });
    return opts;
  }, [selectedNavMenus, subCategories, types]);

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
  const [videoUrl, setVideoUrl] = useState("");
  const [showPrescriptionLenses, setShowPrescriptionLenses] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [salePercentage, setSalePercentage] = useState("0");

  // Form Validation Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Variants List for current product (staging area)
  const [variantsList, setVariantsList] = useState<TVariant[]>([]);

  // Sub-Form States for Variant Builder
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);

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

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod Schemas
  const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    brand: z.string().min(2, "Brand is required."),
    category: z.array(z.string()).min(1, "At least one category is required."),
    shortDescription: z.string().min(5, "Short description is required."),
  });

  const variantSchema = z.object({
    title: z.string().min(2, "Variant title must be specified."),
    color: z.string().min(4, "Color hex is required."),
    mainPrice: z.number().positive("Price must be positive."),
    discountPercent: z.number().min(0).max(100, "Discount range is 0-100%."),
    quantity: z.number().int().nonnegative("Quantity cannot be negative."),
    // productCode is optional — backend auto-generates a DB-unique SKU if blank
    productCode: z.string().optional(),
  });

  const toggleExpand = (prodId: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [prodId]: !prev[prodId],
    }));
  };

  const resetProductForm = () => {
    setTitle("");
    setBrand("Elite Styles");
    setCategories([]);
    setSubCategories([]);
    setTypes([]);
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
    setVideoUrl("");
    setShowPrescriptionLenses(true);
    setIsFeatured(false);
    setIsNewArrival(false);
    setIsBestSeller(false);
    setIsTrending(false);
    setSalePercentage("0");
    setVariantsList([]);
    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setEditingVariantId(null);
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    resetProductForm();
    setIsOpenModal(true);
  };

  const handleOpenEdit = (p: TProduct) => {
    setEditingProduct(p);
    setTitle(p.title);
    setBrand(p.brand || "Elite Styles");
    setCategories(p.categories || []);
    setSubCategories(p.subCategories || []);
    setTypes(p.types || []);
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
    setVideoUrl(p.videoUrl || "");
    setShowPrescriptionLenses(p.showPrescriptionLenses !== false);
    setIsFeatured(!!p.isFeatured);
    setIsNewArrival(!!p.isNewArrival);
    setIsBestSeller(!!p.isBestSeller);
    setIsTrending(!!p.isTrending);
    setSalePercentage(p.salePercentage?.toString() || "0");
    setVariantsList([...p.variants]);
    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setEditingVariantId(null);
    setFormErrors({});
    setIsOpenModal(true);
  };

  // Variant Form Handlers
  const handleOpenAddVariant = async () => {
    setEditingVariantIndex(null);
    setEditingVariantId(null);
    setVarTitle("");
    setVarColor("");
    setVarMainPrice("");
    setVarDiscountPercent("0");
    setVarQuantity("");
    setVarProductCode(""); // will be filled by backend below
    setVarShortDescription("");
    setVarImgList([]);
    setUrlInput("");
    setFormErrors({});
    setShowVariantForm(true);
    // Fetch a guaranteed-unique SKU from the backend
    const sku = await fetchSKUFromBackend(categories[0]);
    if (sku) setVarProductCode(sku);
  };

  const handleOpenEditVariant = (index: number) => {
    const v = variantsList[index];
    setEditingVariantIndex(index);
    setEditingVariantId(v.id);
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
      id: editingVariantId || `VAR-${Math.floor(100 + Math.random() * 900)}`,
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
      toast.success("Variant Staged", { description: `${varTitle} variant changes staged.` });
    } else {
      setVariantsList([...variantsList, targetVariant]);
      toast.success("Variant Added", { description: `${varTitle} variant added to listing.` });
    }

    setShowVariantForm(false);
    setEditingVariantIndex(null);
    setEditingVariantId(null);
  };

  // For existing saved products, we can delete a variant immediately via API
  const triggerDeleteVariant = (index: number, varId: string, titleStr: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: "variant",
      productId: editingProduct?.id || "",
      variantId: varId,
      title: titleStr,
    });
  };

  const triggerDeleteProduct = (prodId: string, titleStr: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: "product",
      productId: prodId,
      variantId: "",
      title: titleStr,
    });
  };

  const executeDelete = async () => {
    if (deleteConfirm.type === "product") {
      try {
        await deleteProduct(deleteConfirm.productId).unwrap();
        toast.success("Product Deleted", {
          description: `"${deleteConfirm.title}" listing has been deleted.`,
        });
      } catch {
        toast.error("Failed to delete product");
      }
    } else if (deleteConfirm.type === "variant" && deleteConfirm.productId && deleteConfirm.variantId) {
      try {
        await deleteVariant({
          productId: deleteConfirm.productId,
          variantId: deleteConfirm.variantId,
        }).unwrap();
        // Also remove from local staging list
        setVariantsList((prev) => prev.filter((v) => v.id !== deleteConfirm.variantId));
        toast.success("Variant Deleted", {
          description: `"${deleteConfirm.title}" variant removed.`,
        });
      } catch {
        toast.error("Failed to delete variant");
      }
    } else {
      // Local-only staged variant (no ID in DB yet)
      setVariantsList((prev) => prev.filter((_, i) => i !== editingVariantIndex));
      toast.success("Variant Removed", { description: `Staged variant removed.` });
    }
    setDeleteConfirm({ isOpen: false, type: null, productId: "", variantId: "", title: "" });
  };

  // Image upload
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
              { id: `IMG-${Math.floor(1000 + Math.random() * 9000)}`, image: simulatedUrl },
            ]);
            setIsUploading(false);
            setUploadProgress(0);
            toast.success("Image Uploaded", { description: `Uploaded ${file.name} successfully.` });
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
      { id: `IMG-${Math.floor(1000 + Math.random() * 9000)}`, image: urlInput.trim() },
    ]);
    setUrlInput("");
    toast.success("External Image Added", { description: "Image link attached." });
  };

  const handleRemoveVariantImg = (imgId: string) => {
    setVarImgList((prev) => prev.filter((img) => img.id !== imgId));
  };

  // Main Submit Handler
  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const mainVal = productSchema.safeParse({ title, brand, category: categories, shortDescription });
    if (!mainVal.success) {
      const errors: Record<string, string> = {};
      mainVal.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      toast.error("Form Validation Error", { description: "Please check standard product fields." });
      return;
    }

    if (variantsList.length === 0) {
      toast.error("Missing Variants", {
        description: "A product must have at least one variant configuration.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const productPayload = {
        title, brand, categories: categories.length > 0 ? categories : undefined,
        subCategories: subCategories.length > 0 ? subCategories : undefined,
        types: types.length > 0 ? types : undefined, shortDescription, longDescription,
        material, dimensions, weight, shippingInfo, frameType,
        lensType, warranty, countryOfOrigin, targetAudience,
        careInstructions, videoUrl: videoUrl || null, showPrescriptionLenses, isFeatured, isNewArrival, isBestSeller, isTrending,
        salePercentage: Number(salePercentage) || 0,
      };

      if (editingProduct) {
        // Update product fields
        await updateProduct({ id: editingProduct.id, ...productPayload }).unwrap();

        // Sync variants: find new vs existing
        const existingIds = new Set(editingProduct.variants.map((v) => v.id));
        const newVariants = variantsList.filter((v) => !existingIds.has(v.id));
        const updatedVariants = variantsList.filter((v) => existingIds.has(v.id));

        // Add new variants
        for (const v of newVariants) {
          const { id: _id, ...variantData } = v;
          await addVariant({ productId: editingProduct.id, ...variantData }).unwrap();
        }
        // Update existing variants
        for (const v of updatedVariants) {
          const { id, ...variantData } = v;
          await updateVariant({ productId: editingProduct.id, variantId: id, ...variantData }).unwrap();
        }

        toast.success("Product Updated", {
          description: `${title} has been updated with ${variantsList.length} variant(s).`,
        });
      } else {
        // Create product with all variants at once
        const variantsPayload = variantsList.map(({ id: _id, ...v }) => v);
        await createProduct({ ...productPayload, variants: variantsPayload }).unwrap();
        toast.success("Product Created", {
          description: `${title} collection listing added to catalog.`,
        });
      }

      setIsOpenModal(false);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error("Operation Failed", {
        description: error?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.categories && p.categories.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())))
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

      {/* ── Desktop Table ── */}
      <div className="hidden md:block glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
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
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground bg-card/25">
                  {searchTerm ? `No products found matching "${searchTerm}".` : 'No products yet. Click "Add Eyewear" to get started.'}
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const totalStock = p.variants?.reduce((acc, v) => acc + v.quantity, 0) || 0;
                const isExpanded = !!expandedProducts[p.id];
                const activeColor = p.color || "#ccc";
                const displayImg = p.variants?.[0]?.imgList?.[0]?.image || p.img || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png";
                const displayPrice = p.variants?.[0]?.priceAfterDiscount ?? p.priceAfterDiscount ?? p.mainPrice;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-center">
                        <button onClick={() => toggleExpand(p.id)} className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors cursor-pointer">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded border border-border bg-muted overflow-hidden flex-shrink-0">
                          <Image src={displayImg} alt={p.title} fill className="object-cover" unoptimized />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-foreground">{p.title}</p>
                            {p.isFeatured && (<span className="px-1.5 py-0.5 bg-yellow-400/10 text-yellow-500 rounded text-[9px] font-bold flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5" /> Featured</span>)}
                          </div>
                          <div className="flex gap-2 items-center text-[10px] text-muted-foreground font-medium">
                            <span className="font-mono">ID: {p.id.slice(-8)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: activeColor }} />
                              {p.variants?.length || 0} variant(s)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-muted-foreground">{p.brand}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 bg-muted text-[10px] font-bold rounded text-foreground capitalize">
                          {p.categories?.length ? p.categories.slice(0, 2).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ") + (p.categories.length > 2 ? ` +${p.categories.length - 2}` : "") : "all"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        {totalStock > 0 ? (<span className="text-green-600 dark:text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-md">{totalStock} units</span>) : (<span className="text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-md">Out of Stock</span>)}
                      </td>
                      <td className="p-4 font-extrabold text-primary">৳{displayPrice?.toLocaleString()}</td>
                      <td className="p-4 flex justify-center gap-1.5 mt-2">
                        <button onClick={() => handleOpenEdit(p)} className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer" title="Edit product"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => triggerDeleteProduct(p.id, p.title)} className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-muted/10 p-4 border-l-2 border-primary">
                          <div className="space-y-3">
                            <div className="flex items-center gap-1 text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                              <Package className="w-3.5 h-3.5" />
                              <span>Variant Stock Specifications</span>
                            </div>
                            {p.variants?.length === 0 ? (
                              <p className="text-xs text-muted-foreground">No variants found for this product.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {p.variants?.map((v) => (
                                  <div key={v.id} className="glass-panel p-3 rounded-xl border border-border flex items-center gap-3 bg-card">
                                    <div className="relative w-12 h-12 rounded overflow-hidden border border-border bg-muted flex-shrink-0">
                                      <Image src={v.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"} alt={v.title} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1 min-w-0 text-xs">
                                      <div className="flex justify-between items-center mb-1">
                                        <span className="font-extrabold text-foreground truncate">{v.title}</span>
                                        <span className="w-3 h-3 rounded-full border border-border shadow-sm flex-shrink-0" style={{ backgroundColor: v.color }} />
                                      </div>
                                      <p className="text-[10px] text-muted-foreground font-mono mb-1">SKU: {v.productCode}</p>
                                      <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-primary">৳{v.priceAfterDiscount}</span>
                                        <span className={`font-bold ${v.quantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>{v.quantity} in stock</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {isLoading || isFetching ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-border p-8 text-center text-muted-foreground text-sm">
            {searchTerm ? `No products matching "${searchTerm}".` : 'No products yet. Tap "Add Eyewear" to get started.'}
          </div>
        ) : (
          filteredProducts.map((p) => {
            const totalStock = p.variants?.reduce((acc, v) => acc + v.quantity, 0) || 0;
            const isExpanded = !!expandedProducts[p.id];
            const displayImg = p.variants?.[0]?.imgList?.[0]?.image || p.img || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png";
            const displayPrice = p.variants?.[0]?.priceAfterDiscount ?? p.priceAfterDiscount ?? p.mainPrice;
            return (
              <div key={p.id} className="glass-panel rounded-2xl border border-border overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 p-4">
                  <div className="relative w-14 h-14 rounded-xl border border-border bg-muted overflow-hidden flex-shrink-0">
                    <Image src={displayImg} alt={p.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-foreground truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleOpenEdit(p)} className="p-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => triggerDeleteProduct(p.id, p.title)} className="p-2 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.categories?.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 bg-muted rounded text-[10px] font-bold capitalize">{c}</span>
                      ))}
                      {totalStock > 0
                        ? <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded text-[10px] font-bold">{totalStock} units</span>
                        : <span className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold">Out of Stock</span>
                      }
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-extrabold">৳{displayPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                {/* Expand variants */}
                <button
                  onClick={() => toggleExpand(p.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border text-[11px] font-bold text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {p.variants?.length || 0} Variant(s)</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isExpanded && p.variants && p.variants.length > 0 && (
                  <div className="p-3 border-t border-border bg-muted/10 space-y-2">
                    {p.variants.map(v => (
                      <div key={v.id} className="flex items-center gap-3 bg-card rounded-xl border border-border p-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border bg-muted flex-shrink-0">
                          <Image src={v.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"} alt={v.title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="flex justify-between">
                            <span className="font-bold truncate">{v.title}</span>
                            <span className="w-3 h-3 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: v.color }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground font-mono">SKU: {v.productCode}</p>
                          <div className="flex justify-between text-[11px] mt-0.5">
                            <span className="font-bold text-primary">৳{v.priceAfterDiscount}</span>
                            <span className={v.quantity > 0 ? "text-green-600 dark:text-green-400 font-bold" : "text-red-500 font-bold"}>{v.quantity} in stock</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="glass-panel rounded-2xl border border-border flex items-center justify-between px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages} ({totalItems} total)
          </p>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)); }}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <PaginationItem>
                        <span className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === p}
                        onClick={(e) => { e.preventDefault(); setCurrentPage(p); }}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)); }}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsOpenModal(false)}
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

                <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs" id="product-form">
                  {/* Name and Brand */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Frame Model Title</label>
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
                      <label className="font-bold text-muted-foreground">Brand Manufacturer</label>
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

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Category / Collection</label>
                      <Select
                        mode="multiple"
                        value={categories}
                        onChange={(vals) => { setCategories(vals); setSubCategories([]); setTypes([]); }}
                        options={categoryOptions.map((o) => ({ label: o.label, value: o.value }))}
                        placeholder="Select categories..."
                        className="w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!min-h-[42px] [&_.ant-select-selector]:!py-0.5 [&_.ant-select-selection-placeholder]:!text-muted-foreground [&_.ant-select-selection-placeholder]:!text-sm"
                        size="large"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Sub-Category</label>
                      <Select
                        mode="multiple"
                        value={subCategories}
                        onChange={(vals) => { setSubCategories(vals); setTypes([]); }}
                        options={subCategoryOptions.map((o) => ({ label: o.label, value: o.value }))}
                        placeholder={subCategoryOptions.length === 0 ? "Select category first" : "Select sub-categories..."}
                        disabled={subCategoryOptions.length === 0}
                        className="w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!min-h-[42px] [&_.ant-select-selector]:!py-0.5 [&_.ant-select-selection-placeholder]:!text-muted-foreground [&_.ant-select-selection-placeholder]:!text-sm"
                        size="large"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Type</label>
                      <Select
                        mode="multiple"
                        value={types}
                        onChange={setTypes}
                        options={typeOptions.map((o) => ({ label: o.label, value: o.value }))}
                        placeholder={typeOptions.length === 0 ? "Select sub-category first" : "Select types..."}
                        disabled={typeOptions.length === 0}
                        className="w-full [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-border [&_.ant-select-selector]:!shadow-none [&_.ant-select-selector]:!min-h-[42px] [&_.ant-select-selector]:!py-0.5 [&_.ant-select-selection-placeholder]:!text-muted-foreground [&_.ant-select-selection-placeholder]:!text-sm"
                        size="large"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Product Flags</label>
                      <div className="flex items-center h-9 gap-2">
                        <input
                          id="prod_featured"
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_featured" className="font-bold text-foreground cursor-pointer">
                          Featured listing on homepage
                        </label>
                      </div>
                      <div className="flex items-center h-9 gap-2">
                        <input
                          id="prod_newarrival"
                          type="checkbox"
                          checked={isNewArrival}
                          onChange={(e) => setIsNewArrival(e.target.checked)}
                          className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_newarrival" className="font-bold text-foreground cursor-pointer">
                          New Arrival
                        </label>
                      </div>
                      <div className="flex items-center h-9 gap-2">
                        <input
                          id="prod_bestseller"
                          type="checkbox"
                          checked={isBestSeller}
                          onChange={(e) => setIsBestSeller(e.target.checked)}
                          className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_bestseller" className="font-bold text-foreground cursor-pointer">
                          Best Seller
                        </label>
                      </div>
                       <div className="flex items-center h-9 gap-2">
                        <input
                          id="prod_trending"
                          type="checkbox"
                          checked={isTrending}
                          onChange={(e) => setIsTrending(e.target.checked)}
                          className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_trending" className="font-bold text-foreground cursor-pointer">
                          Trending
                        </label>
                      </div>
                      <div className="flex items-center h-9 gap-2">
                        <input
                          id="prod_show_prescription"
                          type="checkbox"
                          checked={showPrescriptionLenses}
                          onChange={(e) => setShowPrescriptionLenses(e.target.checked)}
                          className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                        />
                        <label htmlFor="prod_show_prescription" className="font-bold text-foreground cursor-pointer">
                          Enable Custom Prescription Lenses
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Sale Percentage (%)</label>
                      <input
                        type="number"
                        value={salePercentage}
                        onChange={(e) => setSalePercentage(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Short Description</label>
                    <textarea
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="A concise product summary for listings."
                    />
                    {formErrors.shortDescription && (
                      <span className="text-red-500 text-[10px]">{formErrors.shortDescription}</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Long Description (Optional)</label>
                    <textarea
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      placeholder="Extended editorial-style product copy."
                    />
                  </div>

                  {/* Technical Details */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Material</label>
                      <input value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Frame Type</label>
                      <input value={frameType} onChange={(e) => setFrameType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Weight</label>
                      <input value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Lens Type</label>
                      <input value={lensType} onChange={(e) => setLensType(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Warranty</label>
                      <input value={warranty} onChange={(e) => setWarranty(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Country of Origin</label>
                      <input value={countryOfOrigin} onChange={(e) => setCountryOfOrigin(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-muted-foreground">Target Audience</label>
                      <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">Care Instructions</label>
                    <input value={careInstructions} onChange={(e) => setCareInstructions(e.target.value)} className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-muted-foreground">YouTube Video URL (Optional)</label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </form>
              </div>

              {/* Variant Side */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-foreground flex items-center gap-2">
                    <span className="p-1 bg-primary/10 rounded text-primary">
                      <Package className="w-4 h-4" />
                    </span>
                    Variants ({variantsList.length})
                  </h4>
                  {!showVariantForm && (
                    <button
                      onClick={handleOpenAddVariant}
                      className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Variant
                    </button>
                  )}
                </div>

                {/* Staged Variants List */}
                {variantsList.length > 0 && !showVariantForm && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {variantsList.map((v, idx) => (
                      <div
                        key={v.id || idx}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20 text-xs"
                      >
                        <div className="relative w-9 h-9 rounded overflow-hidden border border-border bg-muted flex-shrink-0">
                          <Image
                            src={v.imgList?.[0]?.image || "https://i.ibb.co.com/jkktXJFP/Chat-GPT-Image-Apr-4-2025-03-18-44-PM.png"}
                            alt={v.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-foreground truncate">{v.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{v.productCode} · ৳{v.priceAfterDiscount} · {v.quantity} pcs</p>
                        </div>
                        <span className="w-3 h-3 rounded-full border border-border flex-shrink-0" style={{ backgroundColor: v.color }} />
                        <button
                          onClick={() => handleOpenEditVariant(idx)}
                          className="p-1.5 bg-background hover:bg-muted text-foreground rounded-lg border border-border cursor-pointer transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => triggerDeleteVariant(idx, v.id, v.title)}
                          className="p-1.5 bg-background hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Variant Form */}
                {showVariantForm && (
                  <div className="space-y-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-primary">
                        {editingVariantIndex !== null ? "Edit Variant" : "New Variant"}
                      </h5>
                      <button
                        onClick={() => { setShowVariantForm(false); setEditingVariantIndex(null); }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1 col-span-2">
                        <label className="font-bold text-muted-foreground">Variant Title</label>
                        <input
                          value={varTitle}
                          onChange={(e) => setVarTitle(e.target.value)}
                          placeholder="e.g. Midnight Black Edition"
                          className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {formErrors.variant_title && <span className="text-red-500 text-[10px]">{formErrors.variant_title}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Frame Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={varColor}
                            onChange={(e) => setVarColor(e.target.value)}
                            className="w-10 h-9 rounded-lg border border-border cursor-pointer bg-background"
                          />
                          <input
                            value={varColor}
                            onChange={(e) => setVarColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-muted-foreground">SKU / Product Code</label>
                          <span className="text-[10px] text-muted-foreground italic">Auto-generated if empty</span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={varProductCode}
                            onChange={(e) => setVarProductCode(e.target.value)}
                            placeholder="Generating unique SKU..."
                            className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-xs"
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              const sku = await fetchSKUFromBackend(categories[0]);
                              if (sku) setVarProductCode(sku);
                            }}
                            disabled={isGeneratingSKU}
                            title="Fetch a new unique SKU from server"
                            className="px-3 py-2 text-xs font-bold rounded-xl border border-[#007C74]/40 text-[#007C74] hover:bg-[#007C74]/10 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                          >
                            {isGeneratingSKU
                              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                              : <>&#8635; Generate</>}
                          </button>
                        </div>
                        {formErrors.variant_productCode && <span className="text-red-500 text-[10px]">{formErrors.variant_productCode}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Base Price (৳)</label>
                        <input
                          type="number"
                          value={varMainPrice}
                          onChange={(e) => setVarMainPrice(e.target.value)}
                          placeholder="e.g. 3500"
                          className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {formErrors.variant_mainPrice && <span className="text-red-500 text-[10px]">{formErrors.variant_mainPrice}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Discount (%)</label>
                        <input
                          type="number"
                          value={varDiscountPercent}
                          onChange={(e) => setVarDiscountPercent(e.target.value)}
                          placeholder="0"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Stock Quantity</label>
                        <input
                          type="number"
                          value={varQuantity}
                          onChange={(e) => setVarQuantity(e.target.value)}
                          placeholder="e.g. 25"
                          min="0"
                          className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {formErrors.variant_quantity && <span className="text-red-500 text-[10px]">{formErrors.variant_quantity}</span>}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-muted-foreground">Short Description</label>
                        <input
                          value={varShortDescription}
                          onChange={(e) => setVarShortDescription(e.target.value)}
                          placeholder="Optional variant tagline"
                          className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">Variant Images</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="Paste image URL..."
                          className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          onClick={handleAddUrlImage}
                          className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl border border-border cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-2 bg-muted hover:bg-muted/80 text-foreground text-xs font-bold rounded-xl border border-border cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} />
                      </div>

                      {isUploading && (
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-150 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}

                      {varImgList.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {varImgList.map((img) => (
                            <div key={img.id} className="relative w-12 h-12 rounded-lg overflow-hidden border border-border bg-muted group">
                              <Image src={img.image} alt="variant img" fill className="object-cover" unoptimized />
                              <button
                                onClick={() => handleRemoveVariantImg(img.id)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                              >
                                <X className="w-3 h-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {varMainPrice && (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl px-3 py-2 text-xs text-primary font-bold">
                        Final Price: ৳{Math.round(Number(varMainPrice) * (1 - Number(varDiscountPercent) / 100)).toLocaleString()}
                        {Number(varDiscountPercent) > 0 && (
                          <span className="ml-2 text-muted-foreground font-normal line-through text-[10px]">৳{Number(varMainPrice).toLocaleString()}</span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={handleSaveVariant}
                      className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {editingVariantIndex !== null ? "Update Variant" : "Add Variant to List"}
                    </button>
                  </div>
                )}

                {variantsList.length === 0 && !showVariantForm && (
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-xs text-muted-foreground">
                    <Package className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">No variants yet</p>
                    <p className="text-[10px] mt-0.5">At least one variant is required to publish a product.</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-2 justify-end pt-2 border-t border-border mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpenModal(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="product-form"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15 disabled:opacity-60 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingProduct ? "Save Product" : "Create Product"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm({ isOpen: false, type: null, productId: "", variantId: "", title: "" })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card text-card-foreground border border-border p-6 rounded-2xl relative z-10 max-w-sm w-full space-y-4 shadow-xl text-xs"
            >
              <h3 className="text-base font-bold text-foreground">Confirm Deletion</h3>
              <p className="text-muted-foreground">
                {deleteConfirm.type === "product"
                  ? `Are you sure you want to permanently delete "${deleteConfirm.title}"? All variants will also be removed.`
                  : `Are you sure you want to delete the "${deleteConfirm.title}" variant?`}
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, type: null, productId: "", variantId: "", title: "" })}
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
