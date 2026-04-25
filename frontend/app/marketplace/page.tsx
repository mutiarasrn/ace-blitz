"use client";

import { motion, Variants } from "framer-motion";
import { EnergyCard } from "@/components/ui/EnergyCard";
import { Search, Filter } from "lucide-react";

const MOCK_SELLERS = [
  { id: 1, seller: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", price: BigInt("500000000000000000"), kwh: 120, max: 150 },
  { id: 2, seller: "0x1b340d5630B4cF539739dF2C5dAcb4c659F2412A", price: BigInt("450000000000000000"), kwh: 45, max: 100 },
  { id: 3, seller: "0x9f250d5630B4cF539739dF2C5dAcb4c659F2499B", price: BigInt("550000000000000000"), kwh: 200, max: 200 },
  { id: 4, seller: "0x4c250d5630B4cF539739dF2C5dAcb4c659F2433C", price: BigInt("480000000000000000"), kwh: 10, max: 50 },
  { id: 5, seller: "0x2d250d5630B4cF539739dF2C5dAcb4c659F2455E", price: BigInt("520000000000000000"), kwh: 80, max: 100 },
  { id: 6, seller: "0x8e250d5630B4cF539739dF2C5dAcb4c659F2477F", price: BigInt("500000000000000000"), kwh: 150, max: 200 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function Marketplace() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white mb-3">Energy Marketplace</h1>
          <p className="text-slate-400 font-inter">Browse active producers and purchase energy directly.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search seller..." 
              className="w-full bg-obsidian-light border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm font-inter text-white focus:outline-none focus:border-neon-cyan/50 transition-colors"
            />
          </div>
          <button className="glass-panel p-2 hover:bg-white/5 transition-colors">
            <Filter className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MOCK_SELLERS.map((seller) => (
          <motion.div key={seller.id} variants={itemVariants}>
            <EnergyCard
              seller={seller.seller}
              pricePerKwh={seller.price}
              availableKwh={seller.kwh}
              maxCapacity={seller.max}
              onBuy={() => console.log(`Buying from ${seller.seller}`)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
