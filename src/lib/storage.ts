import fs from "fs/promises";
import path from "path";
import { prisma } from "./db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}

export async function saveUploadedFile(
  file: File,
  projectId?: string | null
): Promise<{ id: string; url: string; filename: string; size: number; mimeType: string }> {
  await ensureUploadDir();

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate safe filename with timestamp
  const ext = path.extname(file.name) || ".png";
  const base = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 40);
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${base}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${uniqueName}`;

  const asset = await prisma.asset.create({
    data: {
      filename: uniqueName,
      originalName: file.name,
      url,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      projectId: projectId || null,
    },
  });

  return {
    id: asset.id,
    url: asset.url,
    filename: asset.filename,
    size: asset.size,
    mimeType: asset.mimeType,
  };
}

export async function deleteStoredAsset(assetId: string): Promise<boolean> {
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset) return false;

  try {
    const filePath = path.join(UPLOAD_DIR, asset.filename);
    await fs.unlink(filePath).catch(() => {});
  } catch (err) {
    console.warn("Could not remove physical file:", err);
  }

  await prisma.asset.delete({ where: { id: assetId } });
  return true;
}
