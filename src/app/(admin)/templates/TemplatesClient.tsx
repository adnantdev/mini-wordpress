"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutTemplate,
  Sparkles,
  Check,
  Plus,
  ArrowRight,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";
import { TemplateData } from "@/types/editor";

export function TemplatesClient({
  initialTemplates,
}: {
  initialTemplates: TemplateData[];
}) {
  const router = useRouter();
  const [templates] = useState<TemplateData[]>(
    initialTemplates.length > 0 ? initialTemplates : TEMPLATES
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const categories = [
    "All",
    "Technology",
    "Business",
    "Creative",
    "Hospitality",
    "Services",
    "Personal",
    "Minimal",
  ];

  const filteredTemplates = templates.filter((t) =>
    activeCategory === "All" ? true : t.category === activeCategory
  );

  const handleUseTemplate = (tpl: TemplateData) => {
    setSelectedTemplate(tpl);
    setProjectName(`My ${tpl.name}`);
  };

  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreateFromTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !projectName.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          templateId: selectedTemplate.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      window.location.href = `/editor/${data.project.id}`;
    } catch (err: any) {
      console.error("Create from template error:", err);
      setCreateError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <LayoutTemplate className="w-6 h-6 text-blue-400" />
          <span>Template Library</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kickstart your next website with professionally crafted, responsive layout blueprints.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl transition-all"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  tpl.thumbnail ||
                  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                }
                alt={tpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-[10px] font-bold text-blue-400 border border-slate-800 uppercase tracking-wider">
                {tpl.category}
              </div>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {tpl.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleUseTemplate(tpl)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Use Template Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateFromTemplate}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-base">
                  Create from {selectedTemplate.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Give your new project a name to launch the editor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400 font-semibold">
                {createError}
              </div>
            )}

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-slate-300">Project Name</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-400">
              <div className="font-semibold text-white">Included in Template:</div>
              <div>• Responsive multi-section layout</div>
              <div>• Modern typography & cohesive color palette</div>
              <div>• Structured JSON component tree</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Launching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Start Designing
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
