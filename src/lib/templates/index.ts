import { CanvasElement, PageData, TemplateData } from "@/types/editor";
import { generateId } from "../builder/utils";

// Helper to create page
function makePage(
  name: string,
  slug: string,
  isHomePage: boolean,
  children: CanvasElement[],
  seoTitle?: string,
  seoDescription?: string
): PageData {
  return {
    id: generateId("page"),
    name,
    slug,
    isHomePage,
    seoTitle: seoTitle || name,
    seoDescription: seoDescription || `Discover ${name} at SiteForge`,
    root: {
      id: generateId("root"),
      type: "container",
      name: "Page Root",
      props: {
        width: "100%",
        maxWidth: "100%",
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
      },
      children,
    },
  };
}

export const TEMPLATES: TemplateData[] = [
  // 1. Blank Template
  {
    id: "template-blank",
    name: "Blank Canvas",
    slug: "blank",
    category: "Minimal",
    description: "A clean, blank starting point for building custom layouts from scratch.",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    isDefault: true,
    globalStyles: {
      primaryColor: "#2563eb",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "md",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "My New Website",
      metaDescription: "Built with SiteForge Visual Builder",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "MyWebsite",
              links: [
                { label: "Home", href: "#" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ],
              ctaText: "Get Started",
            },
            children: [],
          },
          {
            id: generateId("sec"),
            type: "section",
            props: {
              paddingTop: 100,
              paddingBottom: 100,
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            },
            children: [
              {
                id: generateId("con"),
                type: "container",
                props: {
                  maxWidth: "800px",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 16,
                },
                children: [
                  {
                    id: generateId("text"),
                    type: "text",
                    props: { text: "START BUILDING" },
                    children: [],
                  },
                  {
                    id: generateId("h"),
                    type: "heading",
                    props: {
                      text: "Your Blank Canvas Awaits",
                      tag: "h1",
                      fontSize: 52,
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("p"),
                    type: "paragraph",
                    props: {
                      text: "Drag components from the left sidebar to start creating your new pages. Customize colors, fonts, layout, and publish in one click.",
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("btn"),
                    type: "button",
                    props: { text: "Add Element" },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "MyWebsite" },
            children: [],
          },
        ],
        "Home",
        "Welcome to your new website"
      ),
    ],
  },

  // 2. Business Template
  {
    id: "template-business",
    name: "Corporate & Enterprise",
    slug: "business",
    category: "Business",
    description: "Professional multi-section corporate landing page designed for consulting, finance, and enterprise services.",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#0f172a",
      secondaryColor: "#3b82f6",
      backgroundColor: "#ffffff",
      textColor: "#334155",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "lg",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "Apex Global Advisors | Strategic Enterprise Consulting",
      metaDescription: "Accelerating global business transformation with data-driven advisory services.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "Apex Advisors",
              links: [
                { label: "Solutions", href: "#solutions" },
                { label: "Why Us", href: "#why" },
                { label: "Case Studies", href: "#cases" },
                { label: "Contact", href: "#contact" },
              ],
              ctaText: "Book Consultation",
              backgroundColor: "#ffffff",
            },
            children: [],
          },
          {
            id: generateId("hero-sec"),
            type: "section",
            props: {
              paddingTop: 96,
              paddingBottom: 96,
              backgroundColor: "#f8fafc",
            },
            children: [
              {
                id: generateId("hero-con"),
                type: "container",
                props: { maxWidth: "1200px", gap: 32 },
                children: [
                  {
                    id: generateId("cols"),
                    type: "columns",
                    props: { columnsCount: 2, gap: 40 },
                    children: [
                      {
                        id: generateId("col-left"),
                        type: "container",
                        props: { gap: 20, justifyContent: "center" },
                        children: [
                          {
                            id: generateId("badge"),
                            type: "text",
                            props: { text: "TRUSTED BY 250+ ENTERPRISES" },
                            children: [],
                          },
                          {
                            id: generateId("hero-h"),
                            type: "heading",
                            props: {
                              text: "Strategic Consulting for the Modern Enterprise",
                              tag: "h1",
                              fontSize: 50,
                              fontWeight: "800",
                              lineHeight: "1.15",
                            },
                            children: [],
                          },
                          {
                            id: generateId("hero-p"),
                            type: "paragraph",
                            props: {
                              text: "We partner with visionary leaders to engineer scalable operations, maximize capital efficiency, and drive sustainable growth.",
                              fontSize: 18,
                            },
                            children: [],
                          },
                          {
                            id: generateId("hero-btn"),
                            type: "button",
                            props: {
                              text: "Schedule Strategy Call →",
                              backgroundColor: "#0f172a",
                              paddingTop: 16,
                              paddingBottom: 16,
                              paddingLeft: 32,
                              paddingRight: 32,
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId("col-right"),
                        type: "container",
                        props: { alignItems: "center", justifyContent: "center" },
                        children: [
                          {
                            id: generateId("img"),
                            type: "image",
                            props: {
                              src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
                              alt: "Business leadership meeting",
                              borderRadius: 16,
                              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("services-sec"),
            type: "section",
            props: { paddingTop: 80, paddingBottom: 80, backgroundColor: "#ffffff" },
            children: [
              {
                id: generateId("services-con"),
                type: "container",
                props: { maxWidth: "1200px", gap: 40, alignItems: "center" },
                children: [
                  {
                    id: generateId("services-h"),
                    type: "heading",
                    props: {
                      text: "Core Practice Areas",
                      tag: "h2",
                      fontSize: 38,
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("services-grid"),
                    type: "grid",
                    props: { gridCols: 3, gap: 24, width: "100%" },
                    children: [
                      {
                        id: generateId("card-1"),
                        type: "card",
                        props: {
                          backgroundColor: "#f8fafc",
                          borderWidth: 1,
                          borderColor: "#e2e8f0",
                          paddingTop: 32,
                          paddingBottom: 32,
                          paddingLeft: 24,
                          paddingRight: 24,
                        },
                        children: [
                          {
                            id: generateId("h-card-1"),
                            type: "heading",
                            props: { text: "Mergers & Acquisitions", tag: "h4", fontSize: 22 },
                            children: [],
                          },
                          {
                            id: generateId("p-card-1"),
                            type: "paragraph",
                            props: { text: "End-to-end transaction advisory, due diligence, and valuation modeling for high-stakes capital events." },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId("card-2"),
                        type: "card",
                        props: {
                          backgroundColor: "#f8fafc",
                          borderWidth: 1,
                          borderColor: "#e2e8f0",
                          paddingTop: 32,
                          paddingBottom: 32,
                          paddingLeft: 24,
                          paddingRight: 24,
                        },
                        children: [
                          {
                            id: generateId("h-card-2"),
                            type: "heading",
                            props: { text: "Digital Transformation", tag: "h4", fontSize: 22 },
                            children: [],
                          },
                          {
                            id: generateId("p-card-2"),
                            type: "paragraph",
                            props: { text: "Modernize legacy systems with cloud architecture, automation pipelines, and resilient cybersecurity frameworks." },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId("card-3"),
                        type: "card",
                        props: {
                          backgroundColor: "#f8fafc",
                          borderWidth: 1,
                          borderColor: "#e2e8f0",
                          paddingTop: 32,
                          paddingBottom: 32,
                          paddingLeft: 24,
                          paddingRight: 24,
                        },
                        children: [
                          {
                            id: generateId("h-card-3"),
                            type: "heading",
                            props: { text: "Operational Excellence", tag: "h4", fontSize: 22 },
                            children: [],
                          },
                          {
                            id: generateId("p-card-3"),
                            type: "paragraph",
                            props: { text: "Supply chain optimization, cost reduction programs, and workflow agility across multi-market footprints." },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("cta-sec"),
            type: "section",
            props: {
              paddingTop: 80,
              paddingBottom: 80,
              backgroundColor: "#0f172a",
              color: "#ffffff",
            },
            children: [
              {
                id: generateId("cta-con"),
                type: "container",
                props: { maxWidth: "800px", alignItems: "center", textAlign: "center", gap: 20 },
                children: [
                  {
                    id: generateId("cta-h"),
                    type: "heading",
                    props: {
                      text: "Ready to accelerate your strategic goals?",
                      tag: "h2",
                      fontSize: 36,
                      color: "#ffffff",
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("cta-p"),
                    type: "paragraph",
                    props: {
                      text: "Connect with our managing partners for a confidential discussion about your business initiatives.",
                      color: "#94a3b8",
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("cta-btn"),
                    type: "button",
                    props: {
                      text: "Request Confidential Proposal",
                      backgroundColor: "#3b82f6",
                      color: "#ffffff",
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "Apex Advisors" },
            children: [],
          },
        ],
        "Home",
        "Apex Advisors - Strategic Enterprise Consulting"
      ),
    ],
  },

  // 3. SaaS Landing Page
  {
    id: "template-saas",
    name: "SaaS & AI Platform",
    slug: "saas",
    category: "Technology",
    description: "Cutting-edge software product landing page with hero badges, product screenshots, pricing tiers, and interactive FAQ.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#6366f1",
      secondaryColor: "#ec4899",
      backgroundColor: "#090d16",
      textColor: "#f8fafc",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "xl",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "Nova AI | The Intelligent Automation Suite",
      metaDescription: "Automate complex workflows with generative intelligence and real-time streaming analytics.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "⚡ Nova AI",
              links: [
                { label: "Features", href: "#features" },
                { label: "Integrations", href: "#integrations" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ],
              ctaText: "Start 14-Day Trial",
              backgroundColor: "#0b0f19",
              textColor: "#f1f5f9",
            },
            children: [],
          },
          {
            id: generateId("hero"),
            type: "section",
            props: {
              paddingTop: 110,
              paddingBottom: 90,
              backgroundColor: "#090d16",
            },
            children: [
              {
                id: generateId("hero-con"),
                type: "container",
                props: { maxWidth: "1000px", alignItems: "center", textAlign: "center", gap: 24 },
                children: [
                  {
                    id: generateId("pill"),
                    type: "text",
                    props: {
                      text: "✨ NOVA 3.0 IS LIVE WITH DEEP REASONING",
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      color: "#a5b4fc",
                      borderColor: "rgba(99, 102, 241, 0.3)",
                      borderWidth: 1,
                    },
                    children: [],
                  },
                  {
                    id: generateId("hero-h"),
                    type: "heading",
                    props: {
                      text: "The Autonomous AI Engine for High-Velocity Teams",
                      tag: "h1",
                      fontSize: 56,
                      fontWeight: "800",
                      color: "#ffffff",
                      textAlign: "center",
                      letterSpacing: "-0.03em",
                    },
                    children: [],
                  },
                  {
                    id: generateId("hero-p"),
                    type: "paragraph",
                    props: {
                      text: "Connect your databases, APIs, and business logic into an autonomous self-optimizing workflow that operates 24/7 with zero latency.",
                      fontSize: 20,
                      color: "#94a3b8",
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("btn-group"),
                    type: "container",
                    props: {
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 16,
                      paddingTop: 12,
                    },
                    children: [
                      {
                        id: generateId("btn1"),
                        type: "button",
                        props: {
                          text: "Start Free Sandbox",
                          backgroundColor: "#6366f1",
                          paddingLeft: 32,
                          paddingRight: 32,
                          paddingTop: 16,
                          paddingBottom: 16,
                          boxShadow: "0 0 30px -5px rgba(99, 102, 241, 0.5)",
                        },
                        children: [],
                      },
                      {
                        id: generateId("btn2"),
                        type: "button",
                        props: {
                          text: "Live Demo",
                          variant: "outline",
                          backgroundColor: "transparent",
                          borderColor: "#334155",
                          color: "#f8fafc",
                          borderWidth: 1,
                        },
                        children: [],
                      },
                    ],
                  },
                  {
                    id: generateId("hero-img"),
                    type: "image",
                    props: {
                      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                      alt: "Nova AI Dashboard Preview",
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: "#1e293b",
                      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
                      marginTop: 32,
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("faq-sec"),
            type: "section",
            props: {
              paddingTop: 80,
              paddingBottom: 90,
              backgroundColor: "#0b0f19",
            },
            children: [
              {
                id: generateId("faq-con"),
                type: "container",
                props: { maxWidth: "800px", alignItems: "center", gap: 32 },
                children: [
                  {
                    id: generateId("faq-h"),
                    type: "heading",
                    props: {
                      text: "Frequently Asked Questions",
                      tag: "h2",
                      fontSize: 36,
                      color: "#ffffff",
                      textAlign: "center",
                    },
                    children: [],
                  },
                  {
                    id: generateId("faq-el"),
                    type: "faq",
                    props: {
                      items: [
                        {
                          question: "How fast can we integrate Nova AI?",
                          answer: "Most engineering teams deploy their first agent workflow in under 15 minutes using our plug-and-play SDK and REST endpoints.",
                        },
                        {
                          question: "Is my proprietary data secure?",
                          answer: "Yes. All data is encrypted at rest and in transit (SOC2 Type II compliant). We never use your proprietary data for model fine-tuning without explicit consent.",
                        },
                        {
                          question: "Can I self-host on private cloud?",
                          answer: "Enterprise plans support private VPC deployment across AWS, Google Cloud, and Microsoft Azure.",
                        },
                      ],
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: {
              brandText: "Nova AI Platform",
              backgroundColor: "#06090e",
            },
            children: [],
          },
        ],
        "Home",
        "Nova AI - Next Generation Automation"
      ),
    ],
  },

  // 4. Creative Agency
  {
    id: "template-agency",
    name: "Creative Agency",
    slug: "agency",
    category: "Creative",
    description: "Bold showcase for design studios, advertising agencies, and production houses with portfolio grids.",
    thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#000000",
      secondaryColor: "#f59e0b",
      backgroundColor: "#ffffff",
      textColor: "#171717",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "none",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "Studio Mono | Brand Strategy & Digital Experiences",
      metaDescription: "Award-winning design studio shaping culture and digital brand ecosystems.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "STUDIO MONO",
              links: [
                { label: "Works", href: "#works" },
                { label: "Studio", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Contact", href: "#contact" },
              ],
              ctaText: "Let's Talk",
            },
            children: [],
          },
          {
            id: generateId("hero"),
            type: "section",
            props: { paddingTop: 100, paddingBottom: 80, backgroundColor: "#ffffff" },
            children: [
              {
                id: generateId("con"),
                type: "container",
                props: { maxWidth: "1200px", gap: 24 },
                children: [
                  {
                    id: generateId("tag"),
                    type: "text",
                    props: { text: "DESIGN & CULTURE 2026", backgroundColor: "#000000", color: "#ffffff", borderRadius: 0 },
                    children: [],
                  },
                  {
                    id: generateId("h"),
                    type: "heading",
                    props: {
                      text: "We design iconic brands and immersive digital products.",
                      tag: "h1",
                      fontSize: 60,
                      fontWeight: "800",
                      lineHeight: "1.1",
                    },
                    children: [],
                  },
                  {
                    id: generateId("gallery-block"),
                    type: "gallery",
                    props: {
                      images: [
                        "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
                        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
                      ],
                      height: 320,
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "STUDIO MONO" },
            children: [],
          },
        ],
        "Home",
        "Studio Mono - Iconic Brands"
      ),
    ],
  },

  // 5. Restaurant
  {
    id: "template-restaurant",
    name: "Gourmet Restaurant & Bar",
    slug: "restaurant",
    category: "Hospitality",
    description: "Elegant hospitality website featuring culinary highlights, seasonal menus, and table reservations.",
    thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#c2410c",
      secondaryColor: "#78350f",
      backgroundColor: "#fffbf5",
      textColor: "#292524",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "md",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "L'Arôme Bistro | Artisanal Dining & Cellar",
      metaDescription: "Experience seasonal farm-to-table gastronomy in an intimate, contemporary atmosphere.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "L'Arôme Bistro",
              links: [
                { label: "Menu", href: "#menu" },
                { label: "Our Story", href: "#story" },
                { label: "Private Events", href: "#events" },
                { label: "Hours & Location", href: "#hours" },
              ],
              ctaText: "Reserve Table",
              backgroundColor: "#fffbf5",
            },
            children: [],
          },
          {
            id: generateId("hero"),
            type: "section",
            props: {
              paddingTop: 100,
              paddingBottom: 90,
              backgroundColor: "#fffbf5",
            },
            children: [
              {
                id: generateId("hero-con"),
                type: "container",
                props: { maxWidth: "1100px", gap: 32 },
                children: [
                  {
                    id: generateId("cols"),
                    type: "columns",
                    props: { columnsCount: 2, gap: 36 },
                    children: [
                      {
                        id: generateId("c1"),
                        type: "container",
                        props: { gap: 20, justifyContent: "center" },
                        children: [
                          {
                            id: generateId("badge"),
                            type: "text",
                            props: {
                              text: "MICHELIN GUIDE 2026 SELECTED",
                              backgroundColor: "#fed7aa",
                              color: "#9a3412",
                              borderColor: "#fdba74",
                            },
                            children: [],
                          },
                          {
                            id: generateId("h"),
                            type: "heading",
                            props: {
                              text: "Artisanal Flavors. Handcrafted Memories.",
                              tag: "h1",
                              fontSize: 48,
                              fontWeight: "700",
                            },
                            children: [],
                          },
                          {
                            id: generateId("p"),
                            type: "paragraph",
                            props: {
                              text: "Every dish is an homage to local organic harvests, slow-cooked wood-fired techniques, and curated biodynamic vintages.",
                            },
                            children: [],
                          },
                          {
                            id: generateId("btn"),
                            type: "button",
                            props: {
                              text: "Explore Dinner Menu",
                              backgroundColor: "#c2410c",
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId("c2"),
                        type: "container",
                        props: {},
                        children: [
                          {
                            id: generateId("food-img"),
                            type: "image",
                            props: {
                              src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                              alt: "Artisanal gourmet cuisine",
                              borderRadius: 16,
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "L'Arôme Bistro", backgroundColor: "#1c1917" },
            children: [],
          },
        ],
        "Home",
        "L'Arôme Bistro - Artisanal Dining"
      ),
    ],
  },

  // 6. Solar Business
  {
    id: "template-solar",
    name: "Solar & Clean Energy",
    slug: "solar",
    category: "Services",
    description: "High-converting residential & commercial solar installation website with savings metrics and quote request form.",
    thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#059669",
      secondaryColor: "#eab308",
      backgroundColor: "#ffffff",
      textColor: "#1e293b",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "lg",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "Helios Energy | Zero Down Residential Solar Power",
      metaDescription: "Cut your electric bills by up to 85% with premium Tier-1 solar panels and backup home battery storage.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "☀️ Helios Solar",
              links: [
                { label: "Residential", href: "#residential" },
                { label: "Commercial", href: "#commercial" },
                { label: "Battery Storage", href: "#storage" },
                { label: "Savings Calculator", href: "#calculator" },
              ],
              ctaText: "Calculate Savings",
            },
            children: [],
          },
          {
            id: generateId("hero"),
            type: "section",
            props: {
              paddingTop: 90,
              paddingBottom: 90,
              backgroundColor: "#f0fdf4",
            },
            children: [
              {
                id: generateId("con"),
                type: "container",
                props: { maxWidth: "1150px", gap: 32 },
                children: [
                  {
                    id: generateId("cols"),
                    type: "columns",
                    props: { columnsCount: 2, gap: 32 },
                    children: [
                      {
                        id: generateId("c1"),
                        type: "container",
                        props: { gap: 18, justifyContent: "center" },
                        children: [
                          {
                            id: generateId("badge"),
                            type: "text",
                            props: {
                              text: "⚡ 30% FEDERAL TAX CREDIT QUALIFIED",
                              backgroundColor: "#dcfce7",
                              color: "#15803d",
                              borderColor: "#86efac",
                            },
                            children: [],
                          },
                          {
                            id: generateId("h"),
                            type: "heading",
                            props: {
                              text: "Power Your Home With Free Clean Sunshine",
                              tag: "h1",
                              fontSize: 48,
                              fontWeight: "800",
                            },
                            children: [],
                          },
                          {
                            id: generateId("p"),
                            type: "paragraph",
                            props: {
                              text: "Lock in predictable energy rates, protect against power grid blackouts, and increase your home value with $0 upfront investment.",
                            },
                            children: [],
                          },
                          {
                            id: generateId("btn"),
                            type: "button",
                            props: {
                              text: "Get Free Solar Quote",
                              backgroundColor: "#059669",
                              paddingTop: 16,
                              paddingBottom: 16,
                            },
                            children: [],
                          },
                        ],
                      },
                      {
                        id: generateId("c2"),
                        type: "container",
                        props: {},
                        children: [
                          {
                            id: generateId("form-block"),
                            type: "form",
                            props: {
                              title: "Check Your Roof Eligibility",
                              description: "Enter your details to receive an instant satellite solar assessment.",
                              buttonText: "See My Savings",
                              backgroundColor: "#ffffff",
                              borderRadius: 16,
                            },
                            children: [],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "Helios Solar Solutions" },
            children: [],
          },
        ],
        "Home",
        "Helios Solar - Clean Home Energy"
      ),
    ],
  },

  // 7. Portfolio
  {
    id: "template-portfolio",
    name: "Creator & Designer Portfolio",
    slug: "portfolio",
    category: "Personal",
    description: "Modern portfolio for UI/UX designers, software engineers, and digital consultants.",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    isDefault: false,
    globalStyles: {
      primaryColor: "#7c3aed",
      secondaryColor: "#475569",
      backgroundColor: "#ffffff",
      textColor: "#0f172a",
      fontFamily: "Inter, sans-serif",
      headingFont: "Inter, sans-serif",
      borderRadius: "xl",
      buttonStyle: "solid",
    },
    seoSettings: {
      siteTitle: "Alex Rivers | Senior Product Designer & Architect",
      metaDescription: "Designing digital experiences that bridge human delight and enterprise scalability.",
    },
    pages: [
      makePage(
        "Home",
        "home",
        true,
        [
          {
            id: generateId("nav"),
            type: "navbar",
            props: {
              brandText: "Alex Rivers",
              links: [
                { label: "Case Studies", href: "#projects" },
                { label: "Experience", href: "#experience" },
                { label: "Writing", href: "#writing" },
                { label: "Contact", href: "#contact" },
              ],
              ctaText: "Say Hello 👋",
            },
            children: [],
          },
          {
            id: generateId("hero"),
            type: "section",
            props: { paddingTop: 100, paddingBottom: 80, backgroundColor: "#ffffff" },
            children: [
              {
                id: generateId("hero-con"),
                type: "container",
                props: { maxWidth: "900px", gap: 24, alignItems: "flex-start" },
                children: [
                  {
                    id: generateId("badge"),
                    type: "text",
                    props: {
                      text: "AVAILABLE FOR SELECT Q2 PROJECTS",
                      backgroundColor: "#ede9fe",
                      color: "#6d28d9",
                      borderColor: "#c4b5fd",
                    },
                    children: [],
                  },
                  {
                    id: generateId("h"),
                    type: "heading",
                    props: {
                      text: "Hello, I'm Alex. I craft digital products used by millions of people daily.",
                      tag: "h1",
                      fontSize: 48,
                      fontWeight: "800",
                    },
                    children: [],
                  },
                  {
                    id: generateId("p"),
                    type: "paragraph",
                    props: {
                      text: "Over 8 years of experience leading design systems, SaaS platforms, and mobile apps for Silicon Valley startups and Fortune 500 brands.",
                      fontSize: 20,
                    },
                    children: [],
                  },
                  {
                    id: generateId("btn"),
                    type: "button",
                    props: {
                      text: "View Selected Works ↓",
                      backgroundColor: "#7c3aed",
                    },
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            id: generateId("foot"),
            type: "footer",
            props: { brandText: "Alex Rivers Portfolio" },
            children: [],
          },
        ],
        "Home",
        "Alex Rivers - Product Designer"
      ),
    ],
  },
];
