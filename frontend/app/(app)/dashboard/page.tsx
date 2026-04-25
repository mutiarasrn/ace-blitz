"use client";

import { motion } from "framer-motion";
import { Banknote, Zap, History, PlusCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-space text-xl text-white font-medium mb-1">Personal Portal</h1>
          <p className="font-inter text-sm text-slate-400">Real-time synchronization with Monad Mainnet</p>
        </div>
        <div className="text-right">
          <p className="font-space text-[10px] tracking-widest text-neon-lime uppercase mb-1">Current Flux</p>
          <p className="font-space text-xl text-neon-lime font-bold">1.21 GW/h</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Banknote size={64} />
          </div>
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-monad-purple shadow-[0_0_8px_#8B5CF6]"></div>
            <h3 className="font-space text-[10px] tracking-widest text-slate-300 uppercase">Total Investment</h3>
          </div>
          <p className="font-space text-3xl font-bold text-white mb-4 relative z-10">4,290.50 <span className="text-monad-purple text-lg font-normal">MON</span></p>
          <p className="font-inter text-xs text-slate-400 flex items-center gap-2 relative z-10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            +12.4% vs last month
          </p>
        </div>

        <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={64} />
          </div>
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-lime shadow-[0_0_8px_#A3E635]"></div>
            <h3 className="font-space text-[10px] tracking-widest text-slate-300 uppercase">Trading Revenue</h3>
          </div>
          <p className="font-space text-3xl font-bold text-neon-lime mb-4 relative z-10">8,712.15 <span className="text-white text-lg font-normal">MON</span></p>
          <p className="font-inter text-xs text-neon-lime flex items-center gap-2 relative z-10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            +34.8% yield velocity
          </p>
        </div>
      </div>

      {/* Trade History */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-space text-sm tracking-widest text-white uppercase flex items-center gap-2">
            <History size={16} className="text-neon-lime" /> Trade History
          </h2>
          <button className="font-space text-[10px] tracking-widest text-monad-purple uppercase hover:text-white transition-colors">
            View All Activity
          </button>
        </div>

        <div className="glass-panel overflow-hidden border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-space tracking-widest uppercase text-slate-500 bg-white/[0.02]">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Seller/Buyer</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-inter text-slate-300">
              {[
                { date: "2024.05.21 14:02", user: "0x82...f9a1", amount: "1.50 MW/h", status: "FINALIZED" },
                { date: "2024.05.21 11:45", user: "0x4c...d2e3", amount: "0.85 MW/h", status: "FINALIZED" },
                { date: "2024.05.20 23:12", user: "0xa1...b7c8", amount: "2.10 MW/h", status: "PENDING" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">{row.date}</td>
                  <td className="p-4 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-monad-purple flex items-center justify-center text-[8px] font-space text-white">0x</div>
                    {row.user}
                  </td>
                  <td className="p-4 font-space text-neon-lime">{row.amount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-space font-bold tracking-widest uppercase border ${
                      row.status === "FINALIZED" 
                        ? "bg-neon-lime/10 text-neon-lime border-neon-lime/30" 
                        : "bg-slate-500/10 text-slate-400 border-white/10"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Energy NFT Receipts */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 rounded bg-monad-purple/20 border border-monad-purple/50 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-monad-purple rounded-sm"></div>
          </div>
          <h2 className="font-space text-sm tracking-widest text-white uppercase">Energy NFT Receipts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: "#8842-A", name: "Solar Flare Prime", output: "1.5 MW/h Output", color: "from-fuchsia-500 to-purple-600" },
            { id: "#3120-X", name: "Wind Kinetic Unit", output: "0.8 MW/h Output", color: "from-teal-400 to-emerald-500" },
            { id: "#5512-B", name: "Hydro Pulse Batch", output: "4.2 MW/h Output", color: "from-blue-500 to-cyan-400" },
          ].map((nft, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-panel p-4 pb-5 border-white/5 relative group cursor-pointer"
            >
              <div className={`w-full aspect-square rounded-lg mb-4 bg-gradient-to-br ${nft.color} relative overflow-hidden flex items-center justify-center shadow-inner`}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 w-24 h-24 border border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 border border-white/50 rounded-lg rotate-45"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              <div className="flex justify-between items-start mb-1">
                <span className="font-space text-[9px] text-slate-500 tracking-widest">{nft.id}</span>
                <CheckCircle2 size={12} className="text-neon-lime" />
              </div>
              <h3 className="font-space text-sm font-medium text-white mb-1">{nft.name}</h3>
              <p className="font-inter text-[10px] text-slate-400">{nft.output}</p>
            </motion.div>
          ))}

          {/* Mint New Receipt */}
          <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.05] transition-colors flex flex-col items-center justify-center min-h-[250px] cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PlusCircle size={20} className="text-slate-400 group-hover:text-white" />
            </div>
            <span className="font-space text-[10px] tracking-widest text-slate-500 uppercase group-hover:text-slate-300">Mint New Receipt</span>
          </div>
        </div>
      </div>

    </div>
  );
}
