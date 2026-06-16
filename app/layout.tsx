import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { AppFooter } from "@/components/footer";
import { AppNavbar } from "@/components/navbar";
import { buildMetadata, siteUrl } from "@/lib/seo";
import { getCurrentSessionUser } from "@/lib/session";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Got Your Six",
  category: "community",
  creator: "Got Your Six",
  publisher: "Got Your Six",
  title: {
    default: "Got Your Six",
    template: "%s",
  },
  ...buildMetadata({
    description:
      "A support community for men to find practical guidance, join topic-based discussions, and build trusted connections.",
    keywords: [
      "mens support community",
      "mens discussion forum",
      "peer support for men",
      "community topics",
      "private support network",
    ],
  }),
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentSessionUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-background text-foreground antialiased`}>
        <Providers>
          <div className="min-h-screen">
            <AppNavbar
              initialAuthSession={{
                authenticated: Boolean(user),
                user,
              }}
            />
            <main
              className={`mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 ${
                user ? "internal-shell" : ""
              }`}
            >
              {children}
            </main>
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
