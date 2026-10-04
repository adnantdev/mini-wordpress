import React, { Suspense } from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ProjectsClient } from "./ProjectsClient";

export default async function ProjectsPage() {
  const session = await getSession();

  const rawProjects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      pages: {
        select: { id: true, name: true, slug: true, isHomePage: true },
      },
      template: {
        select: { name: true, thumbnail: true },
      },
    },
  });

  const projects = rawProjects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    publicSlug: p.publicSlug,
    description: p.description,
    status: p.status,
    draftVersion: p.draftVersion,
    publishedVersion: p.publishedVersion,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    pages: p.pages,
    template: p.template,
  }));

  return (
    <Suspense fallback={<div className="p-8 text-white">Loading projects...</div>}>
      <ProjectsClient initialProjects={projects} />
    </Suspense>
  );
}
