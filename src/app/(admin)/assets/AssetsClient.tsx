"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  File,
  X,
} from "lucide-react";

interface AssetRecord {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function AssetsClient({
  initialAssets,
}: {
  initialAssets: AssetRecord[];
}) {
  const [assets, setAssets] = useState<AssetRecord[]>(initialAssets);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<AssetRecord | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/assets", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setAssets((prev) => [
            {
              id: data.asset.id,
              filename: data.asset.filename,
              originalName: file.name,
              url: data.asset.url,
              mimeType: data.asset.mimeType,
              size: data.asset.size,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ]);
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Delete asset "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/assets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete asset error:", err);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter((a) =>
    (a.originalName || a.filename).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <ImageIcon className="w-6 h-6 text-blue-400" />
          <span>Asset Manager</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload and manage images, vectors, and media for your website projects.
        </p>
      </div>

      {/* Upload Box */}
      <label className="border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors bg-slate-900/60 hover:bg-slate-900">
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <div className="p-3 bg-blue-600/10 text-blue-400 rounded-2xl border border-blue-500/20">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        <div className="text-center">
          <span className="text-sm font-bold text-white">
            {uploading ? "Uploading files..." : "Click or drag files here to upload"}
          </span>
          <p className="text-xs text-slate-400 mt-1">
            Supports PNG, JPG, WebP, SVG, GIF up to 10MB each
          </p>
        </div>
      </label>

      {/* Search & Counter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Total Assets: {assets.length}
        </span>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="p-16 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
          No assets found. Upload files using the dropzone above.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden group flex flex-col justify-between transition-all shadow-sm"
            >
              {/* Media Preview Box */}
              <div
                onClick={() => setPreviewAsset(asset)}
                className="aspect-square bg-slate-950 overflow-hidden relative cursor-pointer flex items-center justify-center p-2"
              >
                {asset.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <File className="w-10 h-10 text-slate-500" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="px-2 py-1 bg-white text-slate-900 text-[10px] font-bold rounded shadow">
                    Preview
                  </span>
                </div>
              </div>

              {/* Details & Action */}
              <div className="p-3 space-y-2">
                <div className="truncate text-xs font-bold text-slate-200">
                  {asset.originalName || asset.filename}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>{formatFileSize(asset.size)}</span>
                  <span className="uppercase">{asset.mimeType.split("/")[1] || "FILE"}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300"
                    title="Copy Public URL"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy URL
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id, asset.originalName)}
                    className="p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl space-y-4 p-6 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm truncate">
                {previewAsset.originalName || previewAsset.filename}
              </h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-hidden flex items-center justify-center bg-slate-950 rounded-xl p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewAsset.url}
                alt={previewAsset.filename}
                className="max-h-[55vh] object-contain rounded"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">
                Size: {formatFileSize(previewAsset.size)}
              </span>
              <a
                href={previewAsset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
              >
                Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
