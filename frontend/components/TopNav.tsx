"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navLinks = [
  { name: "MARKETPLACE", path: "/marketplace" },
  { name: "DASHBOARD", path: "/dashboard" },
  { name: "SELLER", path: "/seller" },
];

export const TopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 w-full z-50 bg-obsidian-card border-b border-white/5 h-16 flex items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-space font-black text-2xl tracking-tighter italic text-neon-lime">ACE-BLITZ</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 h-full">
        {navLinks.map((link) => {
          const isActive = pathname === link.path || (link.path === '/seller' && pathname === '/seller');
          return (
            <Link 
              key={link.name} 
              href={link.path}
              className={`relative h-full flex items-center font-space text-xs tracking-widest transition-colors ${isActive ? 'text-neon-lime' : 'text-slate-400 hover:text-white'}`}
            >
              {link.name}
              {isActive && (
                <motion.div 
                  layoutId="topnav-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-lime shadow-[0_-2px_10px_#A3E635]"
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-white transition-colors">
          <Bell size={18} />
        </button>
        <button className="text-slate-400 hover:text-white transition-colors">
          <Wallet size={18} />
        </button>
        <ConnectButton />
      </div>
    </nav>
  );
};
