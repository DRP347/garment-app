// src/components/layouts/PublicLayout.tsx
import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <main>{children}</main>
      <footer className="bg-brand-blue-dark text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-base text-gray-300">
            &copy; 2025 The Garment Guy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}