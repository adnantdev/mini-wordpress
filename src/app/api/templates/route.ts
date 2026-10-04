import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch db templates or fallback to static TEMPLATES
  const dbTemplates = await prisma.template.findMany({
    orderBy: { createdAt: "asc" },
  });

  if (dbTemplates.length > 0) {
    return NextResponse.json({ templates: dbTemplates });
  }

  return NextResponse.json({ templates: TEMPLATES });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, description, category, thumbnail, projectId } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 });
    }

    let contentJson = "{}";

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { pages: true },
      });

      if (project) {
        let globalStyles = {};
        try {
          if (project.globalStyles) globalStyles = JSON.parse(project.globalStyles);
        } catch {}

        let seoSettings = {};
        try {
          if (project.seoSettings) seoSettings = JSON.parse(project.seoSettings);
        } catch {}

        const pages = project.pages.map((p) => {
          let root = {};
          try {
            root = JSON.parse(p.contentJson);
          } catch {}
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

        contentJson = JSON.stringify({
          globalStyles,
          seoSettings,
          pages,
        });
      }
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-") + `-${Date.now().toString(36)}`;

    const template = await prisma.template.create({
      data: {
        name,
        slug,
        description: description || null,
        category: category || "Custom",
        thumbnail: thumbnail || null,
        contentJson,
        isDefault: false,
      },
    });

    return NextResponse.json({ success: true, template });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
