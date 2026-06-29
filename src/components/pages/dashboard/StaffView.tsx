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

  const handleDeleteStaff = (id: string, name: string) => {
    setStaff((prev) => prev.filter((stf) => stf.id !== id));
    toast.success("Staff Profile Deleted", {
      description: `${name} has been removed from control panels.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Staff Management</h1>
          <p className="text-xs text-neutral-500">Invite, configure, and monitor team profile access roles.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-[#007C74] hover:bg-[#006059] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-[#007c74]/10"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Name</th>
              <th className="p-4">Role Title</th>
              <th className="p-4">Access Level</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {staff.map((stf) => (
              <tr key={stf.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#007C74]" />
                    <span>{stf.name}</span>
                  </p>
                  <p className="text-[10px] text-neutral-400 font-medium">{stf.email}</p>
                </td>
                <td className="p-4 font-semibold text-neutral-600 dark:text-neutral-300">{stf.role}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 bg-neutral-150 dark:bg-neutral-800 text-[10px] font-bold rounded text-neutral-700 dark:text-neutral-355">
                    {stf.access}
                  </span>
                </td>
                <td className="p-4 flex justify-center gap-1.5">
                  <button
                    onClick={() => handleDeleteStaff(stf.id, stf.name)}
                    className="p-1.5 bg-neutral-100 hover:bg-red-500/10 dark:bg-neutral-800 dark:hover:bg-red-550/20 text-neutral-500 hover:text-red-550 dark:hover:text-red-400 rounded-lg border border-neutral-200 dark:border-neutral-850 transition-colors cursor-pointer"
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
              className="glass-panel max-w-sm w-full p-6 rounded-2xl relative z-10 space-y-4 border border-[#007C74]/25 shadow-2xl bg-white dark:bg-neutral-900"
            >
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#007C74]" />
                <span>Invite Team Member</span>
              </h3>
              
              <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                  />
                  {formErrors.name && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.name}</span>
                  )}
                </div>

                {/* Corporate Email */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Corporate Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. shakil@glassophite.com"
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
                  />
                  {formErrors.email && (
                    <span className="text-red-500 text-[10px] block mt-0.5">{formErrors.email}</span>
                  )}
                </div>

                {/* Role dropdown */}
                <div className="space-y-1">
                  <label className="font-bold text-neutral-600 dark:text-neutral-400 font-medium">Administrative Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-[#0c0c0c] focus:outline-none focus:ring-2 focus:ring-[#007C74]/50 text-neutral-900 dark:text-white"
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
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#007C74] hover:bg-[#006059] text-white font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-[#007c74]/15"
                  >
                    Invite Staff
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
