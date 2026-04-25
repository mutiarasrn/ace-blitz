"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ArrowLeftRight, Users, Activity } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 overflow-y-auto w-full relative">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-neon-lime/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex flex-col items-center text-center">
        
        {/* Hero Copy */}
        <h1 className="font-space font-medium text-lg md:text-xl text-slate-300 mb-4 tracking-wide">
          Buy & Sell Energy Directly, <span className="text-neon-lime font-bold">Without the Middleman</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto mb-10 font-inter font-light">
          P2P energy trading on Monad - Fast, Fair, and Transparent. Empowering local communities to trade surplus solar and wind energy without intermediaries.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
          <Link href="/marketplace">
            <button className="flex items-center gap-2 bg-neon-lime text-obsidian font-space font-bold text-sm tracking-wider px-8 py-3.5 hover:bg-[#b5f848] transition-colors shadow-[0_0_20px_rgba(163,230,53,0.3)]">
              Start Trading <Zap size={16} className="fill-obsidian" />
            </button>
          </Link>
          <Link href="/marketplace">
            <button className="bg-transparent text-slate-300 font-space font-medium text-sm tracking-wider px-8 py-3.5 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors">
              View Marketplace
            </button>
          </Link>
          <Link href="/why">
            <button className="bg-transparent text-neon-lime font-space font-medium text-sm tracking-wider px-8 py-3.5 border border-neon-lime/30 hover:border-neon-lime/60 hover:bg-neon-lime/5 transition-colors">
              Why We Exist →
            </button>
          </Link>
        </div>

        {/* Hero Graphic Placeholder (Image from mockup) */}
        <div className="w-full max-w-5xl h-[400px] border border-white/5 rounded-xl bg-obsidian-card relative overflow-hidden mb-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Abstract representation of the hero graphic */}
            <div className="relative w-64 h-64 border border-neon-lime/30 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border border-teal-500/30 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 bg-neon-lime/5 blur-2xl rounded-full"></div>
              <Zap size={48} className="text-neon-lime absolute" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-24 text-left">
          <div className="glass-panel p-6">
            <div className="flex justify-between items-start mb-6">
              <p className="font-space text-xs tracking-widest text-slate-400 uppercase">Total Trades</p>
              <ArrowLeftRight size={20} className="text-slate-500" />
            </div>
            <p className="font-space text-2xl font-bold text-white mb-2">1,284,590</p>
            <p className="text-neon-lime font-inter text-xs flex items-center gap-1"><ArrowRight size={12} className="-rotate-45"/> +12.4% this month</p>
          </div>
          
          <div className="glass-panel p-6">
            <div className="flex justify-between items-start mb-6">
              <p className="font-space text-xs tracking-widest text-slate-400 uppercase">Total kWh Traded</p>
              <Zap size={20} className="text-slate-500" />
            </div>
            <p className="font-space text-2xl font-bold text-teal-400 mb-2">45.2 GWh</p>
            <p className="text-teal-400 font-inter text-xs flex items-center gap-1"><ArrowRight size={12} className="-rotate-45"/> Sufficient for 15k homes</p>
          </div>

          <div className="glass-panel p-6">
            <div className="flex justify-between items-start mb-6">
              <p className="font-space text-xs tracking-widest text-slate-400 uppercase">Active Sellers</p>
              <Users size={20} className="text-slate-500" />
            </div>
            <p className="font-space text-2xl font-bold text-neon-lime mb-2">8,421</p>
            <p className="text-slate-400 font-inter text-xs flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-monad-purple"></span> Live nodes across Monad</p>
          </div>
        </div>

        {/* Lower Layout: Feed & Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl text-left mb-24">
          
          {/* Live Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-lime rounded-full shadow-[0_0_8px_#A3E635]"></div>
                <h3 className="font-space text-sm tracking-widest text-white uppercase">Live Transaction Feed</h3>
              </div>
              <Link href="#" className="font-inter text-xs text-slate-400 hover:text-white">View All Activity</Link>
            </div>

            <div className="space-y-4">
              {[
                { seller: "0x82...f92", buyer: "0x1f...e42", node: "Solar Farm #421 • West Jakarta Node", kwh: 12.5, price: 0.042 },
                { seller: "0x54...e12", buyer: "0x22...b91", node: "Coastal Wind Array • North Java Node", kwh: 450.0, price: 0.038 },
                { seller: "0x99...d22", buyer: "0x55...f10", node: "Local Storage Hub • South Tangerang", kwh: 25.0, price: 0.045 },
              ].map((tx, i) => (
                <div key={i} className="glass-panel p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-obsidian border border-white/10 flex items-center justify-center">
                      <Zap size={16} className={i === 1 ? 'text-teal-400' : 'text-neon-lime'} />
                    </div>
                    <div>
                      <p className="font-inter text-sm text-slate-200 mb-1">{tx.seller} sold to {tx.buyer}</p>
                      <p className="font-inter text-xs text-slate-500">{tx.node}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-space font-bold text-sm text-neon-lime mb-1">{tx.kwh} kWh</p>
                    <p className="font-inter text-xs text-slate-500">{tx.price} MON / kWh</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panels */}
          <div className="space-y-6">
            <div className="glass-panel p-6 border-neon-lime/30 shadow-[0_0_20px_rgba(163,230,53,0.05)]">
              <h3 className="font-space text-sm tracking-widest text-white uppercase mb-6">Network Health</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-inter text-slate-400 mb-2">
                    <span>Block Speed</span>
                    <span className="text-neon-lime">1.2s</span>
                  </div>
                  <div className="w-full h-1 bg-obsidian rounded-full overflow-hidden">
                    <div className="h-full bg-neon-lime w-[80%] shadow-[0_0_10px_#A3E635]"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs font-inter text-slate-400">
                  <span>Active Nodes</span>
                  <span className="text-white font-space">12,482</span>
                </div>
                <div className="flex justify-between text-xs font-inter text-slate-400">
                  <span>Gas Fees</span>
                  <span className="text-white font-space">&lt; 0.0001 MON</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-space text-sm tracking-widest text-white uppercase mb-4">Start Selling Energy</h3>
              <p className="font-inter text-xs text-slate-400 mb-6 leading-relaxed">
                Got excess solar power? Connect your smart meter and start earning MONAD tokens in real-time.
              </p>
              <button className="w-full py-3 bg-[#B4A5FF] text-obsidian font-space text-sm font-bold tracking-wider hover:bg-[#cbbdff] transition-colors mb-4">
                Mint Seller NFT
              </button>
              <div className="flex gap-3 items-start p-3 bg-obsidian/50 rounded border border-white/5">
                <Activity size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <p className="font-inter text-[10px] text-slate-500 italic">"Earning ~45 MON daily on my 5kW solar setup"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="w-full max-w-4xl glass-panel p-10 flex flex-col items-center relative overflow-hidden text-center mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-lime/0 via-neon-lime/5 to-neon-lime/0"></div>
          <h2 className="font-space text-xl font-bold text-white mb-2 relative z-10">Join the Energy Revolution</h2>
          <p className="font-inter text-sm text-slate-400 mb-8 max-w-md relative z-10">
            Get notified when new trading nodes go live in your area and receive our weekly energy market report.
          </p>
          <div className="flex w-full max-w-md relative z-10">
            <input type="email" placeholder="Enter your email address" className="flex-1 bg-obsidian border border-white/10 px-4 py-3 text-sm font-inter text-white focus:outline-none focus:border-neon-lime/50" />
            <button className="bg-neon-lime text-obsidian font-space font-bold px-6 text-sm hover:bg-[#b5f848] transition-colors">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
