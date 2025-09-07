import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "ZVC Goldgetters",
  description: "Futsal club website redesigned with Next.js and shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="container mx-auto px-4">
        <header>
          <h1 className="text-3xl font-bold py-4 text-center">ZVC Goldgetters</h1>
          <NavBar />
        </header>
        <main className="py-4 min-h-[60vh]">{children}</main>
        <footer className="py-10 text-center text-sm text-gray-500">
          © 2025 ZVC Goldgetters
        </footer>
      </body>
    </html>
  );
}
