"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

const MOCK_TRADES = [
  { id: "TRD-1029", buyer: "0x123...456", kwh: 50, status: "pending", amount: "25.0" },
  { id: "TRD-1028", buyer: "0xabc...def", kwh: 120, status: "completed", amount: "60.0" },
];

export default function SellerPortal() {
  const [price, setPrice] = useState(0.5);
  const [capacity, setCapacity] = useState(100);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1"
      >
        <h2 className="font-outfit text-3xl font-bold text-white mb-6">Producer Settings</h2>
        
        <div className="glass-panel p-6">
          <form className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-inter text-slate-400 mb-2">Price per kWh (MON)</label>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-obsidian border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neon-green/50 transition-colors"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-inter text-slate-400 mb-2">Available Capacity (kWh)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full accent-neon-green"
                />
                <span className="text-neon-green font-outfit font-bold min-w-[3rem] text-right">{capacity}</span>
              </div>
            </div>

            <div className="p-4 bg-neon-green/10 rounded-lg border border-neon-green/20">
              <p className="text-xs text-slate-400 mb-1">Projected Max Earnings</p>
              <p className="text-xl font-outfit font-bold text-neon-green">{(price * capacity).toFixed(2)} MON</p>
            </div>

            <MagneticButton className="w-full mt-2" type="button">
              Update Listing
            </MagneticButton>
          </form>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-2"
      >
        <h2 className="font-outfit text-3xl font-bold text-white mb-6">Trade Dashboard</h2>
        
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-sm font-inter text-slate-400">
                  <th className="p-4 font-medium">Trade ID</th>
                  <th className="p-4 font-medium">Buyer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_TRADES.map((trade) => (
                  <tr key={trade.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-outfit text-white">{trade.id}</td>
                    <td className="p-4 font-inter text-sm text-slate-300">{trade.buyer}</td>
                    <td className="p-4 font-outfit text-white font-medium">{trade.kwh} kWh <span className="text-slate-500 text-xs">({trade.amount} MON)</span></td>
                    <td className="p-4">
                      {trade.status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
                          <Clock size={12} /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs font-medium border border-neon-green/20">
                          <CheckCircle2 size={12} /> Completed
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {trade.status === "pending" && (
                        <button className="px-4 py-2 bg-white/5 hover:bg-neon-green/20 text-neon-green text-xs font-medium rounded-lg transition-colors border border-neon-green/30">
                          Confirm Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
