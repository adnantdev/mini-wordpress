"use client";

import React, { useState } from "react";
import { useEditor } from "@/lib/builder/editor-context";
import { COMPONENT_REGISTRY } from "@/lib/builder/registry";
import { PropertyControl } from "./properties/PropertyControl";
import { SpacingControl } from "./properties/SpacingControl";
import {
  Sliders,
  Sparkles,
  ChevronDown,
  Trash2,
  Copy,
  Layers,
  Settings,
  Globe,
  FileCode,
  Layout,
  Type,
  Maximize2,
  Paintbrush,
  Square,
  SunMedium,
} from "lucide-react";

export const RightSidebar: React.FC = () => {
  const {
    selectedElement,
    selectedElementId,
    setSelectedElementId,
    duplicateElement,
    deleteElement,
    updateElementProp,
    breakpoint,
    activePage,
    updatePageMeta,
    project,
    updateSeoSettings,
  } = useEditor();

  // Collapsible categories state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    custom: true,
    layout: true,
    spacing: true,
    typography: true,
    background: true,
    border: false,
    shadow: false,
    effects: false,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // If no element is selected, render Page and SEO properties
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col text-white h-[calc(100vh-3.5rem)] select-none">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Page & SEO Settings
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {activePage?.slug}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Active Page Meta */}
          {activePage && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" /> Page Configuration
              </span>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Page Title (H1/Nav)</label>
                  <input
                    type="text"
                    value={activePage.name}
                    onChange={(e) =>
                      updatePageMeta(activePage.id, { name: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">URL Path Slug</label>
                  <input
                    type="text"
                    disabled={activePage.isHomePage}
                    value={activePage.isHomePage ? "home (/)" : activePage.slug}
                    onChange={(e) =>
                      updatePageMeta(activePage.id, {
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="Custom title for Google search"
                    value={activePage.seoTitle || ""}
                    onChange={(e) =>
                      updatePageMeta(activePage.id, { seoTitle: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">SEO Meta Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description for search engines and social previews..."
                    value={activePage.seoDescription || ""}
                    onChange={(e) =>
                      updatePageMeta(activePage.id, { seoDescription: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Project SEO Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Global Website SEO
            </span>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Site Brand Title</label>
                <input
                  type="text"
                  value={project.seoSettings.siteTitle || ""}
                  onChange={(e) => updateSeoSettings({ siteTitle: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Default Meta Description</label>
                <textarea
                  rows={3}
                  value={project.seoSettings.metaDescription || ""}
                  onChange={(e) =>
                    updateSeoSettings({ metaDescription: e.target.value })
                  }
                  placeholder="Site description..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // An element is selected: render component property schemas
  const def = COMPONENT_REGISTRY[selectedElement.type];
  const schema = def?.schema || [];

  // Group schema fields by category
  const customFields = schema.filter((f) => f.category === "custom" || !f.category);
  const layoutFields = schema.filter((f) => f.category === "layout");
  const spacingFields = schema.filter((f) => f.category === "spacing");
  const typographyFields = schema.filter((f) => f.category === "typography");
  const backgroundFields = schema.filter((f) => f.category === "background");
  const borderFields = schema.filter((f) => f.category === "border");
  const shadowFields = schema.filter((f) => f.category === "shadow");
  const effectFields = schema.filter((f) => f.category === "effects");

  const handlePropChange = (key: string, val: any, isResponsive: boolean) => {
    updateElementProp(key, val, isResponsive);
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col text-white h-[calc(100vh-3.5rem)] select-none">
      {/* Element Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-2 truncate">
          <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-bold uppercase tracking-wider">
            {def?.label || selectedElement.type}
          </span>
          <span className="text-[11px] text-slate-400 font-mono truncate">
            #{selectedElement.id.slice(-6)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Duplicate"
            onClick={() => duplicateElement(selectedElement.id)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => deleteElement(selectedElement.id)}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Property Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {/* 1. Component Specific Fields */}
        {customFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("custom")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Specific Properties
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.custom ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.custom && (
              <div className="p-3 space-y-3">
                {customFields.map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Spacing Control (Interactive Visual Box) */}
        {spacingFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("spacing")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" /> Margin & Padding
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.spacing ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.spacing && (
              <div className="p-3">
                <SpacingControl
                  props={selectedElement.props}
                  breakpoint={breakpoint}
                  onChange={(key, val, resp) => handlePropChange(key, val, resp)}
                />
              </div>
            )}
          </div>
        )}

        {/* 3. Layout & Sizing */}
        {layoutFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("layout")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-emerald-400" /> Layout & Sizing
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.layout ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.layout && (
              <div className="p-3 space-y-3">
                {layoutFields.map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Typography */}
        {typographyFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("typography")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-400" /> Typography
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.typography ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.typography && (
              <div className="p-3 space-y-3">
                {typographyFields.map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Background */}
        {backgroundFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("background")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-pink-400" /> Background
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.background ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.background && (
              <div className="p-3 space-y-3">
                {backgroundFields.map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. Border & Corners */}
        {borderFields.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("border")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-cyan-400" /> Borders & Corners
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.border ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.border && (
              <div className="p-3 space-y-3">
                {borderFields.map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. Shadow & Effects */}
        {(shadowFields.length > 0 || effectFields.length > 0) && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
            <button
              type="button"
              onClick={() => toggleSection("shadow")}
              className="w-full px-3 py-2.5 bg-slate-800/80 flex items-center justify-between font-bold text-slate-200 text-left uppercase tracking-wider text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5 text-yellow-400" /> Shadow & Opacity
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  openSections.shadow ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSections.shadow && (
              <div className="p-3 space-y-3">
                {[...shadowFields, ...effectFields].map((field) => (
                  <PropertyControl
                    key={field.key}
                    field={field}
                    value={selectedElement.props[field.key]}
                    breakpoint={breakpoint}
                    onChange={handlePropChange}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
