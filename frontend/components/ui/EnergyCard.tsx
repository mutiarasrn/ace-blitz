"use client";

import React, { useState } from "react";
import { Zap, Wind, Droplets, Leaf } from "lucide-react";

interface EnergyCardProps {
  name: string;
  node: string;
  type: "SOLAR" | "WIND" | "HYDRO" | "BIO";
  pricePerKwh: string;
  availableSupply: string;
  metricLabel: string;
  metricValue: React.ReactNode;
  onBuy: (amount: string) => void;
}

export const EnergyCard = ({ name, node, type, pricePerKwh, availableSupply, metricLabel, metricValue, onBuy }: EnergyCardProps) => {
  const [amount, setAmount] = useState("");

  const getTypeStyles = () => {
    switch (type) {
      case "SOLAR": return { bg: "bg-teal-500/10", text: "text-teal-400", icon: <Zap size={16} /> };
      case "WIND": return { bg: "bg-monad-purple/10", text: "text-monad-purple", icon: <Wind size={16} /> };
      case "HYDRO": return { bg: "bg-blue-500/10", text: "text-blue-400", icon: <Droplets size={16} /> };
      case "BIO": return { bg: "bg-emerald-500/10", text: "text-emerald-400", icon: <Leaf size={16} /> };
      default: return { bg: "bg-slate-500/10", text: "text-slate-400", icon: <Zap size={16} /> };
    }
  };

  const style = getTypeStyles();

  return (
    <div className="glass-panel p-6 card-border relative flex flex-col h-full hover:bg-white/[0.02] transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded border border-white/10 flex items-center justify-center bg-obsidian`}>
            {style.icon}
          </div>
          <div>
            <h3 className="font-space font-medium text-lg text-white">{name}</h3>
            <p className="font-inter text-[10px] text-slate-500">Node: {node}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-space font-bold tracking-widest ${style.bg} ${style.text}`}>
          {type}
        </div>
      </div>

      <div className="space-y-4 mb-6 flex-1">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <span className="font-inter text-xs text-slate-400">Price per kWh</span>
          <span className="font-space font-bold text-neon-lime">{pricePerKwh} MON</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <span className="font-inter text-xs text-slate-400">Available Supply</span>
          <span className="font-space font-bold text-white">{availableSupply} kWh</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-inter text-xs text-slate-400">{metricLabel}</span>
          <span className="font-space font-medium text-neon-lime text-sm">{metricValue}</span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="relative mb-3">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in kWh" 
            className="w-full bg-obsidian border border-white/10 rounded px-4 py-3 text-sm font-inter text-white focus:outline-none focus:border-neon-lime/50"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-space text-slate-500 uppercase tracking-widest">kWh</span>
        </div>
        <button 
          onClick={() => onBuy(amount)}
          className="w-full bg-neon-lime text-obsidian font-space font-bold text-sm tracking-wider py-3 hover:bg-[#b5f848] transition-colors uppercase shadow-[0_0_15px_rgba(163,230,53,0.1)]"
        >
          Buy Energy
        </button>
      </div>
    </div>
  );
};
