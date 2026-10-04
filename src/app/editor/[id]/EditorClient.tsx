"use client";

import React from "react";
import { ProjectData } from "@/types/editor";
import { EditorProvider, useEditor } from "@/lib/builder/editor-context";
import { TopBar } from "@/components/editor/TopBar";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { RightSidebar } from "@/components/editor/RightSidebar";
import { Canvas } from "@/components/editor/Canvas";

function EditorLayout() {
  const { previewMode } = useEditor();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans antialiased">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        {!previewMode && <LeftSidebar />}
        <Canvas />
        {!previewMode && <RightSidebar />}
      </div>
    </div>
  );
}

export function EditorClient({ initialProject }: { initialProject: ProjectData }) {
  return (
    <EditorProvider initialProject={initialProject}>
      <EditorLayout />
    </EditorProvider>
  );
}
