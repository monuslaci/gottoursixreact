import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { AppFooter } from "@/components/footer";
import { AppNavbar } from "@/components/navbar";
import { getCurrentSessionUser } from "@/lib/session";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Got Your Six",
  description: "A mobile-first community base for topics and private support.",
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
