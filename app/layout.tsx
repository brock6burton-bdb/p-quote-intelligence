import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism — Contractor Quote Analysis",
  description: "Compare contractor quotes, identify hidden risks, and know what to ask before signing."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
