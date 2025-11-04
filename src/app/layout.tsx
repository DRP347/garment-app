import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "The Garment Guy",
  description: "India's premium B2B garment brand platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-white text-[#0A3D79]">
        <ClientProviders>
          <Navbar />
          {/* Slightly reduced padding for better hero alignment */}
          <main className="pt-[56px] md:pt-[64px]">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
