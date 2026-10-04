import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { PageData } from "@/types/editor";
import { PreviewClient } from "./PreviewClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect(`/login?from=/preview/${id}`);
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      pages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!project) {
    notFound();
  }

  const pagesData: PageData[] = project.pages.map((p) => {
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

  return (
    <PreviewClient
      projectId={project.id}
      projectName={project.name}
      pages={pagesData}
    />
  );
}
