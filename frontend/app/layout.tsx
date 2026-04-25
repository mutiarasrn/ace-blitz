import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ACE-Blitz - P2P Energy Trading",
  description: "Direct Energy Trading, Bypassing the Grid on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} dark antialiased`}>
      <body className={`font-inter min-h-screen flex flex-col`}>
        <Navigation />
        <main className="flex-1 pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
