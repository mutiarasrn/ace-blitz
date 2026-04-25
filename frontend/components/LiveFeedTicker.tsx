"use client";

import React from "react";
import { Activity } from "lucide-react";

const MOCK_TRADES = [
  { id: 1, text: "0x12...34 bought 50 kWh from 0xab...cd for 0.5 MON" },
  { id: 2, text: "0x88...99 registered as producer with 120 kWh" },
  { id: 3, text: "0x44...55 bought 10 kWh from 0xef...12 for 0.1 MON" },
  { id: 4, text: "0xaa...bb confirmed delivery of 25 kWh" },
];

export const LiveFeedTicker = () => {
  return (
    <div className="w-full bg-obsidian-light/80 border-y border-white/10 py-2 overflow-hidden flex items-center relative z-20">
      <div className="px-4 flex items-center gap-2 text-neon-green border-r border-white/10 z-10 bg-obsidian-light whitespace-nowrap">
        <Activity size={16} className="animate-glow-pulse" />
        <span className="font-outfit text-xs font-bold tracking-wider uppercase">Live Feed</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker flex whitespace-nowrap">
          {[...MOCK_TRADES, ...MOCK_TRADES].map((trade, idx) => (
            <div key={`${trade.id}-${idx}`} className="inline-flex items-center px-8 text-sm font-inter text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mr-3" />
              {trade.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
