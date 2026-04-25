"use client";

import { EnergyCard } from "@/components/ui/EnergyCard";
import { useListings, useBuyEnergy } from "@/hooks/useEnergyMarket";
import { useAccount } from "wagmi";
import { Loader2 } from "lucide-react";

export default function Marketplace() {
  const { address } = useAccount();
  const { listings, loading, error } = useListings();
  const { buy, isPending, isConfirming, isSuccess } = useBuyEnergy();

  const handleBuy = (seller: string, pricePerKwh: string, amount: string) => {
    if (!address) {
      alert("Connect your wallet first!");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      alert("Enter a valid kWh amount");
      return;
    }
    buy(seller, parseFloat(amount), pricePerKwh);
  };

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
            <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-2">Active Sellers</p>
            <p className="font-space text-2xl font-bold text-neon-lime">{listings.length} <span className="text-sm font-normal">nodes</span></p>
          </div>
          <div className="glass-panel p-5 border-white/5 min-w-[160px]">
            <p className="font-space text-[10px] tracking-widest text-slate-500 uppercase mb-2">Network</p>
            <p className="font-space text-sm font-bold text-monad-purple flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-lime animate-pulse inline-block" />
              Monad Testnet
            </p>
          </div>
        </div>
      </div>

      {/* Tx status banner */}
      {(isPending || isConfirming || isSuccess) && (
        <div className={`mb-6 px-6 py-4 rounded border flex items-center gap-3 font-space text-sm ${
          isSuccess
            ? "bg-neon-lime/10 border-neon-lime/30 text-neon-lime"
            : "bg-white/5 border-white/10 text-slate-300"
        }`}>
          {!isSuccess && <Loader2 size={16} className="animate-spin" />}
          {isPending && "Waiting for wallet confirmation..."}
          {isConfirming && "Transaction submitted, waiting for block..."}
          {isSuccess && "Trade completed! MON sent to seller."}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-inter text-sm">Fetching listings from contract...</span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-24 text-slate-500 font-inter text-sm">
          Could not fetch listings: {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && listings.length === 0 && (
        <div className="text-center py-24 text-slate-500 font-inter text-sm">
          No active sellers yet. Be the first to register!
        </div>
      )}

      {/* Listings grid */}
      {!loading && listings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <EnergyCard
              key={listing.seller}
              name={listing.name ?? `${listing.seller.slice(0, 6)}...${listing.seller.slice(-4)}`}
              node={listing.seller}
              type="SOLAR"
              pricePerKwh={parseFloat(listing.pricePerKwh).toFixed(6)}
              availableSupply={parseFloat(listing.availableKwh).toFixed(2)}
              metricLabel="Seller"
              metricValue={<span className="text-neon-lime text-xs">{listing.seller.slice(0, 10)}...</span>}
              onBuy={(amount) => handleBuy(listing.seller, listing.pricePerKwh, amount)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
