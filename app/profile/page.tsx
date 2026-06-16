import type { Metadata } from "next";
import nextDynamic from "next/dynamic";

import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Profile",
  description: "Manage your Got Your Six profile and settings.",
  path: "/profile",
  noIndex: true,
});

const ProfilePageContent = nextDynamic(
  () =>
    import("@/components/profile/profile-page-content").then(
      (mod) => mod.ProfilePageContent
    ),
  { ssr: false }
);

export default function ProfilePage() {
  return <ProfilePageContent />;
}
