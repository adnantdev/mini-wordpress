import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "SiteForge | Visual Studio & Headless CMS",
    template: "%s | SiteForge",
  },
  description:
    "A private visual website builder and CMS platform for creating, customizing, and publishing production websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
