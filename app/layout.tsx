import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BHRMS - Barangay Health Referral Management System",
  description: "A comprehensive health referral management system for barangays",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
