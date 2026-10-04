export type ElementType =
  // Layout
  | "section"
  | "container"
  | "columns"
  | "grid"
  | "spacer"
  // Typography
  | "heading"
  | "paragraph"
  | "text"
  | "link"
  // Media
  | "image"
  | "video"
  | "gallery"
  // Interactive
  | "button"
  | "input"
  | "form"
  // Content
  | "card"
  | "divider"
  | "faq"
  // Navigation
  | "navbar"
  | "footer";

export type Breakpoint = "desktop" | "tablet" | "mobile";

export type ResponsiveValue<T> =
  | T
  | {
      desktop?: T;
      tablet?: T;
      mobile?: T;
    };

export interface CanvasElement {
  id: string;
  type: ElementType;
  name?: string;
  props: Record<string, any>;
  children: CanvasElement[];
}

export interface PageData {
  id: string;
  name: string;
  slug: string;
  isHomePage: boolean;
  seoTitle?: string;
  seoDescription?: string;
  root: CanvasElement;
}

export interface GlobalStyles {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string; // 'none' | 'sm' | 'md' | 'lg' | 'full'
  buttonStyle: "solid" | "outline" | "ghost" | "glass";
}

export interface SeoSettings {
  siteTitle?: string;
  metaDescription?: string;
  favicon?: string;
  socialImage?: string;
  ogType?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: "draft" | "published" | "archived";
  templateId?: string | null;
  draftVersion: number;
  publishedVersion: number;
  publicSlug: string;
  customDomain?: string | null;
  globalStyles: GlobalStyles;
  seoSettings: SeoSettings;
  pages: PageData[];
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface TemplateData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  thumbnail?: string | null;
  isDefault: boolean;
  pages: PageData[];
  globalStyles: GlobalStyles;
  seoSettings: SeoSettings;
}

export type PropertyInputType =
  | "text"
  | "textarea"
  | "number"
  | "color"
  | "select"
  | "toggle"
  | "spacing"
  | "border"
  | "shadow"
  | "typography"
  | "image"
  | "icon"
  | "code"
  | "links-list"
  | "faq-list";

export interface PropertyFieldConfig {
  key: string;
  label: string;
  type: PropertyInputType;
  category?: "layout" | "spacing" | "typography" | "background" | "border" | "shadow" | "effects" | "custom";
  responsive?: boolean;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: any;
}

export interface ComponentDefinition {
  type: ElementType;
  label: string;
  category: "layout" | "typography" | "media" | "interactive" | "content" | "navigation";
  iconName: string;
  defaultProps: Record<string, any>;
  allowedChildren?: ElementType[] | "all" | "none";
  schema: PropertyFieldConfig[];
  canHaveChildren: boolean;
}
