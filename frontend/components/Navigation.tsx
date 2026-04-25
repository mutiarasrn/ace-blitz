"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MagneticButton } from "./ui/MagneticButton";
import { Zap } from "lucide-react";

const navLinks = [
  { name: "Marketplace", path: "/marketplace" },
  { name: "Seller Portal", path: "/seller" },
  { name: "Dashboard", path: "/dashboard" },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-obsidian-light/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 border border-neon-green/30 group-hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all">
            <Zap className="text-neon-green w-5 h-5" />
          </div>
          <span className="font-outfit font-bold text-xl tracking-wide text-white">ACE-Blitz</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path}
                className={`relative font-inter text-sm transition-colors ${isActive ? 'text-neon-cyan font-medium' : 'text-slate-400 hover:text-white'}`}
              >
                {link.name}
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute -bottom-[26px] left-0 right-0 h-0.5 bg-neon-cyan shadow-[0_0_8px_#00E5FF]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <MagneticButton variant="outline" className="hidden md:flex border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10">
            Connect Wallet
          </MagneticButton>
        </div>
      </div>
    </nav>
  );
};
