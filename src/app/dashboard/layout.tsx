// src/app/dashboard/layout.tsx
export const metadata = {
  title: "Dashboard | The Garment Guy",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-[#F9FAFB] text-[#0A3D79]">
      {children}
    </section>
  );
}
