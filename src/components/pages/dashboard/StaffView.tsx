"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Shield, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

// Mock Staff profiles
const initialStaff = [
  { id: "STF-301", name: "Saimun Sifat", role: "Super Admin", email: "sifat@glassophite.com", access: "Full Control" },
  { id: "STF-302", name: "Anika Tasnim", role: "Content Editor", email: "anika@glassophite.com", access: "Catalog Management" },
  { id: "STF-303", name: "Rezaul Karim", role: "Showroom Consultant", email: "karim@glassophite.com", access: "Support & Orders" },
];

export default function StaffView() {
  const [staff, setStaff] = useState(initialStaff);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Deletion confirmation overlay state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
  });

  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Content Editor");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const staffSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters."),
    email: z.string().email("Please insert a valid corporate email address."),
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToValidate = {
      name: newName,
      email: newEmail,
    };

    const validationResult = staffSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      toast.error("Form Validation Error", {
        description: "Please correct input errors.",
      });
      return;
    }

    let accessRights = "Catalog Management";
    if (newRole === "Super Admin") accessRights = "Full Control";
    if (newRole === "Support Agent") accessRights = "Support & Orders";
 
    const newMember = {
      id: `STF-${Math.floor(304 + Math.random() * 900)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      access: accessRights,
    };

    setStaff([newMember, ...staff]);
    toast.success("Team Member Added!", {
      description: `${newName} has been granted access.`,
    });

    setNewName("");
    setNewEmail("");
    setNewRole("Content Editor");
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  const triggerDeleteStaff = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      name,
    });
  };

  const executeDelete = () => {
    setStaff((prev) => prev.filter((stf) => stf.id !== deleteConfirm.id));
    toast.success("Staff Profile Deleted", {
      description: `"${deleteConfirm.name}" has been removed from control panels.`,
    });
    setDeleteConfirm({ isOpen: false, id: "", name: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Staff Management</h1>
          <p className="text-xs text-muted-foreground">Invite, configure, and monitor team profile access roles.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-primary/10"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Name</th>
              <th className="p-4">Role Title</th>
              <th className="p-4">Access Level</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staff.map((stf) => (
              <tr key={stf.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-foreground flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                    <span>{stf.name}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">{stf.email}</p>
                </td>
                <td className="p-4 font-semibold text-muted-foreground">{stf.role}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-muted text-[10px] font-bold rounded text-foreground border border-border">
                    {stf.access}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-1.5">
                  <button
                    onClick={() => triggerDeleteStaff(stf.id, stf.name)}
                    className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"
                    title="Revoke access"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
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
              className="bg-card text-card-foreground p-6 rounded-2xl relative z-10 space-y-4 border border-border shadow-2xl max-w-sm w-full"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Invite Team Member</span>
              </h3>
              
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground font-medium">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formErrors.name && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.name}</span>
                  )}
                </div>

                {/* Corporate Email */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground font-medium">Corporate Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. shakil@glassophite.com"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formErrors.email && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.email}</span>
                  )}
                </div>

                {/* Role dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground font-medium">Administrative Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Content Editor">Content Editor (Catalog Access)</option>
                    <option value="Support Agent">Support Agent (Orders/Tickets Access)</option>
                  </select>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15"
                  >
                    Invite Staff
                  </button>
                </div>
              </form>
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
              onClick={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
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
                Are you sure you want to delete the staff profile of &quot;{deleteConfirm.name}&quot;? This will revoke all dashboard privileges.
              </p>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setDeleteConfirm({ isOpen: false, id: "", name: "" })}
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
