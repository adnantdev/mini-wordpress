"use client";

import React, { useState } from "react";
import { Breakpoint, PropertyFieldConfig } from "@/types/editor";
import { resolveResponsiveProp } from "@/lib/builder/utils";
import { ImagePickerModal } from "./ImagePickerModal";
import { LinksListControl } from "./LinksListControl";
import { FaqListControl } from "./FaqListControl";
import { Image as ImageIcon, Smartphone, Monitor, Tablet } from "lucide-react";

interface PropertyControlProps {
  field: PropertyFieldConfig;
  value: any;
  breakpoint: Breakpoint;
  onChange: (key: string, value: any, isResponsive: boolean) => void;
}

export const PropertyControl: React.FC<PropertyControlProps> = ({
  field,
  value,
  breakpoint,
  onChange,
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const resolvedValue = resolveResponsiveProp(
    value,
    breakpoint,
    field.defaultValue
  );

  const isCurrentResponsive =
    typeof value === "object" && value !== null && !Array.isArray(value);

  const handleChange = (newVal: any) => {
    onChange(field.key, newVal, !!field.responsive);
  };

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          {field.label}
          {field.responsive && (
            <span
              title={`Responsive field (editing for ${breakpoint})`}
              className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-normal"
            >
              {breakpoint === "desktop" && <Monitor className="w-2.5 h-2.5" />}
              {breakpoint === "tablet" && <Tablet className="w-2.5 h-2.5" />}
              {breakpoint === "mobile" && <Smartphone className="w-2.5 h-2.5" />}
              {breakpoint}
            </span>
          )}
        </label>
        {field.unit && <span className="text-[10px] text-slate-400">{field.unit}</span>}
      </div>

      {/* Input Types */}
      {field.type === "text" && (
        <input
          type="text"
          value={resolvedValue !== undefined && resolvedValue !== null ? resolvedValue : ""}
          placeholder={field.placeholder || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        />
      )}

      {field.type === "textarea" && (
        <textarea
          rows={3}
          value={resolvedValue !== undefined && resolvedValue !== null ? resolvedValue : ""}
          placeholder={field.placeholder || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
        />
      )}

      {field.type === "number" && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            value={resolvedValue !== undefined && resolvedValue !== null ? resolvedValue : 0}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          {field.min !== undefined && field.max !== undefined && (
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step || 1}
              value={resolvedValue !== undefined && resolvedValue !== null ? resolvedValue : field.min}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          )}
        </div>
      )}

      {field.type === "color" && (
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg border border-slate-300 shadow-inner overflow-hidden cursor-pointer relative"
            style={{ backgroundColor: resolvedValue || "#ffffff" }}
          >
            <input
              type="color"
              value={
                resolvedValue && resolvedValue.startsWith("#")
                  ? resolvedValue
                  : "#2563eb"
              }
              onChange={(e) => handleChange(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            />
          </div>
          <input
            type="text"
            value={resolvedValue || ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="#000000 or transparent"
            className="flex-1 px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>
      )}

      {field.type === "select" && (
        <select
          value={resolvedValue !== undefined ? resolvedValue : field.options?.[0]?.value}
          onChange={(e) => {
            const val = e.target.value;
            // Parse number if the option value is numeric
            const match = field.options?.find((o) => String(o.value) === val);
            handleChange(match ? match.value : val);
          }}
          className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        >
          {field.options?.map((opt, i) => (
            <option key={i} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "toggle" && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(resolvedValue)}
            onChange={(e) => handleChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className="text-xs text-slate-600">
            {resolvedValue ? "Enabled" : "Disabled"}
          </span>
        </label>
      )}

      {field.type === "image" && (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={resolvedValue || ""}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => handleChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
            <button
              type="button"
              title="Select / Upload Image"
              onClick={() => setImageModalOpen(true)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <ImagePickerModal
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
            onSelect={(url) => handleChange(url)}
            currentUrl={resolvedValue}
          />
        </div>
      )}

      {field.type === "links-list" && (
        <LinksListControl value={resolvedValue} onChange={handleChange} />
      )}

      {field.type === "faq-list" && (
        <FaqListControl value={resolvedValue} onChange={handleChange} />
      )}
    </div>
  );
};
