import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      pages: { orderBy: { createdAt: "asc" } },
      template: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { name, pages, globalStyles, seoSettings } = body;

    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update pages in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update Project basic fields
      await tx.project.update({
        where: { id },
        data: {
          ...(name ? { name } : {}),
          ...(globalStyles ? { globalStyles: JSON.stringify(globalStyles) } : {}),
          ...(seoSettings ? { seoSettings: JSON.stringify(seoSettings) } : {}),
          draftVersion: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      // 2. If pages provided, upsert pages
      if (Array.isArray(pages)) {
        const pageIds = pages.map((p) => p.id).filter(Boolean);

        // Remove deleted pages
        await tx.page.deleteMany({
          where: {
            projectId: id,
            id: { notIn: pageIds },
          },
        });

        // Upsert active pages
        for (const page of pages) {
          const rootJson =
            typeof page.root === "string"
              ? page.root
              : JSON.stringify(page.root);

          await tx.page.upsert({
            where: {
              projectId_slug: {
                projectId: id,
                slug: page.slug,
              },
            },
            update: {
              name: page.name,
              isHomePage: Boolean(page.isHomePage),
              seoTitle: page.seoTitle || page.name,
              seoDescription: page.seoDescription || "",
              contentJson: rootJson,
              updatedAt: new Date(),
            },
            create: {
              id: page.id && page.id.startsWith("page_") ? page.id : undefined,
              projectId: id,
              name: page.name,
              slug: page.slug,
              isHomePage: Boolean(page.isHomePage),
              seoTitle: page.seoTitle || page.name,
              seoDescription: page.seoDescription || "",
              contentJson: rootJson,
            },
          });
        }
      }
    });

    const updated = await prisma.project.findUnique({
      where: { id },
      include: { pages: true },
    });

    return NextResponse.json({
      success: true,
      draftVersion: updated?.draftVersion,
      project: updated,
    });
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// POST to duplicate project
export async function POST(request: Request, { params }: RouteParams) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const original = await prisma.project.findUnique({
      where: { id },
      include: { pages: true },
    });

    if (!original) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const newName = `${original.name} (Copy)`;
    const newSlug = `${original.slug}-copy-${uniqueSuffix}`;

    const duplicated = await prisma.project.create({
      data: {
        name: newName,
        slug: newSlug,
        publicSlug: newSlug,
        description: original.description,
        status: "draft",
        draftVersion: 1,
        publishedVersion: 0,
        globalStyles: original.globalStyles,
        seoSettings: original.seoSettings,
        templateId: original.templateId,
        userId: session.id,
        pages: {
          create: original.pages.map((p) => ({
            name: p.name,
            slug: p.slug,
            isHomePage: p.isHomePage,
            seoTitle: p.seoTitle,
            seoDescription: p.seoDescription,
            contentJson: p.contentJson,
          })),
        },
      },
      include: { pages: true },
    });

    return NextResponse.json({ success: true, project: duplicated });
  } catch (error) {
    console.error("Duplicate project error:", error);
    return NextResponse.json(
      { error: "Failed to duplicate project" },
      { status: 500 }
    );
  }
}
