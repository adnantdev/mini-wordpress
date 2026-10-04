# SiteForge — Visual Website Builder & Headless CMS Studio

**SiteForge** is a private, production-ready visual website builder and CMS platform (conceptually inspired by Webflow and modern headless CMS engines).

It enables administrators to create multi-page websites visually, drag and drop registered components, customize granular element styles through a dynamic schema-driven properties panel, save drafts with undo/redo history, and publish immutable version snapshots to public live endpoints.

---

## 🌟 Key Architecture & Highlights

### 1. Two Completely Isolated Experiences
- **Private Admin Builder (`/login`, `/dashboard`, `/projects`, `/editor/*`, `/templates`, `/assets`, `/settings`, `/preview/*`)**:
  - Protected at the server & middleware level with secure HTTP-only JWT sessions and bcrypt password verification.
  - Full-screen Visual Studio with multi-breakpoint responsive editing (Desktop, Tablet, Mobile), Layers hierarchy tree, Pages manager, Design tokens theme customizer, Drag-and-drop canvas, and Dynamic schema-driven Property Inspector.
- **Public Published Websites (`/web/:projectId`, `/web/:projectId/:slug*`)**:
  - Completely isolated from editor code and database admin models.
  - Reads published immutable snapshots from `PublishedVersion`.
  - Lightweight, SEO-optimized with dynamic OpenGraph and Meta tags.

### 2. Structured JSON Data Model (Source of Truth)
- Page layouts are stored as a serializable JSON component tree.
- Every element has a unique `id`, `type`, `props` (with breakpoint override support), and `children[]`.

### 3. Comprehensive Component Registry (20 Component Types)
- **Layout**: Section, Container, Columns, Grid, Spacer
- **Typography**: Heading (H1–H6), Paragraph, Text Badge / Span, Link
- **Media**: Image (with Asset Manager integration), Video Embed (YouTube/Vimeo), Gallery Grid
- **Interactive**: Button (variants: solid, outline, ghost, glass), Form Input, Lead Capture Form
- **Content**: Card Box, Divider, FAQ Accordion
- **Navigation**: Navigation Bar (with mobile menu toggle & sticky header), Footer

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS & CSS Variables
- **Database & ORM**: Prisma ORM with SQLite (zero-setup local dev) or PostgreSQL
- **Authentication**: JWT session tokens via `jose` and `bcryptjs`
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="siteforge-super-secret-jwt-key-change-in-production-min-32-chars-long"
ADMIN_EMAIL="admin@siteforge.io"
ADMIN_PASSWORD="adminpassword123"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Push Database Schema & Seed Data
```bash
npx prisma db push
node prisma/seed.js
```

This seeds:
- Initial Administrator (`admin@siteforge.io` / `adminpassword123`)
- 7 Templates (Blank, Corporate Business, SaaS & AI Platform, Creative Agency, Gourmet Restaurant, Solar Energy, Creator Portfolio)
- Live published demo project accessible at `/web/nova-ai` and `/web/nova-ai/pricing`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Login Credentials

- **Email**: `admin@siteforge.io`
- **Password**: `adminpassword123`

---

## 📦 Production Build & Deployment

```bash
npm run build
npm start
```
