import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AdminShell from "@/components/AdminShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard — Cinema Machina",
  description: "Internal content management for Cinema Machina UAE",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} h-full bg-[#0A0A0A] selection:bg-bronze/30 selection:text-bronze-light text-foreground`}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
