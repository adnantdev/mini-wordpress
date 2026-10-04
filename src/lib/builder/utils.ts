import { Breakpoint, CanvasElement, ElementType, PageData, ProjectData } from "@/types/editor";
import { COMPONENT_REGISTRY } from "./registry";

export function generateId(prefix: string = "el"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createDefaultElement(type: ElementType): CanvasElement {
  const def = COMPONENT_REGISTRY[type];
  const id = generateId(type);

  const newElem: CanvasElement = {
    id,
    type,
    name: def?.label || type,
    props: { ...(def?.defaultProps || {}) },
    children: [],
  };

  // Provide starter children for container/columns/card where helpful
  if (type === "columns") {
    newElem.children = [
      {
        id: generateId("col"),
        type: "container",
        name: "Column 1",
        props: {
          width: "100%",
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: "#f8fafc",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        },
        children: [
          {
            id: generateId("heading"),
            type: "heading",
            name: "Heading",
            props: { text: "Column One", tag: "h3", fontSize: 24, fontWeight: "600" },
            children: [],
          },
          {
            id: generateId("p"),
            type: "paragraph",
            name: "Paragraph",
            props: { text: "Add your custom content, images, or interactive elements here." },
            children: [],
          },
        ],
      },
      {
        id: generateId("col"),
        type: "container",
        name: "Column 2",
        props: {
          width: "100%",
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: "#f8fafc",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        },
        children: [
          {
            id: generateId("heading"),
            type: "heading",
            name: "Heading",
            props: { text: "Column Two", tag: "h3", fontSize: 24, fontWeight: "600" },
            children: [],
          },
          {
            id: generateId("p"),
            type: "paragraph",
            name: "Paragraph",
            props: { text: "Customize styling or drag and drop any block into this column." },
            children: [],
          },
        ],
      },
    ];
  }

  return newElem;
}

/**
 * Resolves responsive properties: checks breakpoint -> tablet -> desktop -> default
 */
export function resolveResponsiveProp<T = any>(
  value: any,
  breakpoint: Breakpoint,
  defaultValue?: T
): T {
  if (value === undefined || value === null) {
    return defaultValue as T;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    if (breakpoint === "mobile") {
      if (value.mobile !== undefined && value.mobile !== "") return value.mobile;
      if (value.tablet !== undefined && value.tablet !== "") return value.tablet;
      if (value.desktop !== undefined && value.desktop !== "") return value.desktop;
    } else if (breakpoint === "tablet") {
      if (value.tablet !== undefined && value.tablet !== "") return value.tablet;
      if (value.desktop !== undefined && value.desktop !== "") return value.desktop;
    } else {
      if (value.desktop !== undefined && value.desktop !== "") return value.desktop;
    }
  }

  return value as T;
}

/**
 * Computes CSS styles object from element props and active breakpoint
 */
export function computeElementStyles(
  props: Record<string, any> | undefined | null,
  breakpoint: Breakpoint = "desktop",
  customStyles: Record<string, any> = {}
): React.CSSProperties {
  const safeProps = props || {};
  const getProp = (key: string, def?: any) =>
    resolveResponsiveProp(safeProps[key], breakpoint, def);

  const style: React.CSSProperties = {
    ...customStyles,
  };

  // Layout
  const width = getProp("width");
  if (width) style.width = width;

  const maxWidth = getProp("maxWidth");
  if (maxWidth && maxWidth !== "none") style.maxWidth = maxWidth;

  const minHeight = getProp("minHeight");
  if (minHeight) style.minHeight = minHeight;

  const height = getProp("height");
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  const display = getProp("display");
  if (display) style.display = display;

  const flexDirection = getProp("flexDirection");
  if (flexDirection) style.flexDirection = flexDirection;

  const justifyContent = getProp("justifyContent");
  if (justifyContent) style.justifyContent = justifyContent;

  const alignItems = getProp("alignItems");
  if (alignItems) style.alignItems = alignItems;

  const gap = getProp("gap");
  if (gap !== undefined) style.gap = `${gap}px`;

  const overflow = getProp("overflow");
  if (overflow) style.overflow = overflow;

  // Columns & Grid
  const columnsCount = getProp("columnsCount");
  const stackOnMobile = getProp("stackOnMobile", true);
  if (columnsCount) {
    if (stackOnMobile && breakpoint === "mobile") {
      style.gridTemplateColumns = "1fr";
    } else if (stackOnMobile && breakpoint === "tablet" && columnsCount > 2) {
      style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    } else {
      style.gridTemplateColumns = `repeat(${columnsCount}, minmax(0, 1fr))`;
    }
  }

  const gridCols = getProp("gridCols");
  if (gridCols) {
    if (breakpoint === "mobile") {
      style.gridTemplateColumns = "1fr";
    } else if (breakpoint === "tablet") {
      style.gridTemplateColumns = `repeat(${Math.min(gridCols, 2)}, minmax(0, 1fr))`;
    } else {
      style.gridTemplateColumns = `repeat(${gridCols}, minmax(0, 1fr))`;
    }
  }

  // Spacing
  const pt = getProp("paddingTop");
  const pr = getProp("paddingRight");
  const pb = getProp("paddingBottom");
  const pl = getProp("paddingLeft");
  if (pt !== undefined) style.paddingTop = `${pt}px`;
  if (pr !== undefined) style.paddingRight = `${pr}px`;
  if (pb !== undefined) style.paddingBottom = `${pb}px`;
  if (pl !== undefined) style.paddingLeft = `${pl}px`;

  const mt = getProp("marginTop");
  const mr = getProp("marginRight");
  const mb = getProp("marginBottom");
  const ml = getProp("marginLeft");
  if (mt !== undefined) style.marginTop = `${mt}px`;
  if (mr !== undefined) style.marginRight = `${mr}px`;
  if (mb !== undefined) style.marginBottom = `${mb}px`;
  if (ml !== undefined) style.marginLeft = `${ml}px`;

  // Typography
  const fontSize = getProp("fontSize");
  if (fontSize) style.fontSize = `${fontSize}px`;

  const fontWeight = getProp("fontWeight");
  if (fontWeight) style.fontWeight = fontWeight;

  const color = getProp("color");
  if (color) style.color = color;

  const textAlign = getProp("textAlign");
  if (textAlign) style.textAlign = textAlign;

  const lineHeight = getProp("lineHeight");
  if (lineHeight) style.lineHeight = lineHeight;

  const letterSpacing = getProp("letterSpacing");
  if (letterSpacing) style.letterSpacing = letterSpacing;

  // Background
  const backgroundColor = getProp("backgroundColor");
  if (backgroundColor) style.backgroundColor = backgroundColor;

  const backgroundImage = getProp("backgroundImage");
  if (backgroundImage) {
    style.backgroundImage = `url("${backgroundImage}")`;
    style.backgroundSize = getProp("backgroundSize", "cover");
    style.backgroundPosition = getProp("backgroundPosition", "center");
    style.backgroundRepeat = "no-repeat";
  }

  // Border
  const borderWidth = getProp("borderWidth");
  if (borderWidth !== undefined && borderWidth > 0) {
    style.borderWidth = `${borderWidth}px`;
    style.borderStyle = getProp("borderStyle", "solid");
    style.borderColor = getProp("borderColor", "#e2e8f0");
  }

  const borderBottomWidth = getProp("borderBottomWidth");
  if (borderBottomWidth) {
    style.borderBottomWidth = `${borderBottomWidth}px`;
    style.borderBottomStyle = "solid";
    style.borderBottomColor = getProp("borderBottomColor", "#e2e8f0");
  }

  const borderTopWidth = getProp("borderTopWidth");
  if (borderTopWidth) {
    style.borderTopWidth = `${borderTopWidth}px`;
    style.borderTopStyle = "solid";
    style.borderTopColor = getProp("borderTopColor", "#e2e8f0");
  }

  const borderRadius = getProp("borderRadius");
  if (borderRadius !== undefined) style.borderRadius = `${borderRadius}px`;

  // Shadow
  const boxShadow = getProp("boxShadow");
  if (boxShadow && boxShadow !== "none") style.boxShadow = boxShadow;

  // Effects
  const opacity = getProp("opacity");
  if (opacity !== undefined && opacity !== 1) style.opacity = opacity;

  return style;
}

/**
 * Deep search in CanvasElement tree
 */
export function findElementInTree(
  root: CanvasElement,
  id: string
): { element: CanvasElement; parent: CanvasElement | null; index: number } | null {
  if (root.id === id) {
    return { element: root, parent: null, index: 0 };
  }

  for (let i = 0; i < root.children.length; i++) {
    const child = root.children[i];
    if (child.id === id) {
      return { element: child, parent: root, index: i };
    }
    const found = findElementInTree(child, id);
    if (found) return found;
  }

  return null;
}

/**
 * Updates an element's props inside an immutable tree
 */
export function updateElementInTree(
  root: CanvasElement,
  id: string,
  updater: (elem: CanvasElement) => CanvasElement
): CanvasElement {
  if (root.id === id) {
    return updater(root);
  }

  return {
    ...root,
    children: root.children.map((child) =>
      updateElementInTree(child, id, updater)
    ),
  };
}

/**
 * Deletes an element from the tree
 */
export function deleteElementFromTree(
  root: CanvasElement,
  id: string
): CanvasElement {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== id)
      .map((child) => deleteElementFromTree(child, id)),
  };
}

/**
 * Inserts an element as a child of a target or adjacent to it
 */
export function insertElementInTree(
  root: CanvasElement,
  targetId: string,
  newElement: CanvasElement,
  position: "inside" | "before" | "after" = "inside"
): CanvasElement {
  if (position === "inside") {
    if (root.id === targetId) {
      return {
        ...root,
        children: [...root.children, newElement],
      };
    }
    return {
      ...root,
      children: root.children.map((child) =>
        insertElementInTree(child, targetId, newElement, position)
      ),
    };
  }

  // Adjacent insertions
  const childIndex = root.children.findIndex((c) => c.id === targetId);
  if (childIndex !== -1) {
    const newChildren = [...root.children];
    if (position === "before") {
      newChildren.splice(childIndex, 0, newElement);
    } else {
      newChildren.splice(childIndex + 1, 0, newElement);
    }
    return { ...root, children: newChildren };
  }

  return {
    ...root,
    children: root.children.map((child) =>
      insertElementInTree(child, targetId, newElement, position)
    ),
  };
}

/**
 * Clones an element and assigns fresh IDs recursively
 */
export function cloneElementWithNewIds(element: CanvasElement): CanvasElement {
  return {
    ...element,
    id: generateId(element.type),
    children: element.children.map((c) => cloneElementWithNewIds(c)),
  };
}

/**
 * Validates CanvasElement tree structure
 */
export function validateElementTree(element: any): boolean {
  if (!element || typeof element !== "object") return false;
  if (typeof element.id !== "string" || !element.id) return false;
  if (typeof element.type !== "string" || !element.type) return false;
  if (!element.props || typeof element.props !== "object") return false;
  if (!Array.isArray(element.children)) return false;

  for (const child of element.children) {
    if (!validateElementTree(child)) return false;
  }

  return true;
}
