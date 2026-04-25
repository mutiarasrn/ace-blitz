"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Zap, Activity, Settings, HelpCircle, FileBox } from "lucide-react";

const sidebarLinks = [
  { name: "Marketplace", path: "/marketplace", icon: Store },
  { name: "Seller Hub", path: "/seller", icon: Zap },
  { name: "My Trades", path: "/dashboard", icon: Activity },
  { name: "Settings", path: "#", icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const isMarketplace = pathname === "/marketplace";

  return (
    <aside className="w-64 border-r border-white/5 bg-obsidian flex flex-col h-[calc(100vh-64px)] sticky top-16 shrink-0">
      <div className="p-6">
        <h2 className="font-space font-bold text-monad-purple text-lg tracking-wide mb-1">Command Center</h2>
        <div className="flex items-center gap-2 text-xs font-inter text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
          Monad Network Active
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.path || (link.name === "Receipts" && false);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-space text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-white/5 text-neon-lime border-l-2 border-neon-lime' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-neon-lime' : 'text-slate-500'} />
              {link.name}
            </Link>
          );
        })}

        {isMarketplace && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="font-space text-xs font-bold text-slate-500 tracking-widest uppercase mb-4 px-4">Market Filters</h3>
            
            <div className="px-4 mb-6">
              <label className="text-xs font-inter text-slate-400 mb-2 block">Price Range (MON/kWh)</label>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Min" className="w-full bg-obsidian-card border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-neon-lime/50" />
                <span className="text-slate-500">-</span>
                <input type="text" placeholder="Max" className="w-full bg-obsidian-card border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-neon-lime/50" />
              </div>
            </div>

            <div className="px-4">
              <label className="text-xs font-inter text-slate-400 mb-3 block">Energy Source</label>
              <div className="space-y-3">
                {['Solar PV', 'Wind Turbine', 'Hydroelectric'].map((source) => (
                  <label key={source} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${source === 'Solar PV' ? 'bg-neon-lime border-neon-lime' : 'border-white/20 group-hover:border-white/40'}`}>
                      {source === 'Solar PV' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0C0E17" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span className="text-sm font-inter text-slate-300">{source}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button className="w-full py-3 bg-monad-purple/10 border border-monad-purple/30 text-monad-purple hover:bg-monad-purple hover:text-white transition-all font-space text-sm tracking-wide font-medium rounded-lg mb-6 shadow-[0_0_15px_rgba(139,92,246,0.1)] hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          Mint Energy NFT
        </button>

        <div className="space-y-3 px-2">
          <Link href="#" className="flex items-center gap-2 text-xs font-inter text-slate-500 hover:text-white transition-colors">
            <FileBox size={14} /> Docs
          </Link>
          <Link href="#" className="flex items-center gap-2 text-xs font-inter text-slate-500 hover:text-white transition-colors">
            <HelpCircle size={14} /> Support
          </Link>
        </div>
      </div>
    </aside>
  );
};
