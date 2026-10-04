"use client";

import React, { useState } from "react";
import { useEditor } from "@/lib/builder/editor-context";
import { COMPONENT_REGISTRY } from "@/lib/builder/registry";
import { CanvasElement, ElementType } from "@/types/editor";
import {
  Box,
  Layers as LayersIcon,
  FileText,
  Palette,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ChevronDown,
  Layout,
  Columns3,
  Grid,
  MoveVertical,
  Heading,
  AlignLeft,
  Type,
  Link2,
  Image as ImageIcon,
  Video,
  Images,
  MousePointerClick,
  FormInput,
  SquareCheck,
  CreditCard,
  Minus,
  HelpCircle,
  Navigation,
  PanelBottom,
  Sparkles,
  Globe,
  Home,
} from "lucide-react";

// Icon mapping helper
const ICON_MAP: Record<string, any> = {
  Layout,
  Box,
  Columns3,
  Grid,
  MoveVertical,
  Heading,
  AlignLeft,
  Type,
  Link2,
  Image: ImageIcon,
  Video,
  Images,
  MousePointerClick,
  FormInput,
  SquareCheck,
  CreditCard,
  Minus,
  HelpCircle,
  Navigation,
  PanelBottom,
};

export const LeftSidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    addElement,
    activePage,
    selectedElementId,
    setSelectedElementId,
    duplicateElement,
    deleteElement,
    project,
    activePageId,
    setActivePageId,
    addPage,
    updatePageMeta,
    deletePage,
    updateGlobalStyles,
  } = useEditor();

  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);

  // Group registry items by category
  const categories: { key: string; label: string; types: ElementType[] }[] = [
    {
      key: "layout",
      label: "Layout",
      types: ["section", "container", "columns", "grid", "spacer"],
    },
    {
      key: "typography",
      label: "Typography",
      types: ["heading", "paragraph", "text", "link"],
    },
    {
      key: "media",
      label: "Media",
      types: ["image", "video", "gallery"],
    },
    {
      key: "interactive",
      label: "Interactive",
      types: ["button", "input", "form"],
    },
    {
      key: "content",
      label: "Content",
      types: ["card", "divider", "faq"],
    },
    {
      key: "navigation",
      label: "Navigation",
      types: ["navbar", "footer"],
    },
  ];

  // Render recursive layer tree node
  const renderLayerNode = (
    elem: CanvasElement,
    depth: number = 0
  ): React.ReactNode => {
    const isSelected = selectedElementId === elem.id;
    const def = COMPONENT_REGISTRY[elem.type];
    const IconComponent = ICON_MAP[def?.iconName || "Box"] || Box;
    const hasChildren = elem.children && elem.children.length > 0;

    return (
      <div key={elem.id} className="flex flex-col">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElementId(elem.id);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs cursor-pointer group transition-colors ${
            isSelected
              ? "bg-blue-600 text-white font-semibold"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <IconComponent
              className={`w-3.5 h-3.5 flex-shrink-0 ${
                isSelected ? "text-white" : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="truncate">{elem.name || def?.label || elem.type}</span>
          </div>

          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            <button
              type="button"
              title="Duplicate"
              onClick={(e) => {
                e.stopPropagation();
                duplicateElement(elem.id);
              }}
              className="p-0.5 hover:bg-white/20 rounded"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();
                deleteElement(elem.id);
              }}
              className="p-0.5 hover:bg-red-500 rounded"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {hasChildren && (
          <div className="flex flex-col">
            {elem.children.map((child) => renderLayerNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col text-white h-[calc(100vh-3.5rem)] select-none">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-slate-800 p-1 bg-slate-950/40">
        <button
          type="button"
          onClick={() => setActiveTab("elements")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "elements"
              ? "bg-slate-800 text-blue-400 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Elements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("layers")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "layers"
              ? "bg-slate-800 text-blue-400 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <LayersIcon className="w-3.5 h-3.5" />
          <span>Layers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "pages"
              ? "bg-slate-800 text-blue-400 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Pages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("styles")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "styles"
              ? "bg-slate-800 text-blue-400 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* 1. ELEMENTS TAB */}
        {activeTab === "elements" && (
          <div className="space-y-5">
            <div className="text-[11px] text-slate-400 font-medium">
              Click or drag components into the page canvas:
            </div>

            {categories.map((cat) => (
              <div key={cat.key} className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {cat.label}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  {cat.types.map((type) => {
                    const def = COMPONENT_REGISTRY[type];
                    if (!def) return null;
                    const IconComponent = ICON_MAP[def.iconName] || Box;

                    return (
                      <button
                        key={type}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("application/siteforge-element", type);
                        }}
                        onClick={() => addElement(type)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-800/80 hover:bg-slate-800 hover:border-blue-500/80 border border-slate-700/60 rounded-xl transition-all group cursor-pointer active:scale-95 text-center gap-1.5"
                      >
                        <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 text-slate-300 transition-colors">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate w-full">
                          {def.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. LAYERS TREE TAB */}
        {activeTab === "layers" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Layer Hierarchy
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activePage?.name}
              </span>
            </div>

            {activePage?.root ? (
              <div className="space-y-0.5">{renderLayerNode(activePage.root)}</div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                No active page root.
              </div>
            )}
          </div>
        )}

        {/* 3. PAGES TAB */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Site Pages ({project.pages.length})
              </span>
              <button
                type="button"
                onClick={() => setShowAddPage(true)}
                className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddPage && (
              <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-3">
                <span className="text-xs font-bold text-white">Create New Page</span>
                <input
                  type="text"
                  placeholder="Page Name (e.g. Services)"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Slug (e.g. services)"
                  value={newPageSlug}
                  onChange={(e) => setNewPageSlug(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPage(false)}
                    className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (newPageName) {
                        await addPage(newPageName, newPageSlug || newPageName.toLowerCase());
                        setNewPageName("");
                        setNewPageSlug("");
                        setShowAddPage(false);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              {project.pages.map((p) => {
                const isActive = p.id === activePageId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePageId(p.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-500 font-semibold"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {p.isHomePage ? (
                        <Home className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      )}
                      <span className="text-xs truncate">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono opacity-70">
                        {p.isHomePage ? "/" : `/${p.slug}`}
                      </span>

                      {!p.isHomePage && project.pages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete page "${p.name}"?`)) {
                              deletePage(p.id);
                            }
                          }}
                          className="p-1 hover:bg-red-500 rounded text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. THEME & GLOBAL STYLES TAB */}
        {activeTab === "styles" && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Project Theme & Design Tokens
            </span>

            <div className="space-y-3 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Primary Accent Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.globalStyles.primaryColor || "#2563eb"}
                    onChange={(e) => updateGlobalStyles({ primaryColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={project.globalStyles.primaryColor || "#2563eb"}
                    onChange={(e) => updateGlobalStyles({ primaryColor: e.target.value })}
                    className="flex-1 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Page Background</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.globalStyles.backgroundColor || "#ffffff"}
                    onChange={(e) => updateGlobalStyles({ backgroundColor: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={project.globalStyles.backgroundColor || "#ffffff"}
                    onChange={(e) => updateGlobalStyles({ backgroundColor: e.target.value })}
                    className="flex-1 px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Default Font Family</label>
                <select
                  value={project.globalStyles.fontFamily || "Inter, sans-serif"}
                  onChange={(e) => updateGlobalStyles({ fontFamily: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                >
                  <option value="Inter, sans-serif">Inter (Modern Sans)</option>
                  <option value="Roboto, sans-serif">Roboto (Clean)</option>
                  <option value="Outfit, sans-serif">Outfit (Geometric)</option>
                  <option value="serif">Playfair Display / Serif</option>
                  <option value="monospace">JetBrains Mono / Code</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-medium">Global Corner Radius</label>
                <select
                  value={project.globalStyles.borderRadius || "md"}
                  onChange={(e) => updateGlobalStyles({ borderRadius: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded text-white"
                >
                  <option value="none">Sharp Corners (0px)</option>
                  <option value="sm">Subtle (4px)</option>
                  <option value="md">Medium (8px)</option>
                  <option value="lg">Rounded (12px)</option>
                  <option value="xl">Extra Rounded (16px)</option>
                  <option value="full">Pill / Full</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
