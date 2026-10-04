import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  FolderKanban,
  Globe2,
  FileEdit,
  LayoutTemplate,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Clock,
  Layers,
  Edit3,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();

  const [
    totalProjects,
    publishedCount,
    draftCount,
    templateCount,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "published" } }),
    prisma.project.count({ where: { status: "draft" } }),
    prisma.template.count(),
    prisma.project.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: {
        pages: { select: { id: true, name: true, slug: true } },
        template: { select: { name: true, thumbnail: true } },
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: FolderKanban,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Published Websites",
      value: publishedCount,
      icon: Globe2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Drafts In Progress",
      value: draftCount,
      icon: FileEdit,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Ready Templates",
      value: templateCount,
      icon: LayoutTemplate,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <span>Welcome back, {session?.name || "Admin"}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
              CMS Studio
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build, visually customize, and publish fast websites from your private console.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates
          </Link>
          <Link
            href="/projects?new=1"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-slate-900/80 border ${stat.border} flex items-center justify-between shadow-sm`}
            >
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400">
                  {stat.label}
                </span>
                <div className="text-2xl font-black text-white">{stat.value}</div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-400" /> Recent Projects
          </h2>
          <Link
            href="/projects"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All ({totalProjects}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
            <h3 className="font-bold text-white text-base">No projects created yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by creating your first website from our curated templates or start from scratch.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow"
            >
              <Plus className="w-4 h-4" /> Create First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentProjects.map((proj) => {
              const isPublished = proj.status === "published";
              const liveUrl = `/web/${proj.publicSlug || proj.id}`;

              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {isPublished ? "● Published" : "○ Draft"}
                      </span>

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {proj.pages.length}{" "}
                        {proj.pages.length === 1 ? "Page" : "Pages"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                        {proj.name}
                      </h3>
                      {proj.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500 font-mono">
                      Draft v{proj.draftVersion}
                      {isPublished && ` • Pub v${proj.publishedVersion}`}
                    </div>

                    <div className="flex items-center gap-2">
                      {isPublished && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Live Published Site"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <Link
                        href={`/editor/${proj.id}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Studio</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
