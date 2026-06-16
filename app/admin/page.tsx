import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Admin",
  description: "Administrative moderation and community oversight tools.",
  path: "/admin",
  noIndex: true,
});

const AdminPageContent = nextDynamic(
  () =>
    import("@/components/admin/admin-page-content").then(
      (mod) => mod.AdminPageContent
    ),
  { ssr: false }
);

export default function AdminPage() {
  return <AdminPageContent />;
}
