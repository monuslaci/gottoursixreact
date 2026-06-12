import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

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
