import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        pages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.pages.length === 0) {
      return NextResponse.json(
        { error: "Cannot publish a project with no pages" },
        { status: 400 }
      );
    }

    const nextPublishedVersion = (project.publishedVersion || 0) + 1;

    // Parse pages JSON for snapshot
    const pagesSnapshot = project.pages.map((p) => {
      let root = {};
      try {
        root = JSON.parse(p.contentJson);
      } catch {
        root = {};
      }
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        isHomePage: p.isHomePage,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        root,
      };
    });

    let globalStyles = {};
    try {
      if (project.globalStyles) globalStyles = JSON.parse(project.globalStyles);
    } catch {}

    let seoSettings = {};
    try {
      if (project.seoSettings) seoSettings = JSON.parse(project.seoSettings);
    } catch {}

    const snapshotData = {
      projectId: project.id,
      publicSlug: project.publicSlug,
      customDomain: project.customDomain,
      version: nextPublishedVersion,
      publishedAt: new Date().toISOString(),
      globalStyles,
      seoSettings,
      pages: pagesSnapshot,
    };

    // Save snapshot in PublishedVersion & update project
    const result = await prisma.$transaction(async (tx) => {
      // Create PublishedVersion record
      const publishedVersion = await tx.publishedVersion.create({
        data: {
          projectId: project.id,
          version: nextPublishedVersion,
          contentJson: JSON.stringify(snapshotData),
          snapshotNote: `Published version ${nextPublishedVersion}`,
          publishedBy: session.email,
        },
      });

      // Update project published status
      const updatedProject = await tx.project.update({
        where: { id },
        data: {
          status: "published",
          publishedVersion: nextPublishedVersion,
          publishedAt: new Date(),
        },
      });

      return { publishedVersion, updatedProject };
    });

    return NextResponse.json({
      success: true,
      message: "Project successfully published!",
      publishedVersion: result.updatedProject.publishedVersion,
      publishedAt: result.updatedProject.publishedAt,
      publicUrl: `/web/${result.updatedProject.publicSlug}`,
    });
  } catch (error) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish project" },
      { status: 500 }
    );
  }
}
