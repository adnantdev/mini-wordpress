"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  Breakpoint,
  CanvasElement,
  ElementType,
  GlobalStyles,
  PageData,
  ProjectData,
  SeoSettings,
} from "@/types/editor";
import {
  cloneElementWithNewIds,
  createDefaultElement,
  deleteElementFromTree,
  findElementInTree,
  generateId,
  insertElementInTree,
  updateElementInTree,
} from "./utils";

interface EditorContextType {
  project: ProjectData;
  activePageId: string;
  activePage: PageData | undefined;
  breakpoint: Breakpoint;
  selectedElementId: string | null;
  selectedElement: CanvasElement | null;
  selectedParentId: string | null;
  hoveredElementId: string | null;
  activeTab: "elements" | "layers" | "pages" | "styles";
  previewMode: boolean;
  saveStatus: "saved" | "saving" | "unsaved" | "error";
  canUndo: boolean;
  canRedo: boolean;

  setBreakpoint: (bp: Breakpoint) => void;
  setSelectedElementId: (id: string | null) => void;
  setHoveredElementId: (id: string | null) => void;
  setActiveTab: (tab: "elements" | "layers" | "pages" | "styles") => void;
  setPreviewMode: (val: boolean) => void;
  setActivePageId: (id: string) => void;

  updateElementProp: (key: string, value: any, isResponsive?: boolean) => void;
  updateElementProps: (id: string, props: Record<string, any>) => void;
  updateInlineText: (id: string, text: string) => void;
  addElement: (
    type: ElementType,
    targetId?: string,
    position?: "inside" | "before" | "after"
  ) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  copyElement: (id?: string) => void;
  pasteElement: (targetId?: string) => void;
  selectParent: (parentId: string) => void;

  addPage: (name: string, slug: string) => Promise<void>;
  updatePageMeta: (pageId: string, meta: Partial<PageData>) => void;
  deletePage: (pageId: string) => Promise<void>;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  updateSeoSettings: (seo: Partial<SeoSettings>) => void;

  undo: () => void;
  redo: () => void;
  saveProject: () => Promise<boolean>;
  publishProject: () => Promise<boolean>;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};

export const EditorProvider: React.FC<{
  initialProject: ProjectData;
  children: ReactNode;
}> = ({ initialProject, children }) => {
  const [project, setProject] = useState<ProjectData>(initialProject);
  const [activePageId, setActivePageId] = useState<string>(
    initialProject.pages[0]?.id || ""
  );
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "elements" | "layers" | "pages" | "styles"
  >("elements");
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<
    "saved" | "saving" | "unsaved" | "error"
  >("saved");

  // Undo / Redo history stacks (stores snapshots of ProjectData pages)
  const historyRef = useRef<PageData[][]>([initialProject.pages]);
  const historyIndexRef = useRef<number>(0);
  const clipboardRef = useRef<CanvasElement | null>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activePage = project.pages.find((p) => p.id === activePageId);

  // Find selected element in active page
  let selectedElement: CanvasElement | null = null;
  let selectedParentId: string | null = null;
  if (activePage && selectedElementId) {
    const found = findElementInTree(activePage.root, selectedElementId);
    if (found) {
      selectedElement = found.element;
      selectedParentId = found.parent?.id || null;
    }
  }

  // Push new state to history
  const pushHistory = useCallback((newPages: PageData[]) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(newPages);
    if (nextHistory.length > 50) nextHistory.shift();
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  }, []);

  // Update active page root element
  const updateActivePageRoot = useCallback(
    (updater: (root: CanvasElement) => CanvasElement) => {
      setProject((prev) => {
        const nextPages = prev.pages.map((p) => {
          if (p.id === activePageId) {
            return {
              ...p,
              root: updater(p.root),
            };
          }
          return p;
        });

        pushHistory(nextPages);
        setSaveStatus("unsaved");

        return {
          ...prev,
          pages: nextPages,
        };
      });
    },
    [activePageId, pushHistory]
  );

  // Update element prop with responsive awareness
  const updateElementProp = useCallback(
    (key: string, value: any, isResponsive: boolean = false) => {
      if (!selectedElementId) return;

      updateActivePageRoot((root) =>
        updateElementInTree(root, selectedElementId, (elem) => {
          let updatedProps = { ...elem.props };
          if (isResponsive) {
            const currentProp = updatedProps[key];
            const responsiveObj =
              typeof currentProp === "object" && currentProp !== null && !Array.isArray(currentProp)
                ? { ...currentProp }
                : { desktop: currentProp };

            responsiveObj[breakpoint] = value;
            updatedProps[key] = responsiveObj;
          } else {
            updatedProps[key] = value;
          }
          return { ...elem, props: updatedProps };
        })
      );
    },
    [selectedElementId, breakpoint, updateActivePageRoot]
  );

  const updateElementProps = useCallback(
    (id: string, newProps: Record<string, any>) => {
      updateActivePageRoot((root) =>
        updateElementInTree(root, id, (elem) => ({
          ...elem,
          props: { ...elem.props, ...newProps },
        }))
      );
    },
    [updateActivePageRoot]
  );

  const updateInlineText = useCallback(
    (id: string, text: string) => {
      updateActivePageRoot((root) =>
        updateElementInTree(root, id, (elem) => ({
          ...elem,
          props: { ...elem.props, text },
        }))
      );
    },
    [updateActivePageRoot]
  );

  // Add Element
  const addElement = useCallback(
    (
      type: ElementType,
      targetId?: string,
      position: "inside" | "before" | "after" = "inside"
    ) => {
      const newElement = createDefaultElement(type);
      const destinationId = targetId || selectedElementId || activePage?.root.id;

      if (!destinationId) return;

      updateActivePageRoot((root) =>
        insertElementInTree(root, destinationId, newElement, position)
      );

      setSelectedElementId(newElement.id);
    },
    [selectedElementId, activePage, updateActivePageRoot]
  );

  // Delete Element
  const deleteElement = useCallback(
    (id: string) => {
      if (activePage && activePage.root.id === id) {
        return; // Prevent deleting root
      }
      updateActivePageRoot((root) => deleteElementFromTree(root, id));
      if (selectedElementId === id) {
        setSelectedElementId(null);
      }
    },
    [activePage, selectedElementId, updateActivePageRoot]
  );

  // Duplicate Element
  const duplicateElement = useCallback(
    (id: string) => {
      if (!activePage) return;
      const found = findElementInTree(activePage.root, id);
      if (!found || !found.parent) return;

      const cloned = cloneElementWithNewIds(found.element);
      updateActivePageRoot((root) =>
        insertElementInTree(root, id, cloned, "after")
      );
      setSelectedElementId(cloned.id);
    },
    [activePage, updateActivePageRoot]
  );

  // Copy Element
  const copyElement = useCallback(
    (id?: string) => {
      const targetId = id || selectedElementId;
      if (!activePage || !targetId) return;
      const found = findElementInTree(activePage.root, targetId);
      if (found) {
        clipboardRef.current = found.element;
      }
    },
    [activePage, selectedElementId]
  );

  // Paste Element
  const pasteElement = useCallback(
    (targetId?: string) => {
      if (!clipboardRef.current) return;
      const destId = targetId || selectedElementId || activePage?.root.id;
      if (!destId) return;

      const cloned = cloneElementWithNewIds(clipboardRef.current);
      updateActivePageRoot((root) =>
        insertElementInTree(root, destId, cloned, "inside")
      );
      setSelectedElementId(cloned.id);
    },
    [selectedElementId, activePage, updateActivePageRoot]
  );

  const selectParent = useCallback((parentId: string) => {
    setSelectedElementId(parentId);
  }, []);

  // Global Theme Styles
  const updateGlobalStyles = useCallback((newStyles: Partial<GlobalStyles>) => {
    setProject((prev) => ({
      ...prev,
      globalStyles: { ...prev.globalStyles, ...newStyles },
    }));
    setSaveStatus("unsaved");
  }, []);

  // SEO Settings
  const updateSeoSettings = useCallback((newSeo: Partial<SeoSettings>) => {
    setProject((prev) => ({
      ...prev,
      seoSettings: { ...prev.seoSettings, ...newSeo },
    }));
    setSaveStatus("unsaved");
  }, []);

  // Page Management
  const addPage = useCallback(
    async (name: string, slug: string) => {
      const newPage: PageData = {
        id: generateId("page"),
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        isHomePage: false,
        seoTitle: name,
        seoDescription: `Welcome to ${name}`,
        root: {
          id: generateId("root"),
          type: "container",
          name: "Page Root",
          props: {
            width: "100%",
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
          },
          children: [
            {
              id: generateId("sec"),
              type: "section",
              props: {
                paddingTop: 80,
                paddingBottom: 80,
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              },
              children: [
                {
                  id: generateId("h"),
                  type: "heading",
                  props: { text: name, tag: "h1", fontSize: 48, textAlign: "center" },
                  children: [],
                },
                {
                  id: generateId("p"),
                  type: "paragraph",
                  props: { text: "Add your elements and design this page.", textAlign: "center" },
                  children: [],
                },
              ],
            },
          ],
        },
      };

      setProject((prev) => {
        const nextPages = [...prev.pages, newPage];
        pushHistory(nextPages);
        return { ...prev, pages: nextPages };
      });
      setActivePageId(newPage.id);
      setSaveStatus("unsaved");
    },
    [pushHistory]
  );

  const updatePageMeta = useCallback(
    (pageId: string, meta: Partial<PageData>) => {
      setProject((prev) => {
        const nextPages = prev.pages.map((p) => {
          if (p.id === pageId) {
            return { ...p, ...meta };
          }
          return p;
        });
        return { ...prev, pages: nextPages };
      });
      setSaveStatus("unsaved");
    },
    []
  );

  const deletePage = useCallback(
    async (pageId: string) => {
      if (project.pages.length <= 1) return; // Must have at least 1 page

      setProject((prev) => {
        const nextPages = prev.pages.filter((p) => p.id !== pageId);
        pushHistory(nextPages);
        return { ...prev, pages: nextPages };
      });

      const remaining = project.pages.filter((p) => p.id !== pageId);
      if (activePageId === pageId && remaining[0]) {
        setActivePageId(remaining[0].id);
      }
      setSaveStatus("unsaved");
    },
    [project.pages, activePageId, pushHistory]
  );

  // Undo / Redo
  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    historyIndexRef.current -= 1;
    const previousPages = historyRef.current[historyIndexRef.current];
    setProject((prev) => ({ ...prev, pages: previousPages }));
    setSaveStatus("unsaved");
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    historyIndexRef.current += 1;
    const nextPages = historyRef.current[historyIndexRef.current];
    setProject((prev) => ({ ...prev, pages: nextPages }));
    setSaveStatus("unsaved");
  }, [canRedo]);

  // Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Ctrl+C, Ctrl+V, Delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.getAttribute("contenteditable") === "true";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveProject();
        return;
      }

      if (!isInput) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
          e.preventDefault();
          copyElement();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
          e.preventDefault();
          pasteElement();
        } else if (e.key === "Delete" || e.key === "Backspace") {
          if (selectedElementId) {
            e.preventDefault();
            deleteElement(selectedElementId);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, copyElement, pasteElement, deleteElement, selectedElementId]);

  // Save Project to Backend
  const saveProject = useCallback(async (): Promise<boolean> => {
    try {
      setSaveStatus("saving");
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          pages: project.pages,
          globalStyles: project.globalStyles,
          seoSettings: project.seoSettings,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setProject((prev) => ({
        ...prev,
        draftVersion: data.draftVersion || prev.draftVersion + 1,
      }));
      setSaveStatus("saved");
      return true;
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
      return false;
    }
  }, [project]);

  // Publish Project
  const publishProject = useCallback(async (): Promise<boolean> => {
    try {
      setSaveStatus("saving");
      // First ensure draft is saved
      await saveProject();

      const res = await fetch(`/api/projects/${project.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Publish failed");
      const data = await res.json();
      setProject((prev) => ({
        ...prev,
        status: "published",
        publishedVersion: data.publishedVersion,
        publishedAt: data.publishedAt,
      }));
      setSaveStatus("saved");
      return true;
    } catch (err) {
      console.error("Publish error:", err);
      setSaveStatus("error");
      return false;
    }
  }, [project.id, saveProject]);

  // Autosave after 3 seconds of inactivity if unsaved
  useEffect(() => {
    if (saveStatus === "unsaved") {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
      autosaveTimeoutRef.current = setTimeout(() => {
        saveProject();
      }, 3000);
    }
    return () => {
      if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);
    };
  }, [saveStatus, saveProject]);

  return (
    <EditorContext.Provider
      value={{
        project,
        activePageId,
        activePage,
        breakpoint,
        selectedElementId,
        selectedElement,
        selectedParentId,
        hoveredElementId,
        activeTab,
        previewMode,
        saveStatus,
        canUndo,
        canRedo,

        setBreakpoint,
        setSelectedElementId,
        setHoveredElementId,
        setActiveTab,
        setPreviewMode,
        setActivePageId,

        updateElementProp,
        updateElementProps,
        updateInlineText,
        addElement,
        deleteElement,
        duplicateElement,
        copyElement,
        pasteElement,
        selectParent,

        addPage,
        updatePageMeta,
        deletePage,
        updateGlobalStyles,
        updateSeoSettings,

        undo,
        redo,
        saveProject,
        publishProject,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
