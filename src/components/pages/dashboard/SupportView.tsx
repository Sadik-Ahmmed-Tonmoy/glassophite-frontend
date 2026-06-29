"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Mock support inquiries
const initialTickets = [
  { id: "TKT-8201", customer: "Minhaz Kabir", email: "minhaz@gmail.com", subject: "Virtual Try-On Bug", message: "Webcam stream freeze when using glasses try-on under chrome iOS mobile browsers.", status: "Open" },
  { id: "TKT-8202", customer: "Suhrawardy Shuvo", email: "shuvo.s@outlook.com", subject: "Optical frame lenses parameters", message: "Do you support customizing high index lenses (1.67 or 1.74) for progressive glasses designs?", status: "Open" },
  { id: "TKT-8203", customer: "Rifat Chowdhury", email: "rifat.c@gmail.com", subject: "Refund query ORD-9201", message: "Order arrived with small hairline scratches on metal hinge. Seeking replacement details.", status: "Resolved" },
];

export default function SupportView() {
  const [tickets, setTickets] = useState(initialTickets);

  const handleUpdateStatus = (ticketId: string, newStatus: "Open" | "Resolved") => {
    setTickets((prev) =>
      prev.map((tkt) => (tkt.id === ticketId ? { ...tkt, status: newStatus } : tkt))
    );
    toast.success(`Ticket status updated`, {
      description: `Ticket ${ticketId} has been marked as ${newStatus}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Support Tickets</h1>
        <p className="text-xs text-neutral-500">Moderate customer support inquiries and queries.</p>
      </div>

      {/* Tickets Table */}
      <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-neutral-100 dark:bg-neutral-850 text-neutral-500 uppercase tracking-wider font-extrabold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
              <th className="p-4">Ticket ID</th>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Inquiry Subject</th>
              <th className="p-4">Message Context</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {tickets.map((tkt) => (
              <tr key={tkt.id} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="p-4 font-mono font-bold text-[#007C74]">{tkt.id}</td>
                <td className="p-4">
                  <p className="font-bold text-neutral-900 dark:text-white">{tkt.customer}</p>
                  <p className="text-[10px] text-neutral-400">{tkt.email}</p>
                </td>
                <td className="p-4 font-semibold text-neutral-700 dark:text-neutral-300">{tkt.subject}</td>
                <td className="p-4 max-w-xs text-neutral-500 leading-relaxed truncate hover:text-clip hover:whitespace-normal" title={tkt.message}>
                  {tkt.message}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    tkt.status === "Open" ? "bg-red-500/10 text-red-500" : "bg-green-550/15 text-green-550 dark:text-green-400"
                  }`}>
                    {tkt.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-1.5">
                    {tkt.status === "Open" ? (
                      <button
                        onClick={() => handleUpdateStatus(tkt.id, "Resolved")}
                        className="p-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg border border-green-500/20 transition-all cursor-pointer"
                        title="Mark as Resolved"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(tkt.id, "Open")}
                        className="p-1.5 bg-neutral-100 hover:bg-[#007C74] hover:text-white dark:bg-neutral-800 dark:hover:bg-[#007C74]/20 dark:hover:text-[#007C74] text-neutral-550 rounded-lg border border-neutral-200 dark:border-neutral-850 transition-all cursor-pointer"
                        title="Reopen ticket"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
