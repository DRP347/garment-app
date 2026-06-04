import { requireAdminPage } from "@/lib/authz";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await requireAdminPage();

    return <>{children}</>;
}
