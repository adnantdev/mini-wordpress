"use client";

import React, { useState } from "react";
import { Breakpoint, CanvasElement } from "@/types/editor";
import { computeElementStyles, resolveResponsiveProp } from "./utils";
import {
  ChevronDown,
  Trash2,
  Copy,
  ArrowUp,
  GripVertical,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export interface RendererProps {
  element: CanvasElement;
  breakpoint?: Breakpoint;
  isEditor?: boolean;
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onHover?: (id: string | null) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onSelectParent?: (id: string) => void;
  onDropNewElement?: (targetId: string, position: "inside" | "before" | "after") => void;
  onInlineUpdate?: (id: string, text: string) => void;
  parentId?: string | null;
}

export const CanvasRenderer: React.FC<RendererProps> = ({
  element,
  breakpoint = "desktop",
  isEditor = false,
  selectedId = null,
  hoveredId = null,
  onSelect,
  onHover,
  onDelete,
  onDuplicate,
  onSelectParent,
  onInlineUpdate,
  parentId = null,
}) => {
  const isSelected = isEditor && selectedId === element.id;
  const isHovered = isEditor && !isSelected && hoveredId === element.id;
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({ 0: true });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const safeProps = element.props || {};
  const getProp = (key: string, def?: any) =>
    resolveResponsiveProp(safeProps[key], breakpoint, def);

  const styles = computeElementStyles(safeProps, breakpoint);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditor) {
      e.stopPropagation();
      onSelect?.(element.id, e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isEditor) {
      e.stopPropagation();
      onHover?.(element.id);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isEditor) {
      e.stopPropagation();
      onHover?.(null);
    }
  };

  // Render element content based on type
  const renderInnerContent = () => {
    switch (element.type) {
      case "heading": {
        const Tag = (getProp("tag", "h2") || "h2") as React.ElementType;
        const text = getProp("text", "Heading Text");
        return (
          <Tag
            style={styles}
            contentEditable={isEditor && isSelected}
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLElement>) => {
              if (isEditor) {
                onInlineUpdate?.(element.id, e.currentTarget.innerText);
              }
            }}
          >
            {text}
          </Tag>
        );
      }

      case "paragraph": {
        const text = getProp("text", "Paragraph text goes here.");
        return (
          <p
            style={styles}
            contentEditable={isEditor && isSelected}
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLElement>) => {
              if (isEditor) {
                onInlineUpdate?.(element.id, e.currentTarget.innerText);
              }
            }}
          >
            {text}
          </p>
        );
      }

      case "text": {
        const text = getProp("text", "Text badge");
        return (
          <span
            style={styles}
            contentEditable={isEditor && isSelected}
            suppressContentEditableWarning
            onBlur={(e: React.FocusEvent<HTMLElement>) => {
              if (isEditor) {
                onInlineUpdate?.(element.id, e.currentTarget.innerText);
              }
            }}
          >
            {text}
          </span>
        );
      }

      case "link": {
        const text = getProp("text", "Link Text");
        const href = getProp("href", "#");
        const target = getProp("target", "_self");
        return (
          <a
            href={isEditor ? undefined : href}
            target={target}
            style={styles}
            className="hover:underline transition-all"
            onClick={(e) => {
              if (isEditor) e.preventDefault();
            }}
          >
            {text}
          </a>
        );
      }

      case "image": {
        const src = getProp(
          "src",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
        );
        const alt = getProp("alt", "Image description");
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            style={{
              ...styles,
              display: "block",
              maxWidth: "100%",
              height: styles.height || "auto",
            }}
            loading="lazy"
          />
        );
      }

      case "video": {
        const embedUrl = getProp("embedUrl", "https://www.youtube.com/embed/dQw4w9WgXcQ");
        const aspectRatio = getProp("aspectRatio", "16/9");
        return (
          <div
            style={{
              ...styles,
              aspectRatio: aspectRatio.replace("/", " / "),
              overflow: "hidden",
            }}
            className="relative w-full bg-slate-950"
          >
            <iframe
              src={embedUrl}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      case "gallery": {
        const images: string[] = getProp("images", [
          "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80",
        ]);
        const cols = getProp("columnsCount", 3);
        const itemHeight = getProp("height", 240);
        const gap = getProp("gap", 16);
        return (
          <div
            style={{
              ...styles,
              display: "grid",
              gridTemplateColumns:
                breakpoint === "mobile"
                  ? "1fr"
                  : breakpoint === "tablet"
                  ? "repeat(2, 1fr)"
                  : `repeat(${cols}, 1fr)`,
              gap: `${gap}px`,
            }}
          >
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                style={{
                  height: `${itemHeight}px`,
                  borderRadius: styles.borderRadius || "12px",
                  overflow: "hidden",
                }}
                className="relative group bg-slate-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        );
      }

      case "button": {
        const text = getProp("text", "Button");
        const href = getProp("href", "#");
        const target = getProp("target", "_self");
        const variant = getProp("variant", "solid");

        let variantStyle: React.CSSProperties = {};
        if (variant === "outline") {
          variantStyle = {
            backgroundColor: "transparent",
            border: `2px solid ${getProp("color", "#2563eb")}`,
            color: getProp("color", "#2563eb"),
          };
        } else if (variant === "ghost") {
          variantStyle = {
            backgroundColor: "transparent",
            color: getProp("color", "#2563eb"),
          };
        } else if (variant === "glass") {
          variantStyle = {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            color: getProp("color", "#ffffff"),
          };
        }

        const buttonElem = (
          <button
            type="button"
            style={{ ...styles, ...variantStyle }}
            className="font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            onClick={(e) => {
              if (isEditor) e.preventDefault();
            }}
          >
            {text}
          </button>
        );

        if (!isEditor && href && href !== "#") {
          return (
            <a href={href} target={target} className="inline-block">
              {buttonElem}
            </a>
          );
        }
        return buttonElem;
      }

      case "input": {
        const label = getProp("label", "Field Label");
        const placeholder = getProp("placeholder", "Enter text...");
        const inputType = getProp("inputType", "text");
        const required = getProp("required", false);

        return (
          <div className="w-full flex flex-col gap-1.5 text-left">
            {label && (
              <label className="text-xs font-semibold text-slate-700 tracking-wide">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}
            {inputType === "textarea" ? (
              <textarea
                placeholder={placeholder}
                required={required}
                rows={4}
                style={styles}
                className="w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isEditor}
              />
            ) : (
              <input
                type={inputType}
                placeholder={placeholder}
                required={required}
                style={styles}
                className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isEditor}
              />
            )}
          </div>
        );
      }

      case "form": {
        const title = getProp("title", "Contact Us");
        const description = getProp("description", "Send us a message below.");
        const buttonText = getProp("buttonText", "Submit");
        const successMessage = getProp("successMessage", "Thank you! We will get back to you.");

        if (formSubmitted && !isEditor) {
          return (
            <div style={styles} className="text-center p-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <h3 className="text-xl font-bold text-slate-900">Success</h3>
              <p className="text-slate-600 text-sm">{successMessage}</p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-4 text-xs font-medium text-blue-600 hover:underline"
              >
                Submit another response
              </button>
            </div>
          );
        }

        return (
          <form
            style={styles}
            onSubmit={(e) => {
              e.preventDefault();
              if (!isEditor) setFormSubmitted(true);
            }}
            className="flex flex-col gap-4 text-left"
          >
            {title && <h3 className="text-2xl font-bold text-slate-900">{title}</h3>}
            {description && <p className="text-slate-600 text-sm">{description}</p>}

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isEditor}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isEditor}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Message</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How can we help you?"
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={isEditor}
                />
              </div>
            </div>

            {/* Form children if any */}
            {element.children && element.children.length > 0 && (
              <div className="flex flex-col gap-3">
                {element.children.map((child) => (
                  <CanvasRenderer
                    key={child.id}
                    element={child}
                    breakpoint={breakpoint}
                    isEditor={isEditor}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={onSelect}
                    onHover={onHover}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                    onSelectParent={onSelectParent}
                    onInlineUpdate={onInlineUpdate}
                    parentId={element.id}
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-all active:scale-[0.99]"
            >
              {buttonText}
            </button>
          </form>
        );
      }

      case "divider": {
        return <div style={styles} />;
      }

      case "spacer": {
        const height = getProp("height", 48);
        return (
          <div
            style={{
              ...styles,
              height: `${height}px`,
              minHeight: `${height}px`,
            }}
            className={isEditor ? "bg-dashed bg-slate-100/50 border border-slate-200/60 rounded" : ""}
          />
        );
      }

      case "faq": {
        const items = getProp("items", [
          {
            question: "How does SiteForge work?",
            answer: "SiteForge lets you design visual pages, edit properties, and publish in one click.",
          },
          {
            question: "Is published content safe?",
            answer: "Yes, published versions are immutable snapshots isolated from editor drafts.",
          },
        ]);

        return (
          <div style={styles} className="flex flex-col gap-3 w-full">
            {items.map((item: any, idx: number) => {
              const isOpen = faqOpen[idx];
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!isEditor) {
                        e.stopPropagation();
                        setFaqOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
                      }
                    }}
                    className="w-full py-4 px-5 flex items-center justify-between text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }

      case "navbar": {
        const brandText = getProp("brandText", "SiteForge");
        const logoUrl = getProp("logoUrl", "");
        const links: { label: string; href: string }[] = getProp("links", [
          { label: "Features", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "About", href: "#" },
        ]);
        const ctaText = getProp("ctaText", "Get Started");
        const ctaHref = getProp("ctaHref", "#");
        const sticky = getProp("sticky", true);

        return (
          <header
            style={styles}
            className={`w-full flex items-center justify-between ${
              sticky ? "sticky top-0 z-30" : ""
            }`}
          >
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={brandText} className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-xl font-extrabold tracking-tight">
                  {brandText}
                </span>
              )}
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={isEditor ? undefined : link.href}
                  className="text-sm font-medium opacity-85 hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {ctaText && (
                <a
                  href={isEditor ? undefined : ctaHref}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
                  onClick={(e) => {
                    if (isEditor) e.preventDefault();
                  }}
                >
                  {ctaText}
                </a>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <GripVertical className="w-5 h-5" />
            </button>
          </header>
        );
      }

      case "footer": {
        const brandText = getProp("brandText", "SiteForge Studio");
        const description = getProp("description", "Next-gen visual web publishing.");
        const copyright = getProp("copyright", "© 2026 SiteForge. All rights reserved.");
        const links: { label: string; href: string }[] = getProp("links", [
          { label: "Privacy", href: "#" },
          { label: "Terms", href: "#" },
          { label: "Support", href: "#" },
        ]);

        return (
          <footer style={styles} className="w-full">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="text-lg font-bold text-white tracking-tight">
                  {brandText}
                </span>
                {description && <p className="text-xs text-slate-400">{description}</p>}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
                {links.map((link, idx) => (
                  <a
                    key={idx}
                    href={isEditor ? undefined : link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <p className="text-xs text-slate-500">{copyright}</p>
            </div>
          </footer>
        );
      }

      // Default container / section / card / columns / grid
      case "section":
      case "container":
      case "card":
      case "columns":
      case "grid":
      default: {
        const Tag = element.type === "section" ? "section" : "div";
        const children = Array.isArray(element.children) ? element.children : [];
        return (
          <Tag style={styles}>
            {children.length > 0 ? (
              children.map((child) => (
                <CanvasRenderer
                  key={child.id}
                  element={child}
                  breakpoint={breakpoint}
                  isEditor={isEditor}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelect={onSelect}
                  onHover={onHover}
                  onDelete={onDelete}
                  onDuplicate={onDuplicate}
                  onSelectParent={onSelectParent}
                  onInlineUpdate={onInlineUpdate}
                  parentId={element.id}
                />
              ))
            ) : isEditor ? (
              <div className="py-6 px-4 border-2 border-dashed border-slate-300 rounded-lg text-center text-xs font-medium text-slate-400 w-full select-none">
                Empty {element.name || element.type}. Drag or add elements here.
              </div>
            ) : null}
          </Tag>
        );
      }
    }
  };

  // If public live mode, return pure element without editor chrome
  if (!isEditor) {
    return renderInnerContent();
  }

  // Editor Mode with selection highlight badge, parent selector, delete, duplicate
  return (
    <div
      id={`canvas-el-${element.id}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-all duration-100 ${
        isSelected
          ? "ring-2 ring-blue-600 ring-offset-1 z-20"
          : isHovered
          ? "ring-1 ring-blue-400 ring-offset-1 z-10"
          : ""
      }`}
    >
      {/* Selection Control Pill */}
      {isSelected && (
        <div
          className="absolute -top-7 left-0 z-30 flex items-center gap-1.5 px-2 py-0.5 bg-blue-600 text-white rounded text-[11px] font-medium shadow-md pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-semibold uppercase tracking-wider text-[10px]">
            {element.name || element.type}
          </span>

          {parentId && (
            <button
              type="button"
              title="Select Parent"
              onClick={() => onSelectParent?.(parentId)}
              className="p-0.5 hover:bg-blue-700 rounded text-blue-100 hover:text-white"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            title="Duplicate"
            onClick={() => onDuplicate?.(element.id)}
            className="p-0.5 hover:bg-blue-700 rounded text-blue-100 hover:text-white"
          >
            <Copy className="w-3 h-3" />
          </button>

          <button
            type="button"
            title="Delete"
            onClick={() => onDelete?.(element.id)}
            className="p-0.5 hover:bg-red-600 rounded text-red-200 hover:text-white"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Hover outline badge */}
      {isHovered && !isSelected && (
        <div className="absolute -top-5 left-1 z-20 px-1.5 py-0.2 bg-blue-500 text-white text-[9px] font-semibold rounded-sm uppercase tracking-wider pointer-events-none">
          {element.name || element.type}
        </div>
      )}

      {renderInnerContent()}
    </div>
  );
};
