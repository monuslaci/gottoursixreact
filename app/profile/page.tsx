import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

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
