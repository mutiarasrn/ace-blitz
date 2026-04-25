"use client";

import { motion } from "framer-motion";
import { Banknote, Zap, History, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useTrades } from "@/hooks/useEnergyMarket";

const STATUS_LABEL: Record<string, string> = {
  pending: "PENDING",
  completed: "FINALIZED",
  cancelled: "CANCELLED",
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { trades, loading } = useTrades(address);

  const buyerTrades = trades.filter(t => t.role === "buyer");
  const sellerTrades = trades.filter(t => t.role === "seller");

  const totalSpent = buyerTrades.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalEarned = sellerTrades
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-space text-xl text-white font-medium mb-1">Personal Portal</h1>
          <p className="font-inter text-sm text-slate-400">
            {isConnected && address
              ? `${address.slice(0, 6)}...${address.slice(-4)}`
              : "Connect wallet to view your trades"}
          </p>
        </div>
        <div className="text-right">
          <p className="font-space text-[10px] tracking-widest text-neon-lime uppercase mb-1">Total Trades</p>
          <p className="font-space text-xl text-neon-lime font-bold">{trades.length}</p>
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
          <p className="font-space text-3xl font-bold text-white mb-4 relative z-10">
            {loading ? "..." : totalSpent.toFixed(4)}{" "}
            <span className="text-monad-purple text-lg font-normal">MON</span>
          </p>
          <p className="font-inter text-xs text-slate-400 relative z-10">
            {buyerTrades.length} purchase{buyerTrades.length !== 1 ? "s" : ""} as buyer
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
          <p className="font-space text-3xl font-bold text-neon-lime mb-4 relative z-10">
            {loading ? "..." : totalEarned.toFixed(4)}{" "}
            <span className="text-white text-lg font-normal">MON</span>
          </p>
          <p className="font-inter text-xs text-neon-lime relative z-10">
            {sellerTrades.filter(t => t.status === "completed").length} completed sale{sellerTrades.filter(t => t.status === "completed").length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Trade History */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-space text-sm tracking-widest text-white uppercase flex items-center gap-2">
            <History size={16} className="text-neon-lime" /> Trade History
          </h2>
        </div>

        <div className="glass-panel overflow-hidden border-white/5">
          {loading && (
            <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="font-inter text-sm">Loading trades...</span>
            </div>
          )}

          {!loading && !isConnected && (
            <p className="text-center py-12 text-slate-500 font-inter text-sm">Connect your wallet to see your trade history.</p>
          )}

          {!loading && isConnected && trades.length === 0 && (
            <p className="text-center py-12 text-slate-500 font-inter text-sm">No trades yet. Head to the Marketplace to buy energy!</p>
          )}

          {!loading && trades.length > 0 && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-space tracking-widest uppercase text-slate-500 bg-white/[0.02]">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Counterparty</th>
                  <th className="p-4 font-medium">kWh</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-inter text-slate-300">
                {trades.map((trade) => {
                  const counterparty = trade.role === "buyer" ? trade.seller : trade.buyer;
                  return (
                    <tr key={trade.tradeId} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4 text-xs">
                        {new Date(trade.createdAt).toLocaleString("id-ID", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-space font-bold tracking-widest uppercase border ${
                          trade.role === "seller"
                            ? "bg-teal-400/10 text-teal-400 border-teal-400/30"
                            : "bg-monad-purple/10 text-monad-purple border-monad-purple/30"
                        }`}>
                          {trade.role}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-monad-purple/30 flex items-center justify-center text-[8px] font-space text-white">0x</div>
                        {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
                      </td>
                      <td className="p-4 font-space">{trade.kwh}</td>
                      <td className="p-4 font-space text-neon-lime">{parseFloat(trade.amount).toFixed(4)} MON</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-space font-bold tracking-widest uppercase border ${
                          trade.status === "completed"
                            ? "bg-neon-lime/10 text-neon-lime border-neon-lime/30"
                            : trade.status === "pending"
                            ? "bg-teal-400/10 text-teal-400 border-teal-400/30"
                            : "bg-slate-500/10 text-slate-400 border-white/10"
                        }`}>
                          {STATUS_LABEL[trade.status] ?? trade.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
