import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CanvasRenderer } from "@/lib/builder/renderer";
import { CanvasElement } from "@/types/editor";

interface PageProps {
  params: Promise<{ projectId: string; slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId, slug } = await params;
  const pageSlug = slug.join("/");

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { publicSlug: projectId }],
      status: "published",
    },
    include: {
      pages: { where: { slug: pageSlug } },
    },
  });

  if (!project) return { title: "Page Not Found" };

  const targetPage = project.pages[0];
  const title = targetPage?.seoTitle || targetPage?.name || project.name;
  const description = targetPage?.seoDescription || "Published with SiteForge";

  return {
    title: `${title} | ${project.name}`,
    description,
  };
}

export default async function PublicSubPage({ params }: PageProps) {
  const { projectId, slug } = await params;
  const pageSlug = slug.join("/");

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { publicSlug: projectId }],
      status: "published",
    },
    include: {
      publishedHistory: {
        orderBy: { version: "desc" },
        take: 1,
      },
      pages: {
        where: { slug: pageSlug },
      },
    },
  });

  if (!project) {
    notFound();
  }

  let rootElement: CanvasElement | null = null;

  if (project.publishedHistory && project.publishedHistory.length > 0) {
    try {
      const snapshot = JSON.parse(project.publishedHistory[0].contentJson);
      const matchedPage = snapshot.pages?.find((p: any) => p.slug === pageSlug);
      if (matchedPage && matchedPage.root) {
        rootElement = matchedPage.root;
      }
    } catch (e) {
      console.error("Error reading snapshot:", e);
    }
  }

  if (!rootElement && project.pages.length > 0) {
    try {
      rootElement = JSON.parse(project.pages[0].contentJson);
    } catch {}
  }

  if (!rootElement) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
      <CanvasRenderer element={rootElement} isEditor={false} />
    </div>
  );
}
