/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Plus,
  Search,
  UploadCloud,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Clock,
  Tag,
  Loader2,
  X,
  AlertTriangle,
  Smartphone,
  Monitor,
} from "lucide-react";
import {
  useGetAllBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  IBanner,
} from "@/redux/features/banner/bannerApi";
import { uploadImageToImgBB } from "@/lib/uploadImageToImgBB";

export default function BannersView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("EXCLUSIVE DROP");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("/product-filter");
  const [buttonText, setButtonText] = useState("Explore Collection");
  const [discountTag, setDiscountTag] = useState("UP TO 40% OFF");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
  const [order, setOrder] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<string>("");

  // Uploading states
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Preview Mode
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { data: bannersData, isLoading } = useGetAllBannersQuery({
    search: searchTerm || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const banners = bannersData?.data || [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setBadge("EXCLUSIVE DROP");
    setDescription("");
    setImageUrl("");
    setMobileImageUrl("");
    setLinkUrl("/product-filter");
    setButtonText("Explore Collection");
    setDiscountTag("UP TO 40% OFF");
    setStatus("ACTIVE");
    setOrder(0);
    setExpiryDate("");
    setEditingBanner(null);
    setUploadError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (banner: IBanner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setBadge(banner.badge || "");
    setDescription(banner.description || "");
    setImageUrl(banner.imageUrl);
    setMobileImageUrl(banner.mobileImageUrl || "");
    setLinkUrl(banner.linkUrl);
    setButtonText(banner.buttonText || "Explore Collection");
    setDiscountTag(banner.discountTag || "");
    setStatus(banner.status);
    setOrder(banner.order || 0);
    setExpiryDate(banner.expiryDate ? new Date(banner.expiryDate).toISOString().split("T")[0] : "");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File, isMobile = false) => {
    try {
      setUploadError(null);
      if (isMobile) {
        setIsUploadingMobile(true);
      } else {
        setIsUploadingDesktop(true);
      }

      const url = await uploadImageToImgBB(file);
      if (isMobile) {
        setMobileImageUrl(url);
      } else {
        setImageUrl(url);
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please verify ImgBB configuration.");
    } finally {
      if (isMobile) {
        setIsUploadingMobile(false);
      } else {
        setIsUploadingDesktop(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl || !linkUrl) {
      setUploadError("Please provide Title, Desktop Banner Image, and Destination Link.");
      return;
    }

    const payload: Partial<IBanner> = {
      title,
      subtitle: subtitle || undefined,
      badge: badge || undefined,
      description: description || undefined,
      imageUrl,
      mobileImageUrl: mobileImageUrl || undefined,
      linkUrl,
      buttonText: buttonText || "Explore Collection",
      discountTag: discountTag || undefined,
      status,
      order: Number(order) || 0,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null,
    };

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner.id, body: payload }).unwrap();
      } else {
        await createBanner(payload).unwrap();
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setUploadError(err?.data?.message || err.message || "Failed to save banner");
    }
  };

  const handleToggleStatus = async (banner: IBanner) => {
    const nextStatus = banner.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await updateBanner({ id: banner.id, body: { status: nextStatus } }).unwrap();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBanner(deleteId).unwrap();
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight">Promotional Banners</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#007C74]/15 text-[#007C74] border border-[#007C74]/30">
              Landing Showcase
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Manage high-impact hero, promo, and promotional banners displayed across the storefront.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#007C74] to-[#00A693] text-white font-bold text-xs shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Banner</span>
        </button>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, badge, subtitle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex rounded-xl p-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold w-full sm:w-auto">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? "bg-white dark:bg-neutral-900 text-[#007C74] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {tab === "ALL" ? "All Banners" : tab === "ACTIVE" ? "Active Only" : "Inactive"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 animate-pulse border border-neutral-200 dark:border-neutral-800"
            />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <Layers className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
          <h3 className="text-sm font-bold text-neutral-700 dark:text-neutral-300">No Banners Found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Get started by creating your first dynamic promotional banner with custom images, tags, and links.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-4 px-4 py-2 bg-[#007C74] text-white rounded-xl text-xs font-bold hover:brightness-110 cursor-pointer"
          >
            Create Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group relative bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-[#007C74]/50 transition-all flex flex-col justify-between"
            >
              {/* Banner Image Preview Container */}
              <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                    Order #{banner.order}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer backdrop-blur-md border transition-all ${
                      banner.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    }`}
                  >
                    {banner.status === "ACTIVE" ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                  {banner.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-[#007C74] text-white mb-1 shadow-xs">
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-white line-clamp-1 drop-shadow-md">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-xs text-neutral-300 line-clamp-1">{banner.subtitle}</p>
                  )}
                </div>
              </div>

              {/* Banner Details Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-[#007C74]" />
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      {banner.discountTag || "Special Feature"}
                    </span>
                  </div>
                  <Link
                    href={banner.linkUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-[#007C74] hover:underline font-mono text-[11px]"
                  >
                    <span className="truncate max-w-[120px]">{banner.linkUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </Link>
                </div>

                {banner.expiryDate && (
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>Expires: {new Date(banner.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteId(banner.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-lg font-bold">
                  {editingBanner ? "Edit Promotional Banner" : "Create Promotional Banner"}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload images and customize how this banner appears on the storefront.
                </p>
              </div>

              {uploadError && (
                <div className="p-3 mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                      <span>Desktop Image (16:9 or 21:9)*</span>
                      {isUploadingDesktop && (
                        <span className="text-[10px] text-[#007C74] flex items-center gap-1 font-mono">
                          <Loader2 className="w-3 h-3 animate-spin" /> Optimizing WebP...
                        </span>
                      )}
                    </label>

                    <input
                      type="file"
                      ref={desktopInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, false);
                      }}
                    />

                    {imageUrl ? (
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group">
                        <Image src={imageUrl} alt="Desktop Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => desktopInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/90 text-neutral-900 text-xs font-bold cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageUrl("")}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => desktopInputRef.current?.click()}
                        disabled={isUploadingDesktop}
                        className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-[#007C74] dark:hover:border-[#007C74] flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-[#007C74] transition-colors cursor-pointer"
                      >
                        <UploadCloud className="w-8 h-8" />
                        <span className="text-xs font-semibold">Click to upload desktop banner</span>
                        <span className="text-[10px] text-neutral-400">Auto-converts to WebP via ImgBB</span>
                      </button>
                    )}
                  </div>

                  {/* Mobile Image (Optional) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                      <span>Mobile Image (Optional 9:16 or 4:5)</span>
                      {isUploadingMobile && (
                        <span className="text-[10px] text-[#007C74] flex items-center gap-1 font-mono">
                          <Loader2 className="w-3 h-3 animate-spin" /> Optimizing WebP...
                        </span>
                      )}
                    </label>

                    <input
                      type="file"
                      ref={mobileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, true);
                      }}
                    />

                    {mobileImageUrl ? (
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 group">
                        <Image src={mobileImageUrl} alt="Mobile Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => mobileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/90 text-neutral-900 text-xs font-bold cursor-pointer"
                          >
                            Replace
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileImageUrl("")}
                            className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => mobileInputRef.current?.click()}
                        disabled={isUploadingMobile}
                        className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-[#007C74] dark:hover:border-[#007C74] flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-[#007C74] transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-8 h-8" />
                        <span className="text-xs font-semibold">Click to upload mobile banner</span>
                        <span className="text-[10px] text-neutral-400">Falls back to desktop if not set</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Banner Title*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Titanium Precision Aviator Series"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Crafted in Swiss High-Index Optics"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Badge / Pill Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LIMITED EDITION, NEW DROP"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Discount / Offer Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UP TO 40% OFF"
                      value={discountTag}
                      onChange={(e) => setDiscountTag(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Destination Link URL*
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /product-filter?category=sunglasses or /best-sellers"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Button CTA Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Collection"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Display Order Priority
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                      Expiry Countdown Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1 block">
                    Description Paragraph
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short description highlighting the collection, materials, or limited offer..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007C74]/40"
                  />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <p className="text-xs font-bold">Publish Status</p>
                    <p className="text-[11px] text-neutral-500">
                      When active, this banner will be live on the storefront homepage.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStatus(status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      status === "ACTIVE"
                        ? "bg-emerald-500 text-white shadow-xs"
                        : "bg-neutral-300 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {status === "ACTIVE" ? "Active (Live)" : "Inactive (Draft)"}
                  </button>
                </div>

                {/* Submit Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isCreating || isUpdating || isUploadingDesktop || isUploadingMobile}
                    className="px-5 py-2.5 rounded-xl bg-[#007C74] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {(isCreating || isUpdating) && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{editingBanner ? "Update Banner" : "Create Banner"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Delete Banner?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to delete this promotional banner? This action cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Delete Permanently</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
