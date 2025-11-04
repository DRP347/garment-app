import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "The Garment Guy | Premium B2B Garment Manufacturing",
  description:
    "India's premium B2B garment manufacturing and brand-building platform. Create, customize, and scale your fashion label with confidence.",
  icons: {
    icon: "/image/Logo-Icon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-white text-[#0A3D79] antialiased selection:bg-[#0A3D79]/20 selection:text-[#0A3D79]"
      >
        <ClientProviders>
          <Navbar />
          <main className="pt-[64px]">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
