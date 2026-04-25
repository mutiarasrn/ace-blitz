"use client";

import { motion } from "framer-motion";
import { Zap, Wind, CheckCircle2, XCircle, PauseCircle, Download } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: 'Mon', yield: 400 },
  { name: 'Tue', yield: 600 },
  { name: 'Wed', yield: 550 },
  { name: 'Thu', yield: 800 },
  { name: 'Fri', yield: 850 },
  { name: 'Sat', yield: 650 },
  { name: 'Sun', yield: 500 },
];

export default function SellerHub() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Grid: Analytics & New Node */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="font-space text-lg text-white font-medium">Revenue Analytics</h2>
              <p className="font-inter text-sm text-slate-400">Real-time yield from energy nodes</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-neon-lime/10 text-neon-lime text-xs font-space font-bold border border-neon-lime/20">
              +12.4% Δ
            </div>
          </div>
          
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#0C0E17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#A3E635' }}
                />
                <Bar dataKey="yield" fill="#312e81" radius={[2, 2, 0, 0]} activeBar={{ fill: '#A3E635' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
            <div>
              <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-1">Total Earned</p>
              <p className="font-space text-2xl font-bold text-neon-lime">1,452.80 <span className="text-sm font-normal">MON</span></p>
            </div>
            <div>
              <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-1">Uptime</p>
              <p className="font-space text-2xl font-bold text-white">99.98%</p>
            </div>
            <div>
              <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-1">Active Nodes</p>
              <p className="font-space text-2xl font-bold text-teal-400">04</p>
            </div>
          </div>
        </div>

        {/* New Supply Node */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 rounded-full bg-neon-lime flex items-center justify-center text-obsidian font-bold pb-0.5">+</div>
            <h2 className="font-space text-lg text-white font-medium">New Supply Node</h2>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block font-space text-[10px] tracking-widest text-slate-400 uppercase mb-2">Unit Price (MON/kWh)</label>
              <input type="text" defaultValue="0.0045" className="w-full bg-obsidian-card border-none rounded p-4 text-white font-space text-lg focus:outline-none focus:ring-1 focus:ring-neon-lime/50" />
            </div>
            <div>
              <label className="block font-space text-[10px] tracking-widest text-slate-400 uppercase mb-2">Total Stock (kWh)</label>
              <input type="text" defaultValue="5000" className="w-full bg-obsidian-card border-none rounded p-4 text-white font-space text-lg focus:outline-none focus:ring-1 focus:ring-neon-lime/50" />
            </div>
            
            <button type="button" className="w-full bg-neon-lime text-obsidian font-space font-bold text-sm tracking-widest py-4 mt-4 hover:bg-[#b5f848] transition-colors shadow-[0_0_15px_rgba(163,230,53,0.1)] uppercase">
              Initialize Listing
            </button>
            <p className="text-center font-inter text-[9px] text-slate-500 mt-4 leading-relaxed">
              By initializing, you agree to automated delivery via the<br/>Monad Smart Contract Engine.
            </p>
          </form>
        </div>
      </div>

      {/* Middle Grid: Listings & Settlements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Listings */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-space text-sm tracking-widest text-white uppercase flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-lime rounded-sm"></span> Active Listings
            </h3>
            <span className="font-inter text-xs text-slate-500">2 ITEMS RUNNING</span>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-obsidian-card border border-neon-lime/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-neon-lime/10 flex items-center justify-center text-neon-lime">
                  <Zap size={18} />
                </div>
                <div>
                  <h4 className="font-space text-white font-medium">Solar-Farm-Delta</h4>
                  <p className="font-inter text-xs text-slate-500">Price: 0.0042 MON / Total: 2,500 kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4 border-r border-white/10 pr-4">
                  <p className="font-space text-[10px] text-neon-lime font-bold tracking-widest uppercase mb-1">Live</p>
                  <p className="font-inter text-xs text-white">842 Sold</p>
                </div>
                <button className="text-slate-400 hover:text-white"><PauseCircle size={18} /></button>
              </div>
            </div>

            <div className="p-4 bg-obsidian-card border border-white/5 rounded-lg flex items-center justify-between opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-monad-purple/10 flex items-center justify-center text-monad-purple">
                  <Wind size={18} />
                </div>
                <div>
                  <h4 className="font-space text-white font-medium">Wind-Turbine-Alpha</h4>
                  <p className="font-inter text-xs text-slate-500">Price: 0.0039 MON / Total: 1,200 kWh</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4 border-r border-white/10 pr-4">
                  <p className="font-space text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">Paused</p>
                  <p className="font-inter text-xs text-white">0 Sold</p>
                </div>
                <button className="text-neon-lime hover:text-[#b5f848]"><CheckCircle2 size={18} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Settlement */}
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-space text-sm tracking-widest text-white uppercase flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-400 rounded-sm"></span> Pending Settlement
            </h3>
            <span className="font-inter text-[10px] tracking-widest uppercase text-red-400">Action Required</span>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 bg-obsidian-card border border-teal-500/30 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-space font-bold tracking-widest uppercase bg-teal-500/10 text-teal-400 mb-2">Incoming Order</span>
                  <h4 className="font-space text-lg text-white font-medium">Order #8821-XP</h4>
                  <p className="font-inter text-[10px] text-slate-500">Buyer: 0x8a...2b91 • 450 kWh</p>
                </div>
                <p className="font-space text-xl text-teal-400 font-bold">2.025 MON</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-teal-400 text-obsidian font-space font-bold text-xs tracking-widest py-3 hover:bg-teal-300 transition-colors uppercase">
                  Confirm Delivery
                </button>
                <button className="w-12 flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors rounded">
                  <XCircle size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 bg-obsidian-card border border-white/5 rounded-lg opacity-60">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[9px] font-space font-bold tracking-widest uppercase bg-slate-500/10 text-slate-400 mb-2">Verification Pending</span>
                  <h4 className="font-space text-lg text-white font-medium">Order #8820-XP</h4>
                  <p className="font-inter text-[10px] text-slate-500">Buyer: 0x3d...f012 • 120 kWh</p>
                </div>
                <p className="font-space text-xl text-slate-400 font-bold">0.540 MON</p>
              </div>
              <div className="w-full bg-white/5 border border-white/5 text-slate-500 text-xs font-inter italic py-3 text-center rounded">
                AWAITING GRID PING...
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Table: Logs */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-space text-sm tracking-widest text-white uppercase">Node Performance Logs</h3>
          <button className="flex items-center gap-2 font-space text-[10px] tracking-widest uppercase text-neon-lime hover:text-[#b5f848] transition-colors">
            Download CSV <Download size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-space tracking-widest uppercase text-slate-500">
                <th className="pb-4 font-medium">Timestamp</th>
                <th className="pb-4 font-medium">Node ID</th>
                <th className="pb-4 font-medium">Outflow (kWh)</th>
                <th className="pb-4 font-medium">Earnings</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-inter text-slate-300">
              <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4">2024-05-24 14:02:11</td>
                <td className="py-4">SOLAR-DELTA-01</td>
                <td className="py-4">42.5</td>
                <td className="py-4 font-space text-neon-lime">0.191 MON</td>
                <td className="py-4"><span className="flex items-center gap-2 text-[10px] font-space tracking-widest uppercase text-neon-lime"><span className="w-1.5 h-1.5 rounded-full bg-neon-lime"></span> Success</span></td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-4">2024-05-24 13:58:45</td>
                <td className="py-4">WIND-ALPHA-04</td>
                <td className="py-4">128.0</td>
                <td className="py-4 font-space text-neon-lime">0.499 MON</td>
                <td className="py-4"><span className="flex items-center gap-2 text-[10px] font-space tracking-widest uppercase text-neon-lime"><span className="w-1.5 h-1.5 rounded-full bg-neon-lime"></span> Success</span></td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="py-4">2024-05-24 13:12:02</td>
                <td className="py-4">SOLAR-DELTA-01</td>
                <td className="py-4">12.2</td>
                <td className="py-4 font-space text-neon-lime">0.054 MON</td>
                <td className="py-4"><span className="flex items-center gap-2 text-[10px] font-space tracking-widest uppercase text-neon-lime"><span className="w-1.5 h-1.5 rounded-full bg-neon-lime"></span> Success</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
