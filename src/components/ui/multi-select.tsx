"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export type Option = { label: string; value: string };

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  emptyMessage = "No options found",
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => { if (!disabled) { setOpen(!open); setSearch(""); } }}
        className="w-full min-h-[42px] h-auto px-3.5 py-2 flex items-center justify-between border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-40 cursor-pointer"
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length > 0 ? (
            selected.map((value) => {
              const option = options.find((o) => o.value === value);
              return (
                <Badge
                  key={value}
                  variant="secondary"
                  className="px-2 py-0.5 text-[11px] font-medium gap-1"
                >
                  {option?.label || value}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleRemove(value); }}
                    className="ml-0.5 hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 border border-border rounded-xl bg-popover text-popover-foreground shadow-md outline-none">
          <div className="p-1">
            <div className="flex items-center border-b border-border px-2 pb-1.5 mb-1">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </div>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent"
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded border border-border flex items-center justify-center shrink-0",
                        selected.includes(option.value)
                          ? "bg-primary border-primary"
                          : ""
                      )}
                    >
                      {selected.includes(option.value) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
