"use client";

import React from "react";
import { useEditor } from "@/lib/builder/editor-context";
import { CanvasRenderer } from "@/lib/builder/renderer";
import { ElementType } from "@/types/editor";

export const Canvas: React.FC = () => {
  const {
    activePage,
    breakpoint,
    selectedElementId,
    hoveredElementId,
    setSelectedElementId,
    setHoveredElementId,
    deleteElement,
    duplicateElement,
    selectParent,
    updateInlineText,
    addElement,
    previewMode,
  } = useEditor();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/siteforge-element") as ElementType;
    if (type) {
      addElement(type);
    }
  };

  const getCanvasWidthClass = () => {
    switch (breakpoint) {
      case "mobile":
        return "w-[375px] min-h-[667px] shadow-2xl rounded-2xl border-4 border-slate-800 my-8 overflow-hidden";
      case "tablet":
        return "w-[768px] min-h-[1024px] shadow-2xl rounded-2xl border-4 border-slate-800 my-8 overflow-hidden";
      case "desktop":
      default:
        return "w-full min-h-full";
    }
  };

  if (!activePage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400">
        No active page loaded.
      </div>
    );
  }

  return (
    <main
      onClick={() => setSelectedElementId(null)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex-1 overflow-auto bg-slate-950/90 flex justify-center items-start transition-all relative ${
        previewMode ? "p-0" : "p-4"
      }`}
      style={{
        backgroundImage: previewMode
          ? "none"
          : "radial-gradient(#1e293b 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <div
        className={`bg-white transition-all duration-200 relative ${getCanvasWidthClass()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CanvasRenderer
          element={activePage.root}
          breakpoint={breakpoint}
          isEditor={!previewMode}
          selectedId={selectedElementId}
          hoveredId={hoveredElementId}
          onSelect={(id) => setSelectedElementId(id)}
          onHover={(id) => setHoveredElementId(id)}
          onDelete={(id) => deleteElement(id)}
          onDuplicate={(id) => duplicateElement(id)}
          onSelectParent={(id) => selectParent(id)}
          onInlineUpdate={(id, text) => updateInlineText(id, text)}
        />
      </div>
    </main>
  );
};
