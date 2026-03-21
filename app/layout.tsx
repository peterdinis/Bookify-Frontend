import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { AppProviders } from "@/components/app-providers";
import { LayoutSuspenseFallback } from "@/components/layout-suspense-fallback";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookify — Audiobooks",
  description: "Upload, organize, and listen to audiobooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <Suspense fallback={<LayoutSuspenseFallback />}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
