"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface LinksListControlProps {
  value: { label: string; href: string }[];
  onChange: (val: { label: string; href: string }[]) => void;
}

export const LinksListControl: React.FC<LinksListControlProps> = ({
  value = [],
  onChange,
}) => {
  const links = Array.isArray(value) ? value : [];

  const handleUpdate = (idx: number, key: "label" | "href", val: string) => {
    const updated = [...links];
    updated[idx] = { ...updated[idx], [key]: val };
    onChange(updated);
  };

  const handleAdd = () => {
    onChange([...links, { label: `Link ${links.length + 1}`, href: "#" }]);
  };

  const handleRemove = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Navigation Items</span>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
        >
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {links.map((link, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <input
              type="text"
              value={link.label}
              onChange={(e) => handleUpdate(idx, "label", e.target.value)}
              placeholder="Label"
              className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => handleUpdate(idx, "href", e.target.value)}
              placeholder="URL (#)"
              className="w-1/2 px-2 py-1 bg-white border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="text-slate-400 hover:text-red-500 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
