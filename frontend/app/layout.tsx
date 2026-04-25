import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { Providers } from "./providers";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACE-Blitz - Kinetic Energy on Monad",
  description: "Direct Energy Trading, Bypassing the Grid on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${space.variable} ${inter.variable} dark antialiased`}>
      <body className={`font-space min-h-screen bg-obsidian text-slate-100 flex flex-col`} suppressHydrationWarning>
        <Providers>
          <TopNav />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
