import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ProjectData } from "@/types/editor";
import { EditorClient } from "./EditorClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`/login?from=/editor/${id}`);
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      pages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Parse JSON data safely
  let globalStyles = {
    primaryColor: "#2563eb",
    secondaryColor: "#64748b",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    fontFamily: "Inter, sans-serif",
    headingFont: "Inter, sans-serif",
    borderRadius: "md",
    buttonStyle: "solid",
  };

  try {
    if (project.globalStyles) {
      globalStyles = { ...globalStyles, ...JSON.parse(project.globalStyles) };
    }
  } catch (e) {
    console.error("Error parsing globalStyles:", e);
  }

  let seoSettings = {};
  try {
    if (project.seoSettings) {
      seoSettings = JSON.parse(project.seoSettings);
    }
  } catch (e) {
    console.error("Error parsing seoSettings:", e);
  }

  const pagesData = project.pages.map((p) => {
    let root = null;
    try {
      root = JSON.parse(p.contentJson);
    } catch {
      root = {
        id: "root_fallback",
        type: "container",
        name: "Page Root",
        props: { width: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
        children: [],
      };
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      isHomePage: p.isHomePage,
      seoTitle: p.seoTitle || p.name,
      seoDescription: p.seoDescription || "",
      root,
    };
  });

  const projectData: ProjectData = {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    status: project.status as "draft" | "published" | "archived",
    templateId: project.templateId,
    draftVersion: project.draftVersion,
    publishedVersion: project.publishedVersion,
    publicSlug: project.publicSlug,
    customDomain: project.customDomain,
    globalStyles: globalStyles as any,
    seoSettings,
    pages: pagesData,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    publishedAt: project.publishedAt?.toISOString() || null,
  };

  return <EditorClient initialProject={projectData} />;
}
