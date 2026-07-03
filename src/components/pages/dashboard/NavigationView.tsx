/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Menu, 
  Pencil, 
  Loader2, 
  Save, 
  X,
  GripVertical
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetAllNavbarMenusQuery,
  useCreateNavbarMenuMutation,
  useUpdateNavbarMenuMutation,
  useDeleteNavbarMenuMutation,
  useReorderNavbarMenusMutation
} from "@/redux/features/navbar/navbarApi";

type ChildMenu = {
  chieldMenuTitle: string;
};

type SubMenu = {
  subMenuTitle: string;
  imageUrl: string;
  descriptions?: string;
  chieldMenu: ChildMenu[];
};

type TNavbarMenu = {
  id: string;
  menu: string;
  imageUrl?: string;
  href: string;
  subMenu: SubMenu[];
  order: number;
};
const getCategorySlugOrHref = (menuName: string): string => {
  const m = menuName.toLowerCase().trim();
  // Map to the DB-stored category value (must match what products have in their categories array)
  if (m === "optical glasses" || m === "optical") return "/product-filter?category=optical glasses";
  if (m === "contact lens" || m === "contact-lens" || m === "contact lenses") return "/product-filter?category=contact-lens";
  if (m === "accessories") return "/product-filter?category=accessories";
  if (m === "sunglasses") return "/product-filter?category=sunglasses";
  if (m === "clearance sale" || m === "sale") return "/product-filter?sale=true";
  if (m === "new arrivals") return "/product-filter?category=New Arrivals";
  if (m === "blogs") return "/blogs";
  if (m === "brands") return "/brands";
  return `/product-filter?category=${encodeURIComponent(menuName)}`;
};

export default function NavigationView() {
  const { data, isLoading, isFetching } = useGetAllNavbarMenusQuery(undefined);
  const menus = (data?.data || []) as TNavbarMenu[];

  const [createMenu, { isLoading: isCreating }] = useCreateNavbarMenuMutation();
  const [updateMenu, { isLoading: isUpdating }] = useUpdateNavbarMenuMutation();
  const [deleteMenu, { isLoading: isDeleting }] = useDeleteNavbarMenuMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<TNavbarMenu | null>(null);
  
  // Form State
  const [menu, setMenu] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [href, setHref] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [subMenu, setSubMenu] = useState<SubMenu[]>([]);

  const hrefAutoGenRef = useRef(true);

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; name: string }>({ 
    isOpen: false, 
    id: "", 
    name: "" 
  });

  // Drag-and-Drop State
  const [localMenus, setLocalMenus] = useState<TNavbarMenu[]>([]);
  const [orderChanged, setOrderChanged] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragStartIndexRef = useRef<number | null>(null);

  const [reorderMenus, { isLoading: isReordering }] = useReorderNavbarMenusMutation();

  useEffect(() => {
    const sorted = [...menus].sort((a, b) => a.order - b.order);
    setLocalMenus(sorted);
    setOrderChanged(false);
  }, [menus]);

  const handleDragStart = (_e: React.DragEvent, index: number) => {
    dragStartIndexRef.current = index;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const fromIndex = dragStartIndexRef.current;
    if (fromIndex === null || fromIndex === index) return;

    const newMenus = [...localMenus];
    const [movedItem] = newMenus.splice(fromIndex, 1);
    newMenus.splice(index, 0, movedItem);
    setLocalMenus(newMenus.map((item, i) => ({ ...item, order: i + 1 })));
    dragStartIndexRef.current = index;
    setDraggedIndex(index);
    setOrderChanged(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragStartIndexRef.current = null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedIndex(null);
    dragStartIndexRef.current = null;
  };

  const handleResetOrder = () => {
    const sorted = [...menus].sort((a, b) => a.order - b.order);
    setLocalMenus(sorted);
    setOrderChanged(false);
  };

  const handleSaveOrder = async () => {
    try {
      await reorderMenus(
        localMenus.map((item) => ({ id: item.id, order: item.order }))
      ).unwrap();
      toast.success("Navigation order saved successfully!");
      setOrderChanged(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save navigation order");
    }
  };

  const handleOpenAdd = () => {
    setEditingMenu(null);
    setMenu("");
    setImageUrl("");
    setHref("");
    hrefAutoGenRef.current = true;
    setOrder(menus.length + 1);
    setSubMenu([]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TNavbarMenu) => {
    setEditingMenu(m);
    setMenu(m.menu);
    setImageUrl(m.imageUrl || "");
    setHref(m.href || "");
    setOrder(m.order);
    setSubMenu(m.subMenu ? JSON.parse(JSON.stringify(m.subMenu)) : []);
    setIsModalOpen(true);
  };

  const handleAddSubMenu = () => {
    setSubMenu([...subMenu, { subMenuTitle: "", imageUrl: "", descriptions: "", chieldMenu: [] }]);
  };

  const handleRemoveSubMenu = (index: number) => {
    setSubMenu(subMenu.filter((_, i) => i !== index));
  };

  const handleSubMenuChange = (index: number, field: keyof SubMenu, value: any) => {
    const updated = [...subMenu];
    updated[index] = { ...updated[index], [field]: value };
    setSubMenu(updated);
  };

  const handleAddChildMenu = (subMenuIndex: number) => {
    const updated = [...subMenu];
    updated[subMenuIndex].chieldMenu = [...updated[subMenuIndex].chieldMenu, { chieldMenuTitle: "" }];
    setSubMenu(updated);
  };

  const handleRemoveChildMenu = (subMenuIndex: number, childIndex: number) => {
    const updated = [...subMenu];
    updated[subMenuIndex].chieldMenu = updated[subMenuIndex].chieldMenu.filter((_, i) => i !== childIndex);
    setSubMenu(updated);
  };

  const handleChildMenuChange = (subMenuIndex: number, childIndex: number, value: string) => {
    const updated = [...subMenu];
    updated[subMenuIndex].chieldMenu[childIndex].chieldMenuTitle = value;
    setSubMenu(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menu.trim()) return toast.error("Menu title is required");
    if (!href.trim()) return toast.error("Navigation link is required");

    const payload = {
      menu: menu.trim(),
      imageUrl: imageUrl.trim() || undefined,
      href: href.trim(),
      order: Number(order),
      subMenu,
    };

    try {
      if (editingMenu) {
        await updateMenu({ id: editingMenu.id, ...payload }).unwrap();
        toast.success("Navbar menu updated successfully!");
      } else {
        await createMenu(payload).unwrap();
        toast.success("Navbar menu created successfully!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save navbar menu");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMenu(deleteConfirm.id).unwrap();
      toast.success(`${deleteConfirm.name} deleted successfully!`);
      setDeleteConfirm({ isOpen: false, id: "", name: "" });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete navbar menu");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Navbar Menu Manager
          </h1>
          <p className="text-xs text-neutral-500">
            Configure dynamic category dropdowns and reorder custom navigation options.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#007C74]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Menu</span>
        </button>
      </div>

      {/* Unsaved Order Banner */}
      <AnimatePresence>
        {orderChanged && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                You have unsaved reorder changes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetOrder}
                className="px-3 py-1.5 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-[10px] font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={isReordering}
                className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#007C74] hover:bg-[#006059] text-white text-[10px] font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isReordering ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Order</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl">
        {isLoading || isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#007C74]" />
            <p className="text-xs font-bold">Retrieving navbar configuration...</p>
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 space-y-4">
            <Menu className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-white">No Custom Menus</h3>
              <p className="text-xs max-w-xs mx-auto">
                Dynamic menus seeded from DB initiation or added manually will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-extrabold uppercase tracking-wider">
                  <th className="pb-4 font-black">Sort Order</th>
                  <th className="pb-4 font-black">Menu Name</th>
                  <th className="pb-4 font-black">Route Link</th>
                  <th className="pb-4 font-black">Submenus</th>
                  <th className="pb-4 text-right font-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900 font-medium">
                {localMenus.map((item, index) => (
                  <tr
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={handleDrop}
                    className={`hover:bg-neutral-500/5 transition-colors ${draggedIndex === index ? 'opacity-40' : ''} cursor-default`}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-[#007C74] transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </span>
                        <span className="inline-flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 h-6 px-2.5 rounded-lg text-[10px] font-extrabold">
                          {item.order}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm font-extrabold text-neutral-900 dark:text-white">
                      {item.menu}
                    </td>
                    <td className="py-4 text-neutral-500 font-mono text-[10px]">
                      {item.href}
                    </td>
                    <td className="py-4 text-neutral-500">
                      {item.subMenu?.length > 0 ? (
                        <span className="text-[#007C74] font-bold">
                          {item.subMenu.length} sections
                        </span>
                      ) : (
                        <span className="text-neutral-400">Direct Link</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-[#007C74] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: item.id, name: item.menu })}
                          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-neutral-150 dark:border-neutral-900 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                    {editingMenu ? `Edit Navbar Menu: ${editingMenu.menu}` : "Create Custom Navbar Menu"}
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Define catalog columns, sub-menus, search tags, and imagery.
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="flex-grow p-6 overflow-y-auto space-y-6 slim-scroll">
                
                {/* Basic Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
                      Menu Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunglasses"
                      value={menu}
                      onChange={(e) => {
                        setMenu(e.target.value);
                        if (!editingMenu && hrefAutoGenRef.current) {
                          const val = e.target.value.trim();
                          setHref(val ? getCategorySlugOrHref(val) : "");
                        }
                      }}
                      className="dashboard-input text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
                      Nav Route Link
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /product-filter?category=sunglasses"
                      value={href}
                      onChange={(e) => {
                        hrefAutoGenRef.current = false;
                        setHref(e.target.value);
                      }}
                      className="dashboard-input text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
                      Display Banner Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="dashboard-input text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-neutral-400">
                      Sort Order Order
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="dashboard-input text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Nested Sub-menus Section */}
                <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-neutral-500">
                        Sub-Menu Categories
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        Dropdown columns grouping filters or subcategories.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSubMenu}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-[#007C74]/10 hover:text-[#007C74] dark:bg-neutral-850 dark:hover:bg-[#007C74]/20 dark:hover:text-[#007C74] rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {subMenu.map((sub, sIdx) => (
                      <div 
                        key={sIdx} 
                        className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800 rounded-xl space-y-4 relative group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveSubMenu(sIdx)}
                          className="absolute top-4 right-4 p-1 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">
                              Sub-Menu Title
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Men's Sunglasses"
                              value={sub.subMenuTitle}
                              onChange={(e) => handleSubMenuChange(sIdx, "subMenuTitle", e.target.value)}
                              className="dashboard-input text-xs font-bold bg-white dark:bg-neutral-900"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">
                              Section Image URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={sub.imageUrl}
                              onChange={(e) => handleSubMenuChange(sIdx, "imageUrl", e.target.value)}
                              className="dashboard-input text-xs bg-white dark:bg-neutral-900"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">
                            Description
                          </label>
                          <textarea
                            placeholder="Optional marketing info..."
                            value={sub.descriptions || ""}
                            onChange={(e) => handleSubMenuChange(sIdx, "descriptions", e.target.value)}
                            className="dashboard-input text-xs bg-white dark:bg-neutral-900 min-h-[50px] resize-y"
                          />
                        </div>

                        {/* Child Links tag list */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase tracking-wider font-bold text-neutral-400">
                              Child Filter Actions
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddChildMenu(sIdx)}
                              className="flex items-center gap-1 text-[8px] uppercase tracking-wider font-black text-[#007C74] hover:text-[#006059] transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Link</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {sub.chieldMenu?.map((child, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pl-2.5 pr-1 py-1 rounded-lg">
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Sports"
                                  value={child.chieldMenuTitle}
                                  onChange={(e) => handleChildMenuChange(sIdx, cIdx, e.target.value)}
                                  className="w-full bg-transparent focus:outline-none text-[10px] font-bold text-neutral-800 dark:text-neutral-250"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChildMenu(sIdx, cIdx)}
                                  className="p-1 hover:bg-red-500/10 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </form>

              {/* Modal Footer */}
              <div className="p-6 border-t border-neutral-150 dark:border-neutral-900 flex justify-end gap-3 bg-neutral-50 dark:bg-neutral-950">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isCreating || isUpdating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isCreating || isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editingMenu ? "Update Menu" : "Create Menu"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Alert */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl w-full max-w-sm text-center space-y-6 shadow-2xl"
            >
              <div className="space-y-2">
                <h3 className="text-base font-black text-neutral-900 dark:text-white">
                  Remove Navbar Menu?
                </h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to delete <span className="font-extrabold text-neutral-900 dark:text-white">&quot;{deleteConfirm.name}&quot;</span>? This will instantly remove it from the store storefront navbar navigation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
                  className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
