import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";
import { generateId } from "@/lib/builder/utils";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    include: {
      pages: {
        select: { id: true, name: true, slug: true, isHomePage: true },
      },
      template: {
        select: { id: true, name: true, thumbnail: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, templateId, description } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "-")
      .substring(0, 50);
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);
    const slug = `${baseSlug}-${uniqueSuffix}`;
    const publicSlug = `${baseSlug}-${uniqueSuffix}`;

    // Find template content
    let templatePages: any[] = [];
    let validTemplateDbId: string | null = null;
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
    let seoSettings = {
      siteTitle: name,
      metaDescription: `Welcome to ${name}`,
    };

    if (templateId) {
      // Check in DB first to ensure foreign key validity
      const dbTemplate = await prisma.template.findFirst({
        where: {
          OR: [{ id: templateId }, { slug: templateId }],
        },
      });

      if (dbTemplate) {
        validTemplateDbId = dbTemplate.id;
        try {
          const parsed = JSON.parse(dbTemplate.contentJson);
          if (parsed.pages && parsed.pages.length > 0) {
            templatePages = parsed.pages;
          }
          if (parsed.globalStyles) globalStyles = { ...globalStyles, ...parsed.globalStyles };
          if (parsed.seoSettings) seoSettings = { ...seoSettings, ...parsed.seoSettings };
        } catch {}
      }

      // Also check memory templates if db template didn't have pages
      if (templatePages.length === 0) {
        const foundTemplate = TEMPLATES.find((t) => t.id === templateId || t.slug === templateId);
        if (foundTemplate) {
          templatePages = foundTemplate.pages;
          globalStyles = { ...globalStyles, ...foundTemplate.globalStyles };
          seoSettings = { ...seoSettings, ...foundTemplate.seoSettings };
        }
      }
    }

    // Fallback if no template chosen: default blank starter page
    if (templatePages.length === 0) {
      const blank = TEMPLATES.find((t) => t.id === "template-blank")!;
      templatePages = blank.pages;
    }

    // Create Project and Pages in DB
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description: description || null,
        publicSlug,
        templateId: validTemplateDbId,
        userId: session.id,
        globalStyles: JSON.stringify(globalStyles),
        seoSettings: JSON.stringify(seoSettings),
        draftVersion: 1,
        publishedVersion: 0,
        status: "draft",
        pages: {
          create: templatePages.map((p) => ({
            name: p.name,
            slug: p.slug,
            isHomePage: p.isHomePage,
            seoTitle: p.seoTitle || p.name,
            seoDescription: p.seoDescription || "",
            contentJson: typeof p.root === "string" ? p.root : JSON.stringify(p.root),
          })),
        },
      },
      include: {
        pages: true,
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
