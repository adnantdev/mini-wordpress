const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SiteForge database seeding...");

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || "admin@siteforge.io";
  const rawPassword = process.env.ADMIN_PASSWORD || "adminpassword123";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "SiteForge Admin",
      role: "admin",
    },
    create: {
      email: adminEmail,
      name: "SiteForge Admin",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email}`);

  // Templates definition directly for script execution
  const templates = [
    {
      id: "template-blank",
      name: "Blank Canvas",
      slug: "blank",
      category: "Minimal",
      description: "A clean, blank starting point for building custom layouts from scratch.",
      thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      isDefault: true,
      contentJson: JSON.stringify({
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
        seoSettings: { siteTitle: "My New Site", metaDescription: "Created with SiteForge" },
        pages: [
          {
            id: "page_home_blank",
            name: "Home",
            slug: "home",
            isHomePage: true,
            root: {
              id: "root_blank",
              type: "container",
              name: "Page Root",
              props: { width: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
              children: [
                {
                  id: "nav_blank",
                  type: "navbar",
                  props: { brandText: "MyWebsite", links: [{ label: "Home", href: "#" }, { label: "About", href: "#" }], ctaText: "Contact" },
                  children: [],
                },
                {
                  id: "sec_blank",
                  type: "section",
                  props: { paddingTop: 100, paddingBottom: 100, backgroundColor: "#ffffff" },
                  children: [
                    {
                      id: "con_blank",
                      type: "container",
                      props: { maxWidth: "800px", alignItems: "center", textAlign: "center", gap: 16 },
                      children: [
                        { id: "t_blank", type: "text", props: { text: "START BUILDING" }, children: [] },
                        { id: "h_blank", type: "heading", props: { text: "Your Blank Canvas Awaits", tag: "h1", fontSize: 52, textAlign: "center" }, children: [] },
                        { id: "p_blank", type: "paragraph", props: { text: "Drag blocks from the left sidebar to begin designing.", textAlign: "center" }, children: [] },
                        { id: "b_blank", type: "button", props: { text: "Add Element" }, children: [] },
                      ],
                    },
                  ],
                },
                { id: "f_blank", type: "footer", props: { brandText: "MyWebsite" }, children: [] },
              ],
            },
          },
        ],
      }),
    },
    {
      id: "template-business",
      name: "Corporate & Enterprise",
      slug: "business",
      category: "Business",
      description: "Professional multi-section corporate landing page designed for consulting, finance, and enterprise services.",
      thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
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
        seoSettings: { siteTitle: "Apex Global Advisors", metaDescription: "Accelerating enterprise consulting." },
        pages: [
          {
            id: "page_home_biz",
            name: "Home",
            slug: "home",
            isHomePage: true,
            root: {
              id: "root_biz",
              type: "container",
              name: "Page Root",
              props: { width: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
              children: [
                {
                  id: "nav_biz",
                  type: "navbar",
                  props: { brandText: "Apex Advisors", links: [{ label: "Solutions", href: "#" }, { label: "About", href: "#" }], ctaText: "Book Call" },
                  children: [],
                },
                {
                  id: "hero_biz",
                  type: "section",
                  props: { paddingTop: 90, paddingBottom: 90, backgroundColor: "#f8fafc" },
                  children: [
                    {
                      id: "con_biz",
                      type: "container",
                      props: { maxWidth: "1200px" },
                      children: [
                        {
                          id: "cols_biz",
                          type: "columns",
                          props: { columnsCount: 2, gap: 40 },
                          children: [
                            {
                              id: "c1_biz",
                              type: "container",
                              props: { gap: 20 },
                              children: [
                                { id: "badge_biz", type: "text", props: { text: "TRUSTED BY 250+ ENTERPRISES" }, children: [] },
                                { id: "h1_biz", type: "heading", props: { text: "Strategic Consulting for the Modern Enterprise", tag: "h1", fontSize: 48 }, children: [] },
                                { id: "p1_biz", type: "paragraph", props: { text: "We partner with visionary leaders to engineer scalable operations, maximize capital efficiency, and drive sustainable growth." }, children: [] },
                                { id: "btn_biz", type: "button", props: { text: "Schedule Strategy Call →", backgroundColor: "#0f172a" }, children: [] },
                              ],
                            },
                            {
                              id: "c2_biz",
                              type: "container",
                              props: {},
                              children: [
                                { id: "img_biz", type: "image", props: { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", borderRadius: 16 }, children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { id: "foot_biz", type: "footer", props: { brandText: "Apex Advisors" }, children: [] },
              ],
            },
          },
        ],
      }),
    },
    {
      id: "template-saas",
      name: "SaaS & AI Platform",
      slug: "saas",
      category: "Technology",
      description: "Cutting-edge software product landing page with hero badges, product screenshots, pricing tiers, and interactive FAQ.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
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
        seoSettings: { siteTitle: "Nova AI | The Intelligent Automation Suite", metaDescription: "Automate complex workflows with generative intelligence." },
        pages: [
          {
            id: "page_home_saas",
            name: "Home",
            slug: "home",
            isHomePage: true,
            root: {
              id: "root_saas",
              type: "container",
              name: "Page Root",
              props: { width: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
              children: [
                {
                  id: "nav_saas",
                  type: "navbar",
                  props: { brandText: "⚡ Nova AI", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "FAQ", href: "#" }], ctaText: "Start Free Trial", backgroundColor: "#0b0f19", textColor: "#f8fafc" },
                  children: [],
                },
                {
                  id: "hero_saas",
                  type: "section",
                  props: { paddingTop: 100, paddingBottom: 90, backgroundColor: "#090d16" },
                  children: [
                    {
                      id: "con_saas",
                      type: "container",
                      props: { maxWidth: "1000px", alignItems: "center", textAlign: "center", gap: 24 },
                      children: [
                        { id: "pill_saas", type: "text", props: { text: "✨ NOVA 3.0 IS LIVE", backgroundColor: "rgba(99, 102, 241, 0.2)", color: "#a5b4fc" }, children: [] },
                        { id: "h1_saas", type: "heading", props: { text: "The Autonomous AI Engine for High-Velocity Teams", tag: "h1", fontSize: 54, color: "#ffffff", textAlign: "center" }, children: [] },
                        { id: "p_saas", type: "paragraph", props: { text: "Connect your databases, APIs, and business logic into an autonomous workflow that operates 24/7.", color: "#94a3b8", textAlign: "center" }, children: [] },
                        { id: "btn_saas", type: "button", props: { text: "Start Free Sandbox", backgroundColor: "#6366f1" }, children: [] },
                        { id: "img_saas", type: "image", props: { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", borderRadius: 16 }, children: [] },
                      ],
                    },
                  ],
                },
                { id: "foot_saas", type: "footer", props: { brandText: "Nova AI Platform", backgroundColor: "#06090e" }, children: [] },
              ],
            },
          },
        ],
      }),
    },
    {
      id: "template-agency",
      name: "Creative Agency",
      slug: "agency",
      category: "Creative",
      description: "Bold showcase for design studios, advertising agencies, and production houses with portfolio grids.",
      thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
        globalStyles: { primaryColor: "#000000", secondaryColor: "#f59e0b", backgroundColor: "#ffffff", textColor: "#171717", fontFamily: "Inter, sans-serif", headingFont: "Inter, sans-serif", borderRadius: "none", buttonStyle: "solid" },
        seoSettings: { siteTitle: "Studio Mono | Brand & Digital", metaDescription: "Award-winning creative design studio." },
        pages: [],
      }),
    },
    {
      id: "template-restaurant",
      name: "Gourmet Restaurant & Bar",
      slug: "restaurant",
      category: "Hospitality",
      description: "Elegant hospitality website featuring culinary highlights, seasonal menus, and table reservations.",
      thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
        globalStyles: { primaryColor: "#c2410c", secondaryColor: "#78350f", backgroundColor: "#fffbf5", textColor: "#292524", fontFamily: "Inter, sans-serif", headingFont: "Inter, sans-serif", borderRadius: "md", buttonStyle: "solid" },
        seoSettings: { siteTitle: "L'Arôme Bistro | Artisanal Dining", metaDescription: "Seasonal farm-to-table dining experience." },
        pages: [],
      }),
    },
    {
      id: "template-solar",
      name: "Solar & Clean Energy",
      slug: "solar",
      category: "Services",
      description: "High-converting residential & commercial solar installation website with savings metrics and quote request form.",
      thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
        globalStyles: { primaryColor: "#059669", secondaryColor: "#eab308", backgroundColor: "#ffffff", textColor: "#1e293b", fontFamily: "Inter, sans-serif", headingFont: "Inter, sans-serif", borderRadius: "lg", buttonStyle: "solid" },
        seoSettings: { siteTitle: "Helios Solar | Residential Solar Power", metaDescription: "Cut your electric bills with premium solar panels." },
        pages: [],
      }),
    },
    {
      id: "template-portfolio",
      name: "Creator & Designer Portfolio",
      slug: "portfolio",
      category: "Personal",
      description: "Modern portfolio for UI/UX designers, software engineers, and digital consultants.",
      thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      isDefault: false,
      contentJson: JSON.stringify({
        globalStyles: { primaryColor: "#7c3aed", secondaryColor: "#475569", backgroundColor: "#ffffff", textColor: "#0f172a", fontFamily: "Inter, sans-serif", headingFont: "Inter, sans-serif", borderRadius: "xl", buttonStyle: "solid" },
        seoSettings: { siteTitle: "Alex Rivers | Product Designer", metaDescription: "Designing digital experiences." },
        pages: [],
      }),
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
    console.log(`✅ Template seeded: ${t.name}`);
  }

  // 3. Seed Demo Project
  const saasTemplate = templates.find((t) => t.id === "template-saas");
  const demoParsed = JSON.parse(saasTemplate.contentJson);

  const demoProject = await prisma.project.upsert({
    where: { slug: "demo-saas-platform" },
    update: {},
    create: {
      id: "proj_demo_saas",
      name: "Nova AI Platform Demo",
      slug: "demo-saas-platform",
      description: "Flagship SaaS platform built with SiteForge visual builder and published live.",
      status: "published",
      templateId: "template-saas",
      draftVersion: 3,
      publishedVersion: 1,
      publicSlug: "nova-ai",
      globalStyles: JSON.stringify(demoParsed.globalStyles),
      seoSettings: JSON.stringify(demoParsed.seoSettings),
      userId: admin.id,
      publishedAt: new Date(),
      pages: {
        create: [
          {
            name: "Home",
            slug: "home",
            isHomePage: true,
            seoTitle: "Nova AI | The Intelligent Automation Suite",
            seoDescription: "Automate complex workflows with generative intelligence.",
            contentJson: JSON.stringify(demoParsed.pages[0].root),
          },
          {
            name: "Pricing",
            slug: "pricing",
            isHomePage: false,
            seoTitle: "Pricing & Plans | Nova AI",
            seoDescription: "Flexible plans for startups, growth teams, and global enterprises.",
            contentJson: JSON.stringify({
              id: "root_pricing",
              type: "container",
              name: "Pricing Root",
              props: { width: "100%", paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 },
              children: [
                {
                  id: "nav_pricing",
                  type: "navbar",
                  props: { brandText: "⚡ Nova AI", links: [{ label: "Home", href: "/web/nova-ai" }, { label: "Pricing", href: "/web/nova-ai/pricing" }], ctaText: "Sign Up", backgroundColor: "#0b0f19", textColor: "#f8fafc" },
                  children: [],
                },
                {
                  id: "sec_pricing",
                  type: "section",
                  props: { paddingTop: 90, paddingBottom: 90, backgroundColor: "#090d16" },
                  children: [
                    {
                      id: "con_pricing",
                      type: "container",
                      props: { maxWidth: "1000px", alignItems: "center", gap: 32 },
                      children: [
                        { id: "h_pricing", type: "heading", props: { text: "Simple, Transparent Pricing", tag: "h1", fontSize: 48, color: "#ffffff", textAlign: "center" }, children: [] },
                        { id: "p_pricing", type: "paragraph", props: { text: "Choose the plan tailored to your execution scale. Cancel or upgrade anytime.", color: "#94a3b8", textAlign: "center" }, children: [] },
                        {
                          id: "grid_pricing",
                          type: "grid",
                          props: { gridCols: 2, gap: 32, width: "100%" },
                          children: [
                            {
                              id: "card_starter",
                              type: "card",
                              props: { backgroundColor: "#0f172a", borderColor: "#1e293b", borderWidth: 1, paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 },
                              children: [
                                { id: "h_start", type: "heading", props: { text: "Starter Pro — $49/mo", tag: "h3", fontSize: 24, color: "#ffffff" }, children: [] },
                                { id: "p_start", type: "paragraph", props: { text: "Ideal for growth stage teams deploying up to 10 autonomous agents with standard compute.", color: "#94a3b8" }, children: [] },
                                { id: "btn_start", type: "button", props: { text: "Get Started", backgroundColor: "#334155" }, children: [] },
                              ],
                            },
                            {
                              id: "card_ent",
                              type: "card",
                              props: { backgroundColor: "#1e1b4b", borderColor: "#6366f1", borderWidth: 2, paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 },
                              children: [
                                { id: "h_ent", type: "heading", props: { text: "Enterprise Unlimited — $199/mo", tag: "h3", fontSize: 24, color: "#ffffff" }, children: [] },
                                { id: "p_ent", type: "paragraph", props: { text: "Unlimited agents, dedicated high-concurrency VPC, custom SLA, and 24/7 dedicated engineering support.", color: "#c7d2fe" }, children: [] },
                                { id: "btn_ent", type: "button", props: { text: "Deploy Enterprise", backgroundColor: "#6366f1" }, children: [] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                { id: "foot_pricing", type: "footer", props: { brandText: "Nova AI Platform", backgroundColor: "#06090e" }, children: [] },
              ],
            }),
          },
        ],
      },
    },
  });

  // Create initial published snapshot for the demo project
  const homePage = await prisma.page.findFirst({
    where: { projectId: demoProject.id, isHomePage: true },
  });
  const pricingPage = await prisma.page.findFirst({
    where: { projectId: demoProject.id, slug: "pricing" },
  });

  const snapshotContent = {
    projectId: demoProject.id,
    publicSlug: demoProject.publicSlug,
    globalStyles: demoParsed.globalStyles,
    seoSettings: demoParsed.seoSettings,
    pages: [
      {
        id: homePage.id,
        name: homePage.name,
        slug: homePage.slug,
        isHomePage: true,
        seoTitle: homePage.seoTitle,
        seoDescription: homePage.seoDescription,
        root: JSON.parse(homePage.contentJson),
      },
      {
        id: pricingPage.id,
        name: pricingPage.name,
        slug: pricingPage.slug,
        isHomePage: false,
        seoTitle: pricingPage.seoTitle,
        seoDescription: pricingPage.seoDescription,
        root: JSON.parse(pricingPage.contentJson),
      },
    ],
  };

  await prisma.publishedVersion.upsert({
    where: {
      projectId_version: {
        projectId: demoProject.id,
        version: 1,
      },
    },
    update: {
      contentJson: JSON.stringify(snapshotContent),
    },
    create: {
      projectId: demoProject.id,
      version: 1,
      contentJson: JSON.stringify(snapshotContent),
      snapshotNote: "Initial published demo release",
      publishedBy: "Admin",
    },
  });

  console.log(`✅ Demo project seeded & published at /web/${demoProject.publicSlug}`);
  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
