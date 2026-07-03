"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Shield, UserPlus, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useGetAllUsersQuery, useUpdateUserStatusMutation } from "@/redux/features/user/userApi";
import { useRegisterStaffMutation } from "@/redux/features/auth/authApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const staffSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .optional()
    .or(z.literal("")),
});

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
};
const ROLE_ACCESS: Record<string, string> = {
  SUPER_ADMIN: "Full Control",
  ADMIN: "Catalog & Orders",
};

export default function StaffView() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;
  const { data, isLoading, isFetching } = useGetAllUsersQuery({ page: currentPage, limit });
  const totalItems = data?.meta?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [registerStaff] = useRegisterStaffMutation();

  const allStaff = useMemo(() => {
    const users = (data?.data || []) as any[];
    return users.filter((u: any) => u.role === "ADMIN" || u.role === "SUPER_ADMIN");
  }, [data]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = staffSchema.safeParse({ fullName: newName, email: newEmail, password: newPassword });
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFormErrors(errors);
      toast.error("Validation Error", { description: "Please fix the highlighted fields." });
      return;
    }
    setIsSubmitting(true);
    try {
      await registerStaff({
        fullName: newName,
        email: newEmail,
        password: newPassword || "Admin@12345",
        role: "ADMIN",
      }).unwrap();
      toast.success("Staff Invited", { description: `${newName} has been added as an admin.` });
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setFormErrors({});
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error("Failed to add staff", { description: err?.data?.message || "Email may already exist." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setLoadingId(id);
    try {
      await updateUserStatus({ id, status: newStatus }).unwrap();
      toast.success("Status Updated", {
        description: `Staff member ${newStatus === "ACTIVE" ? "activated" : "blocked"}.`,
      });
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setLoadingId(null);
    }
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
          <p className="text-xs text-muted-foreground">
            Monitor and manage admin team profiles and access levels.
          </p>
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
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Access Level</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : allStaff.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No staff members found. Click &quot;Add Member&quot; to get started.
                </td>
              </tr>
            ) : (
              allStaff.map((stf: any) => (
                <tr key={stf.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-foreground flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      {stf.fullName || "—"}
                    </p>
                  </td>
                  <td className="p-4 text-muted-foreground">{stf.email}</td>
                  <td className="p-4 font-semibold text-muted-foreground">
                    {ROLE_LABEL[stf.role] || stf.role}
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 bg-muted text-[10px] font-bold rounded border border-border text-foreground">
                      {ROLE_ACCESS[stf.role] || "Limited Access"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        stf.status === "ACTIVE"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {stf.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(stf.id, stf.status)}
                      disabled={loadingId === stf.id}
                      title={stf.status === "ACTIVE" ? "Block access" : "Restore access"}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${
                        stf.status === "ACTIVE"
                          ? "bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border-border"
                          : "bg-muted hover:bg-green-500/10 text-muted-foreground hover:text-green-600 border-border"
                      }`}
                    >
                      {loadingId === stf.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : stf.status === "ACTIVE" ? (
                        <UserX className="w-3.5 h-3.5" />
                      ) : (
                        <UserCheck className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
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
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
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
                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Shakil Ahmed"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formErrors.fullName && <span className="text-red-500 text-[10px] block">{formErrors.fullName}</span>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. shakil@glassophite.com"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formErrors.email && <span className="text-red-500 text-[10px] block">{formErrors.email}</span>}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-muted-foreground">
                    Temporary Password{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Default: Admin@12345"
                    className="w-full px-3.5 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {formErrors.password && <span className="text-red-500 text-[10px] block">{formErrors.password}</span>}
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15 disabled:opacity-60 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
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
