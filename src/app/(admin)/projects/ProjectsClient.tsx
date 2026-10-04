"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FolderKanban,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  Rocket,
  Layers,
  Filter,
  Eye,
  Check,
  Loader2,
  X,
  LayoutTemplate,
} from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

interface ProjectItem {
  id: string;
  name: string;
  slug: string;
  publicSlug: string;
  description?: string | null;
  status: string;
  draftVersion: number;
  publishedVersion: number;
  createdAt: string;
  updatedAt: string;
  pages: { id: string; name: string; slug: string; isHomePage: boolean }[];
  template?: { name: string; thumbnail?: string | null } | null;
}

export function ProjectsClient({
  initialProjects,
}: {
  initialProjects: ProjectItem[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [createModalOpen, setCreateModalOpen] = useState(searchParams.get("new") === "1");
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("template-saas");
  const [creating, setCreating] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [createError, setCreateError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProjectName.trim(),
          templateId: selectedTemplateId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      setCreateModalOpen(false);
      window.location.href = `/editor/${data.project.id}`;
    } catch (err: any) {
      console.error("Create project error:", err);
      setCreateError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/projects/${id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [data.project, ...prev]);
        router.refresh();
      }
    } catch (err) {
      console.error("Duplicate error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/projects/${id}/publish`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: "published",
                  publishedVersion: data.publishedVersion,
                }
              : p
          )
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Publish error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your websites, edit drafts, and publish to live endpoints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("published")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "published"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Published
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("draft")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === "draft"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No projects found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Create your first visual website to get started."}
          </p>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4 inline mr-1" /> Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const isPublished = proj.status === "published";
            const liveUrl = `/web/${proj.publicSlug || proj.id}`;
            const isLoading = actionLoadingId === proj.id;

            return (
              <div
                key={proj.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md relative"
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-2xl flex items-center justify-center z-20">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {isPublished ? "● Published" : "○ Draft"}
                    </span>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {proj.pages.length} {proj.pages.length === 1 ? "page" : "pages"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {proj.description || `Public slug: /web/${proj.publicSlug}`}
                    </p>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-800/80 mt-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Draft v{proj.draftVersion}</span>
                    {isPublished && <span>Published v{proj.publishedVersion}</span>}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1">
                      {isPublished && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Live Public Site"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Link
                        href={`/preview/${proj.id}`}
                        title="Preview Draft"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        title="Duplicate Project"
                        onClick={() => handleDuplicate(proj.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete Project"
                        onClick={() => handleDelete(proj.id, proj.name)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePublish(proj.id)}
                        title="Publish Live"
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Rocket className="w-3 h-3 text-emerald-400 group-hover:text-white" />
                        <span>Publish</span>
                      </button>

                      <Link
                        href={`/editor/${proj.id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editor</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Create New Website</h3>
                  <p className="text-xs text-slate-400">
                    Choose a starter template or start with a blank canvas.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Name */}
            {createError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-400 font-semibold">
                {createError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Website Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Tech Solutions"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Template Blueprint
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                {TEMPLATES.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`cursor-pointer rounded-xl p-3 border text-left transition-all ${
                        isSelected
                          ? "bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase font-semibold text-blue-400">
                          {tpl.category}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <div className="font-bold text-xs text-white truncate">
                        {tpl.name}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                        {tpl.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit / Cancel Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" /> Launch Studio
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
