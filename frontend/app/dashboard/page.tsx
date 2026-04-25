"use client";

import { motion } from "framer-motion";
import { Receipt, ArrowUpRight, ArrowDownRight } from "lucide-react";
import React from "react";

const MOCK_RECEIPTS = [
  { id: "101", date: "2024-05-01", kwh: 50, amount: "25.0", type: "bought" },
  { id: "102", date: "2024-05-02", kwh: 120, amount: "60.0", type: "sold" },
  { id: "103", date: "2024-05-03", kwh: 10, amount: "5.0", type: "bought" },
];

export default function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-12">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="glass-panel p-6 flex flex-col justify-center">
          <p className="text-slate-400 font-inter text-sm mb-2 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-neon-cyan" /> Total Spent
          </p>
          <p className="font-outfit text-4xl font-bold text-white">30.0 <span className="text-xl text-slate-500">MON</span></p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center">
          <p className="text-slate-400 font-inter text-sm mb-2 flex items-center gap-2">
            <ArrowDownRight size={16} className="text-neon-green" /> Total Earned
          </p>
          <p className="font-outfit text-4xl font-bold text-white">60.0 <span className="text-xl text-slate-500">MON</span></p>
        </div>
      </div>

      <div>
        <h2 className="font-outfit text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Receipt className="text-neon-cyan" /> Energy Receipts (NFTs)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 perspective-1000">
          {MOCK_RECEIPTS.map((receipt, i) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                rotateY: 10, 
                rotateX: -10, 
                z: 50,
                boxShadow: "0 25px 50px -12px rgba(0, 255, 163, 0.25)"
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass-panel aspect-[3/4] p-6 flex flex-col relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full ease-in-out" />
              
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl mb-4">
                <Receipt size={48} className={receipt.type === 'bought' ? 'text-neon-cyan mb-2' : 'text-neon-green mb-2'} />
                <p className="font-outfit font-bold text-lg text-white">{receipt.kwh} kWh</p>
                <p className="text-xs text-slate-400">{receipt.type.toUpperCase()}</p>
              </div>
              
              <div className="mt-auto">
                <p className="text-xs text-slate-400 mb-1">Receipt ID</p>
                <p className="font-outfit font-medium text-sm text-white border-b border-white/10 pb-2 mb-2">#{receipt.id}</p>
                <div className="flex justify-between text-xs font-inter text-slate-400">
                  <span>{receipt.date}</span>
                  <span>{receipt.amount} MON</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
