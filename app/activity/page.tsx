import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const ActivityPageContent = nextDynamic(
  () =>
    import("@/components/activity/activity-page-content").then(
      (mod) => mod.ActivityPageContent
    ),
  { ssr: false }
);

export default function ActivityPage() {
  return <ActivityPageContent />;
}
