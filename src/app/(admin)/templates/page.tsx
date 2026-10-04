import React from "react";
import { prisma } from "@/lib/db";
import { TEMPLATES } from "@/lib/templates";
import { TemplatesClient } from "./TemplatesClient";

export default async function TemplatesPage() {
  const dbTemplates = await prisma.template.findMany({
    orderBy: { createdAt: "asc" },
  });

  const formattedTemplates =
    dbTemplates.length > 0
      ? dbTemplates.map((t) => {
          let parsed: any = {};
          try {
            parsed = JSON.parse(t.contentJson);
          } catch {}
          return {
            id: t.id,
            name: t.name,
            slug: t.slug,
            category: t.category,
            description: t.description,
            thumbnail: t.thumbnail,
            isDefault: t.isDefault,
            pages: parsed.pages || [],
            globalStyles: parsed.globalStyles || {},
            seoSettings: parsed.seoSettings || {},
          };
        })
      : TEMPLATES;

  return <TemplatesClient initialTemplates={formattedTemplates as any} />;
}
