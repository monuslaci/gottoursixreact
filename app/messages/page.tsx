import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

const MessagesPageContent = nextDynamic(
  () =>
    import("@/components/messages/messages-page-content").then(
      (mod) => mod.MessagesPageContent
    ),
  { ssr: false }
);

export default function MessagesPage() {
  return <MessagesPageContent />;
}
