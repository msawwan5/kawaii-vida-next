import type { Metadata } from "next";
import type React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kawaii Vida | DIY Craft Studio & Latte Bar",
  description:
    "Baltimore's kawaii craft studio, latte bar, gift shop, and claw machine stop.",
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
