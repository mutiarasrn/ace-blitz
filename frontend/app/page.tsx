"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LiveFeedTicker } from "@/components/LiveFeedTicker";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neon-cyan/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neon-green/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon-cyan/30 text-neon-cyan text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
            </span>
            Live on Monad Testnet
          </div>
          
          <h1 className="font-outfit text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[1.1]">
            Direct Energy Trading,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-cyan drop-shadow-[0_0_20px_rgba(0,255,163,0.3)]">
              Bypassing the Grid.
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-inter font-light">
            Empowering communities to buy and sell surplus solar energy directly via smart contracts on Monad. Transparent pricing, instant settlement, zero middlemen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/marketplace">
              <MagneticButton className="px-8 py-4 text-base">
                Explore Marketplace <ArrowRight size={18} />
              </MagneticButton>
            </Link>
            <Link href="/seller">
              <MagneticButton variant="ghost" className="px-8 py-4 text-base border border-white/10 hover:border-white/20">
                Become a Producer
              </MagneticButton>
            </Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-20"
        >
          {[
            { label: "Total kWh Traded", value: "24,592", icon: <Zap className="text-neon-green mb-2" /> },
            { label: "Active Producers", value: "148", icon: <Globe className="text-neon-cyan mb-2" /> },
            { label: "Secure Transactions", value: "12,400+", icon: <Shield className="text-purple-400 mb-2" /> },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 flex flex-col items-center justify-center hover:bg-white/5 transition-colors duration-300">
              {stat.icon}
              <h3 className="font-outfit text-4xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-400 font-inter text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-auto">
        <LiveFeedTicker />
      </div>
    </div>
  );
}
