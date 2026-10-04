import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CanvasRenderer } from "@/lib/builder/renderer";
import { CanvasElement, PageData } from "@/types/editor";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      OR: [{ id: projectId }, { publicSlug: projectId }],
      status: "published",
    },
    include: {
      pages: { where: { isHomePage: true } },
    },
  });

  if (!project) return { title: "Site Not Found" };

  let seoSettings: any = {};
  try {
    if (project.seoSettings) seoSettings = JSON.parse(project.seoSettings);
  } catch {}

  const homePage = project.pages[0];
  const title = homePage?.seoTitle || seoSettings.siteTitle || project.name;
  const description =
    homePage?.seoDescription || seoSettings.metaDescription || "Published with SiteForge";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function PublicWebsitePage({ params }: PageProps) {
  const { projectId } = await params;

  // Find published project
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
        where: { isHomePage: true },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Use PublishedVersion snapshot if available, otherwise fallback to published home page
  let rootElement: CanvasElement | null = null;

  if (project.publishedHistory && project.publishedHistory.length > 0) {
    try {
      const snapshot = JSON.parse(project.publishedHistory[0].contentJson);
      const home = snapshot.pages?.find((p: any) => p.isHomePage) || snapshot.pages?.[0];
      if (home && home.root) {
        rootElement = home.root;
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
