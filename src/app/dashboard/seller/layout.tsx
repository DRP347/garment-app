import "@/app/globals.css";
import SidebarSeller from "@/components/dashboard/SidebarSeller";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#F5F7FB] text-[#111827]">
        <div className="flex">
          <SidebarSeller />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
