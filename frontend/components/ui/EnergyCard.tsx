"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Battery } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { formatEther } from "viem";

interface EnergyCardProps {
  seller: string;
  pricePerKwh: bigint;
  availableKwh: number;
  maxCapacity?: number;
  onBuy: () => void;
}

export const EnergyCard = ({ seller, pricePerKwh, availableKwh, maxCapacity = 100, onBuy }: EnergyCardProps) => {
  const percentage = Math.min(100, Math.max(0, (availableKwh / maxCapacity) * 100));
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-panel p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/5 transition-colors duration-500 rounded-2xl pointer-events-none" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-xs text-slate-400 font-inter mb-1">Seller Address</p>
          <p className="font-outfit text-white text-sm font-medium">
            {seller.slice(0, 6)}...{seller.slice(-4)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-inter mb-1">Price / kWh</p>
          <p className="font-outfit text-neon-green text-lg font-bold">
            {formatEther(pricePerKwh)} MON
          </p>
        </div>
      </div>

      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-xs font-inter text-slate-300 mb-2">
          <span className="flex items-center gap-1"><Battery size={14} className="text-neon-cyan"/> Available</span>
          <span>{availableKwh} kWh</span>
        </div>
        <div className="h-2 bg-obsidian rounded-full overflow-hidden border border-white/5 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-cyan to-neon-green shadow-[0_0_10px_#00FFA3]"
          />
        </div>
      </div>

      <div className="relative z-10">
        <MagneticButton className="w-full" onClick={onBuy}>
          <Zap size={16} /> Buy Energy
        </MagneticButton>
      </div>
    </motion.div>
  );
};
