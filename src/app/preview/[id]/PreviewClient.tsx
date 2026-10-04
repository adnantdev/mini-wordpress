"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breakpoint, CanvasElement, PageData } from "@/types/editor";
import { CanvasRenderer } from "@/lib/builder/renderer";
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowLeft,
  Eye,
  ChevronDown,
  Edit3,
} from "lucide-react";

interface PreviewClientProps {
  projectId: string;
  projectName: string;
  pages: PageData[];
}

export function PreviewClient({
  projectId,
  projectName,
  pages,
}: PreviewClientProps) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id || "");
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const getCanvasWidthClass = () => {
    switch (breakpoint) {
      case "mobile":
        return "w-[375px] min-h-[667px] shadow-2xl rounded-2xl border-4 border-slate-800 my-8 overflow-hidden";
      case "tablet":
        return "w-[768px] min-h-[1024px] shadow-2xl rounded-2xl border-4 border-slate-800 my-8 overflow-hidden";
      case "desktop":
      default:
        return "w-full min-h-screen";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans">
      {/* Top Preview Chrome */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/editor/${projectId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" /> Back to Editor
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white">{projectName}</span>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Draft Preview
            </span>
          </div>

          {pages.length > 1 && (
            <div className="relative">
              <select
                value={activePageId}
                onChange={(e) => setActivePageId(e.target.value)}
                className="px-3 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none appearance-none pr-7 cursor-pointer"
              >
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.isHomePage ? "(Home)" : `(/${p.slug})`}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setBreakpoint("desktop")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              breakpoint === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setBreakpoint("tablet")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              breakpoint === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setBreakpoint("mobile")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium ${
              breakpoint === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <main className="flex-1 flex justify-center items-start overflow-auto p-4 bg-slate-950">
        <div className={`bg-white transition-all duration-200 ${getCanvasWidthClass()}`}>
          {activePage?.root ? (
            <CanvasRenderer
              element={activePage.root}
              breakpoint={breakpoint}
              isEditor={false}
            />
          ) : (
            <div className="p-8 text-center text-slate-500">No content in this page.</div>
          )}
        </div>
      </main>
    </div>
  );
}
