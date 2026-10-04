"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEditor } from "@/lib/builder/editor-context";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  Eye,
  Save,
  Rocket,
  ArrowLeft,
  Check,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Loader2,
  Plus,
} from "lucide-react";

export const TopBar: React.FC = () => {
  const {
    project,
    breakpoint,
    setBreakpoint,
    previewMode,
    setPreviewMode,
    saveStatus,
    saveProject,
    publishProject,
    canUndo,
    canRedo,
    undo,
    redo,
    activePageId,
    setActivePageId,
    addPage,
  } = useEditor();

  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [newPageModalOpen, setNewPageModalOpen] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");

  const handlePublish = async () => {
    setPublishing(true);
    const success = await publishProject();
    setPublishing(false);
    if (success) {
      setPublishSuccess(true);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName) return;
    const slug = newPageSlug || newPageName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    await addPage(newPageName, slug);
    setNewPageName("");
    setNewPageSlug("");
    setNewPageModalOpen(false);
  };

  const liveUrl = `/web/${project.publicSlug || project.id}`;

  return (
    <>
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-white z-40 relative select-none">
        {/* Left Section: Back, Brand & Page Switcher */}
        <div className="flex items-center gap-3">
          <Link
            href="/projects"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Back to Projects"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Projects</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white hidden md:inline">
              {project.name}
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              v{project.draftVersion}
            </span>
          </div>

          {/* Multi-page Selector */}
          <div className="relative group">
            <select
              value={activePageId}
              onChange={(e) => {
                if (e.target.value === "__new__") {
                  setNewPageModalOpen(true);
                } else {
                  setActivePageId(e.target.value);
                }
              }}
              className="px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer pr-7 font-medium appearance-none"
            >
              {project.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  📄 {p.name} {p.isHomePage ? "(Home)" : `(/${p.slug})`}
                </option>
              ))}
              <option value="__new__">+ Add New Page</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Center Section: Responsive Breakpoints Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          <button
            type="button"
            onClick={() => setBreakpoint("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === "desktop"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setBreakpoint("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === "tablet"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setBreakpoint("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              breakpoint === "mobile"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right Section: Undo/Redo, Preview, Save, Publish */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="p-1.5 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              previewMode
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            }`}
            title="Toggle Preview Mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{previewMode ? "Exit Preview" : "Preview"}</span>
          </button>

          {/* Save Status & Button */}
          <button
            type="button"
            onClick={saveProject}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Save Draft (Ctrl+S)"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
            ) : saveStatus === "saved" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span className="hidden sm:inline">
              {saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                ? "Saved"
                : "Save Draft"}
            </span>
          </button>

          {/* Publish Action Button */}
          <button
            type="button"
            onClick={() => {
              setPublishSuccess(false);
              setPublishModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Publish</span>
          </button>
        </div>
      </header>

      {/* Publish Dialog Modal */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Publish Website</h3>
                <p className="text-xs text-slate-400">
                  Deploy your latest visual changes live to the public internet.
                </p>
              </div>
            </div>

            {publishSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                    <Check className="w-4 h-4" /> Published Successfully!
                  </div>
                  <p className="text-xs text-slate-300">
                    Your website is now publicly available at:
                  </p>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline font-mono break-all font-semibold"
                  >
                    {liveUrl} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>

                <div className="flex justify-end gap-2">
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                  >
                    View Live Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Draft Version:</span>
                    <span className="font-bold text-white">v{project.draftVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Published Version:</span>
                    <span className="font-bold text-white">
                      {project.publishedVersion > 0 ? `v${project.publishedVersion}` : "None (Unpublished)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Public URL:</span>
                    <span className="font-mono text-blue-400">{liveUrl}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={publishing}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
                  >
                    {publishing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-3.5 h-3.5" /> Publish Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Page Modal */}
      {newPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreatePage}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-white space-y-4"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base">Add New Page</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Page Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Services, Contact, Pricing"
                  value={newPageName}
                  onChange={(e) => {
                    setNewPageName(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">URL Slug</label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 text-slate-400">
                  <span>/</span>
                  <input
                    type="text"
                    required
                    placeholder="services"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="w-full px-1 py-2 bg-transparent text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNewPageModalOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg"
              >
                Create Page
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
