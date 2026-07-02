/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ExternalLink, Globe, ImageIcon, Pencil, Plus, Search, Star, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { slugify } from "@/lib/utils";
import {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/redux/features/brand/brandApi";

const brandSchema = z.object({
  name: z.string().min(2, "Brand name is required."),
  slug: z
    .string()
    .min(2, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  logoUrl: z.string().url("Logo URL must be valid."),
  tagline: z.string().min(8, "Tagline must be at least 8 characters."),
  description: z.string().min(30, "Description must be at least 30 characters."),
  origin: z.string().min(2, "Origin is required."),
  founded: z.string().min(4, "Founded year is required."),
  category: z.string().min(2, "Category is required."),
  status: z.enum(["Active", "Draft"]),
});

export default function BrandsView() {
  const { data, isLoading } = useGetAllBrandsQuery({});
  const brands = useMemo(() => (data?.data || []), [data]);
  const [createBrand] = useCreateBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: "", name: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("Dhaka, Bangladesh");
  const [founded, setFounded] = useState("2024");
  const [category, setCategory] = useState("Premium Frames");
  const [status, setStatus] = useState<"Active" | "Draft">("Active");
  const [featured, setFeatured] = useState(false);


  const filteredBrands = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(query) ||
        brand.category.toLowerCase().includes(query) ||
        brand.origin.toLowerCase().includes(query)
    );
  }, [brands, searchTerm]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setLogoUrl("https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80");
    setTagline("");
    setDescription("");
    setOrigin("Dhaka, Bangladesh");
    setFounded("2024");
    setCategory("Premium Frames");
    setStatus("Active");
    setFeatured(false);
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    setEditingBrand(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: any) => {
    setEditingBrand(brand);
    setName(brand.name);
    setSlug(brand.slug);
    setLogoUrl(brand.logoUrl);
    setTagline(brand.tagline);
    setDescription(brand.description);
    setOrigin(brand.origin);
    setFounded(brand.founded);
    setCategory(brand.category);
    setStatus(brand.status);
    setFeatured(brand.featured);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSaveBrand = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      slug: slugify(slug || name),
      logoUrl: logoUrl.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      origin: origin.trim(),
      founded: founded.trim(),
      category: category.trim(),
      status,
    };

    const validation = brandSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) errors[error.path[0].toString()] = error.message;
      });
      setFormErrors(errors);
      toast.error("Brand validation failed", {
        description: "Please correct the highlighted fields.",
      });
      return;
    }

    const duplicate = brands.some(
      (brand) =>
        brand.id !== editingBrand?.id &&
        (brand.slug === payload.slug || brand.name.toLowerCase() === payload.name.toLowerCase())
    );
    if (duplicate) {
      setFormErrors({ name: "Brand name or slug already exists." });
      toast.error("Duplicate brand");
      return;
    }

    if (editingBrand) {
      try {
        await updateBrand({ id: editingBrand.id, ...payload, featured }).unwrap();
        toast.success("Brand updated", { description: `${payload.name} has been saved.` });
      } catch { toast.error("Failed to update brand"); }
    } else {
      try {
        await createBrand({ ...payload, featured }).unwrap();
        toast.success("Brand created", { description: `${payload.name} is now available.` });
      } catch (err) {
        const error = err as { data?: { message?: string } };
        toast.error("Failed to create brand", { description: error?.data?.message || "Slug may already exist" });
      }
    }
    setIsModalOpen(false);
  };

  const executeDelete = async () => {
    try {
      await deleteBrand(deleteConfirm.id).unwrap();
      toast.success("Brand deleted", { description: `${deleteConfirm.name} has been removed.` });
    } catch { toast.error("Failed to delete brand"); }
    setDeleteConfirm({ isOpen: false, id: "", name: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Brands</h1>
          <p className="text-xs text-muted-foreground">
            Manage brand profiles, storefront visibility, logos, and product-filter entry points.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search brand, category, origin..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Brand</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">Total Brands</p>
          <p className="text-2xl font-extrabold mt-1">{brands.length}</p>
        </div>
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">Active</p>
          <p className="text-2xl font-extrabold mt-1">{brands.filter((brand) => brand.status === "Active").length}</p>
        </div>
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">Featured</p>
          <p className="text-2xl font-extrabold mt-1">{brands.filter((brand) => brand.featured).length}</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Brand</th>
              <th className="p-4">Category</th>
              <th className="p-4">Origin</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground bg-card/25">
                  No brands found.
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr key={brand.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="p-1.5 bg-primary/10 rounded-lg text-primary mt-0.5">
                        <Tag className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-extrabold text-foreground">{brand.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">/{brand.slug}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{brand.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-primary">{brand.category}</td>
                  <td className="p-4 text-muted-foreground font-semibold">{brand.origin}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${brand.status === "Active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground border border-border"}`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {brand.featured ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1.5">
                      <a
                        href={`/product-filter?brand=${encodeURIComponent(brand.name)}`}
                        className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        title="View filtered products"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(brand)}
                        className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        title="Edit brand"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ isOpen: true, id: brand.id, name: brand.name })}
                        className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"
                        title="Delete brand"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card text-card-foreground p-6 rounded-2xl relative z-10 space-y-4 border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto slim-scroll"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Star className="w-4 h-4" />
                </span>
                <span>{editingBrand ? "Edit Brand" : "Create Brand"}</span>
              </h3>

              <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Brand Name" error={formErrors.name}>
                    <input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        if (!editingBrand) setSlug(slugify(event.target.value));
                      }}
                      className="dashboard-input"
                      placeholder="Elite Styles"
                    />
                  </Field>
                  <Field label="Slug" error={formErrors.slug}>
                    <input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} className="dashboard-input font-mono" placeholder="elite-styles" />
                  </Field>
                </div>

                <Field label="Logo Image URL" error={formErrors.logoUrl}>
                  <div className="relative">
                    <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className="dashboard-input pl-9" />
                  </div>
                </Field>

                <Field label="Tagline" error={formErrors.tagline}>
                  <input value={tagline} onChange={(event) => setTagline(event.target.value)} className="dashboard-input" placeholder="Short brand promise" />
                </Field>

                <Field label="Description" error={formErrors.description}>
                  <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} className="dashboard-input resize-none" placeholder="Brand positioning, materials, and collection focus" />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Field label="Origin" error={formErrors.origin}>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input value={origin} onChange={(event) => setOrigin(event.target.value)} className="dashboard-input pl-9" />
                    </div>
                  </Field>
                  <Field label="Founded" error={formErrors.founded}>
                    <input value={founded} onChange={(event) => setFounded(event.target.value)} className="dashboard-input" />
                  </Field>
                  <Field label="Category" error={formErrors.category}>
                    <input value={category} onChange={(event) => setCategory(event.target.value)} className="dashboard-input" />
                  </Field>
                  <Field label="Status" error={formErrors.status}>
                    <select value={status} onChange={(event) => setStatus(event.target.value as "Active" | "Draft")} className="dashboard-input">
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </Field>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-4 w-4 rounded border-border" />
                  Feature this brand on the public brands page
                </label>

                <div className="flex gap-2 justify-end pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15">
                    {editingBrand ? "Save Changes" : "Save Brand"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteDialog
        isOpen={deleteConfirm.isOpen}
        body={`Are you sure you want to delete "${deleteConfirm.name}"? This will remove it from the storefront brand flow.`}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
        onDelete={executeDelete}
      />
    </motion.div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="font-bold text-muted-foreground">{label}</label>
      {children}
      {error && <span className="text-red-500 text-[10px] block mt-0.5">{error}</span>}
    </div>
  );
}

function DeleteDialog({
  isOpen,
  body,
  onCancel,
  onDelete,
}: {
  isOpen: boolean;
  body: string;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card text-card-foreground border border-border p-6 rounded-2xl relative z-10 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <h3 className="text-base font-bold text-foreground">Confirm Brand Deletion</h3>
            <p className="text-muted-foreground">{body}</p>
            <div className="flex gap-2 justify-end pt-2">
              <button onClick={onCancel} className="px-3 py-2 bg-background hover:bg-muted text-foreground font-semibold rounded-lg border border-border transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={onDelete} className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-red-600/10">
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
