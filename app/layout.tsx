import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import NavbarClient from "./components/NavbarClient";

export const metadata: Metadata = {
  title: "Siloker - Platform Lowongan Kerja",
  description: "Temukan pekerjaan impian Anda di Siloker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cek status login user
  // Karena layout.tsx adalah server component, kita perlu gunakan client component untuk cek session
  // Jadi, kita buat komponen NavbarClient
  return (
    <html lang="id">
      <body className="bg-white text-gray-900">
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
          <NavbarClient />
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 bg-gray-50 mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-center text-gray-600">
              © 2026 Siloker. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );

}
