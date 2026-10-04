"use client";

import React from "react";
import { Breakpoint } from "@/types/editor";
import { resolveResponsiveProp } from "@/lib/builder/utils";

interface SpacingControlProps {
  props: Record<string, any>;
  breakpoint: Breakpoint;
  onChange: (key: string, val: number, isResponsive: boolean) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  props,
  breakpoint,
  onChange,
}) => {
  const getVal = (key: string, def = 0) => {
    const raw = props[key];
    const resolved = resolveResponsiveProp(raw, breakpoint, def);
    return typeof resolved === "number" ? resolved : parseInt(resolved, 10) || 0;
  };

  const pt = getVal("paddingTop");
  const pr = getVal("paddingRight");
  const pb = getVal("paddingBottom");
  const pl = getVal("paddingLeft");

  const mt = getVal("marginTop");
  const mr = getVal("marginRight");
  const mb = getVal("marginBottom");
  const ml = getVal("marginLeft");

  return (
    <div className="space-y-3">
      {/* Margin Outer Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 relative text-center">
        <span className="absolute top-1 left-2 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
          Margin
        </span>

        {/* Top Margin Input */}
        <div className="flex justify-center mb-1">
          <input
            type="number"
            value={mt}
            onChange={(e) => onChange("marginTop", Number(e.target.value), true)}
            className="w-12 h-6 text-center text-xs bg-white border border-amber-400/40 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center justify-between gap-1">
          {/* Left Margin */}
          <input
            type="number"
            value={ml}
            onChange={(e) => onChange("marginLeft", Number(e.target.value), true)}
            className="w-12 h-6 text-center text-xs bg-white border border-amber-400/40 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />

          {/* Padding Inner Box */}
          <div className="flex-1 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 relative mx-1">
            <span className="absolute top-1 left-2 text-[9px] font-bold text-blue-600 uppercase tracking-wider">
              Padding
            </span>

            {/* Top Padding */}
            <div className="flex justify-center mb-1">
              <input
                type="number"
                value={pt}
                onChange={(e) => onChange("paddingTop", Number(e.target.value), true)}
                className="w-12 h-6 text-center text-xs bg-white border border-blue-400/40 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between gap-1">
              {/* Left Padding */}
              <input
                type="number"
                value={pl}
                onChange={(e) => onChange("paddingLeft", Number(e.target.value), true)}
                className="w-12 h-6 text-center text-xs bg-white border border-blue-400/40 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {/* Element Center Indicator */}
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-500 bg-white/80 rounded border border-slate-200">
                Element
              </div>

              {/* Right Padding */}
              <input
                type="number"
                value={pr}
                onChange={(e) => onChange("paddingRight", Number(e.target.value), true)}
                className="w-12 h-6 text-center text-xs bg-white border border-blue-400/40 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Bottom Padding */}
            <div className="flex justify-center mt-1">
              <input
                type="number"
                value={pb}
                onChange={(e) => onChange("paddingBottom", Number(e.target.value), true)}
                className="w-12 h-6 text-center text-xs bg-white border border-blue-400/40 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Margin */}
          <input
            type="number"
            value={mr}
            onChange={(e) => onChange("marginRight", Number(e.target.value), true)}
            className="w-12 h-6 text-center text-xs bg-white border border-amber-400/40 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Bottom Margin */}
        <div className="flex justify-center mt-1">
          <input
            type="number"
            value={mb}
            onChange={(e) => onChange("marginBottom", Number(e.target.value), true)}
            className="w-12 h-6 text-center text-xs bg-white border border-amber-400/40 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
