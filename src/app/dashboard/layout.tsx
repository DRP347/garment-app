// src/app/dashboard/layout.tsx
import DashboardShell from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard | The Garment Guy",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
