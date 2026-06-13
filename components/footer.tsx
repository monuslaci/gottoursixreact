"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/client-utils";

export function AppFooter() {
  return (
    <footer className="border-t border-divider/70 bg-content1/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-default-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          {siteConfig.name} is a private community space for honest conversation.
        </p>
        <nav className="flex flex-wrap items-center gap-4">
          {siteConfig.footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("font-medium text-default-600 transition-colors hover:text-primary")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
