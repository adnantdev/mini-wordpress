import React from "react";
import { prisma } from "@/lib/db";
import { AssetsClient } from "./AssetsClient";

export default async function AssetsPage() {
  const rawAssets = await prisma.asset.findMany({
    orderBy: { createdAt: "desc" },
  });

  const assets = rawAssets.map((a) => ({
    id: a.id,
    filename: a.filename,
    originalName: a.originalName,
    url: a.url,
    mimeType: a.mimeType,
    size: a.size,
    createdAt: a.createdAt.toISOString(),
  }));

  return <AssetsClient initialAssets={assets} />;
}
