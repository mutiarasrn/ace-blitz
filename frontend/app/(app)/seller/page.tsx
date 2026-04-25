"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts";
import { useAccount } from "wagmi";
import { useRegisterProducer, useTrades, useRegisterSellerName } from "@/hooks/useEnergyMarket";
import { useReadContract } from "wagmi";
import { ENERGY_MARKET_ABI, ENERGY_MARKET_ADDRESS } from "@/lib/abi";
import { formatEther } from "viem";

const chartData = [
  { name: 'Mon', yield: 400 },
  { name: 'Tue', yield: 600 },
  { name: 'Wed', yield: 550 },
  { name: 'Thu', yield: 800 },
  { name: 'Fri', yield: 850 },
  { name: 'Sat', yield: 650 },
  { name: 'Sun', yield: 500 },
];

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function SellerHub() {
  const { address, isConnected } = useAccount();
  const [price, setPrice] = useState("0.0045");
  const [stock, setStock] = useState("5000");
  const [nodeName, setNodeName] = useState("");

  const { register, isPending: isRegistering, isConfirming: isRegConfirming, isSuccess: isRegSuccess } = useRegisterProducer();
  const { registerName } = useRegisterSellerName();
  const { trades, loading: tradesLoading } = useTrades(address);

  // Fetch current listing for connected wallet
  const { data: myListing } = useReadContract({
    address: ENERGY_MARKET_ADDRESS,
    abi: ENERGY_MARKET_ABI,
    functionName: "listings",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const completedTrades = trades.filter(t => t.status === "completed" && t.role === "seller");
  const totalEarned = completedTrades.reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const handleRegister = async () => {
    if (!isConnected || !address) { alert("Connect your wallet first!"); return; }
    if (!price || !stock) { alert("Fill in price and stock"); return; }
    if (nodeName.trim()) await registerName(address, nodeName.trim());
    register(price, parseFloat(stock));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">

      {/* Tx status banner */}
      {(isRegistering || isRegConfirming || isRegSuccess) && (
        <div className={`px-6 py-4 rounded border flex items-center gap-3 font-space text-sm ${isRegSuccess ? "bg-neon-lime/10 border-neon-lime/30 text-neon-lime" : "bg-white/5 border-white/10 text-slate-300"}`}>
          {!isRegSuccess && <Loader2 size={16} className="animate-spin" />}
          {isRegistering && "Waiting for wallet confirmation..."}
          {isRegConfirming && "Registering listing on-chain..."}
          {isRegSuccess && "Listing registered! You are now a seller."}
        </div>
      )}

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Analytics */}
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
              <BarChart data={chartData}>
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
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
              <p className="font-space text-2xl font-bold text-neon-lime">{totalEarned.toFixed(4)} <span className="text-sm font-normal">MON</span></p>
            </div>
            <div>
              <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-1">Completed Trades</p>
              <p className="font-space text-2xl font-bold text-white">{completedTrades.length}</p>
            </div>
            <div>
              <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-1">Total Trades</p>
              <p className="font-space text-2xl font-bold text-teal-400">{trades.filter(t => t.role === "seller").length}</p>
            </div>
          </div>
        </div>

        {/* Register / Update Listing */}
        <div className="glass-panel p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-5 h-5 rounded-full bg-neon-lime flex items-center justify-center text-obsidian font-bold pb-0.5">+</div>
            <h2 className="font-space text-lg text-white font-medium">
              {myListing && (myListing as any)[2] ? "Update Listing" : "New Supply Node"}
            </h2>
          </div>

          {/* Show current listing if exists */}
          {myListing && (myListing as any)[2] && (
            <div className="mb-6 p-3 bg-neon-lime/5 border border-neon-lime/20 rounded">
              <p className="font-space text-[10px] text-neon-lime tracking-widest uppercase mb-1">Current Listing Active</p>
              <p className="font-inter text-xs text-slate-400">
                Price: {formatEther((myListing as any)[0])} MON/kWh<br />
                Stock: {formatEther((myListing as any)[1])} kWh
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block font-space text-[10px] tracking-widest text-slate-400 uppercase mb-2">Node Name</label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="e.g. Solaris-Alpha"
                className="w-full bg-obsidian-card border-none rounded p-4 text-white font-space text-lg focus:outline-none focus:ring-1 focus:ring-neon-lime/50"
              />
            </div>
            <div>
              <label className="block font-space text-[10px] tracking-widest text-slate-400 uppercase mb-2">Unit Price (MON/kWh)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-obsidian-card border-none rounded p-4 text-white font-space text-lg focus:outline-none focus:ring-1 focus:ring-neon-lime/50"
              />
            </div>
            <div>
              <label className="block font-space text-[10px] tracking-widest text-slate-400 uppercase mb-2">Total Stock (kWh)</label>
              <input
                type="text"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-obsidian-card border-none rounded p-4 text-white font-space text-lg focus:outline-none focus:ring-1 focus:ring-neon-lime/50"
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={isRegistering || isRegConfirming}
              className="w-full bg-neon-lime text-obsidian font-space font-bold text-sm tracking-widest py-4 mt-4 hover:bg-[#b5f848] transition-colors shadow-[0_0_15px_rgba(163,230,53,0.1)] uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {(isRegistering || isRegConfirming) && <Loader2 size={14} className="animate-spin" />}
              {myListing && (myListing as any)[2] ? "Update Listing" : "Initialize Listing"}
            </button>
            <p className="text-center font-inter text-[9px] text-slate-500 mt-4 leading-relaxed">
              By initializing, you agree to automated delivery via the<br />Monad Smart Contract Engine.
            </p>
          </div>
        </div>
      </div>


      {/* Trade Logs */}
      <div className="glass-panel p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-space text-sm tracking-widest text-white uppercase">Trade Logs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-space tracking-widest uppercase text-slate-500">
                <th className="pb-4 font-medium">Trade ID</th>
                <th className="pb-4 font-medium">Buyer</th>
                <th className="pb-4 font-medium">kWh</th>
                <th className="pb-4 font-medium">Earnings</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-inter text-slate-300">
              {trades.filter(t => t.role === "seller").length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">No trades yet.</td>
                </tr>
              )}
              {trades.filter(t => t.role === "seller").map((trade) => (
                <tr key={trade.tradeId} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-4">#{trade.tradeId}</td>
                  <td className="py-4">{trade.buyer.slice(0, 8)}...{trade.buyer.slice(-4)}</td>
                  <td className="py-4">{trade.kwh}</td>
                  <td className="py-4 font-space text-neon-lime">{parseFloat(trade.amount).toFixed(4)} MON</td>
                  <td className="py-4">
                    <span className={`flex items-center gap-2 text-[10px] font-space tracking-widest uppercase ${trade.status === "completed" ? "text-neon-lime" : trade.status === "pending" ? "text-teal-400" : "text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${trade.status === "completed" ? "bg-neon-lime" : trade.status === "pending" ? "bg-teal-400" : "bg-slate-400"}`}></span>
                      {STATUS_LABEL[trade.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
