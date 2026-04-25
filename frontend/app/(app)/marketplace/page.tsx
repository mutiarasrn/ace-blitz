"use client";

import { EnergyCard } from "@/components/ui/EnergyCard";

const MOCK_SELLERS: any[] = [
  { id: 1, name: "Solaris-Alpha", node: "0x7a2...f3E1", type: "SOLAR", price: "0.0038", supply: "4,250", metricLabel: "Yield Efficiency", metricValue: <span className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-neon-lime"></div><div className="w-1.5 h-1.5 rounded-full bg-neon-lime"></div><div className="w-1.5 h-1.5 rounded-full bg-neon-lime"></div><div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div></span> },
  { id: 2, name: "Zephyr-Dynamics", node: "0x3b1...2C9D", type: "WIND", price: "0.0041", supply: "12,800", metricLabel: "Node Uptime", metricValue: "99.9%" },
  { id: 3, name: "Hydro-Flow", node: "0x9c4...E8A2", type: "HYDRO", price: "0.0035", supply: "28,000", metricLabel: "Stability Index", metricValue: "Stable" },
  { id: 4, name: "Bio-Mesh", node: "0x5f1...A2B3", type: "BIO", price: "0.0052", supply: "850", metricLabel: "Carbon Offset", metricValue: "100%" },
  { id: 5, name: "Desert-Ray", node: "0x2d9...8F4B", type: "SOLAR", price: "0.0039", supply: "5,600", metricLabel: "Verifiable Node", metricValue: "Active" },
  { id: 6, name: "North-Wind", node: "0x8e5...3C11", type: "WIND", price: "0.0044", supply: "15,400", metricLabel: "Peak Capability", metricValue: <span className="text-white font-space">1.2 MW</span> },
];

export default function Marketplace() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div className="max-w-xl">
          <div className="inline-block px-3 py-1 rounded bg-neon-lime/10 border border-neon-lime/20 text-neon-lime font-space text-[10px] uppercase tracking-widest mb-4">
            Live Market
          </div>
          <h1 className="font-space text-4xl font-bold text-white mb-4 leading-tight">Real-time Energy<br />Marketplace</h1>
          <p className="text-slate-400 font-inter text-sm leading-relaxed">
            Direct peer-to-peer kWh trading on Monad. Secure your energy supply from verifiable green producers with instant on-chain settlement.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel p-5 border-white/5 min-w-[160px]">
            <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-2">Total Network Flow</p>
            <p className="font-space text-2xl font-bold text-neon-lime">1,240.8 <span className="text-sm font-normal">MWh</span></p>
          </div>
          <div className="glass-panel p-5 border-white/5 min-w-[160px]">
            <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-2">Avg. Price / kWh</p>
            <p className="font-space text-2xl font-bold text-monad-purple">0.0042 <span className="text-sm font-normal text-slate-400">MON</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SELLERS.map((seller) => (
          <EnergyCard
            key={seller.id}
            name={seller.name}
            node={seller.node}
            type={seller.type as any}
            pricePerKwh={seller.price}
            availableSupply={seller.supply}
            metricLabel={seller.metricLabel}
            metricValue={seller.metricValue}
            onBuy={(amount) => console.log(`Buying ${amount} from ${seller.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
