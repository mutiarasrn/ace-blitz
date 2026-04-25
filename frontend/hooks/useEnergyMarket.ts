"use client";

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useState, useEffect } from "react";
import { ENERGY_MARKET_ABI, ENERGY_MARKET_ADDRESS, BACKEND_URL } from "@/lib/abi";

// ── Types ────────────────────────────────────────────────────────────────

export type Listing = {
  seller: string;
  name: string | null;
  pricePerKwh: string;   // in MON (formatted)
  availableKwh: string;  // in kWh (formatted)
};

export type Trade = {
  tradeId: number;
  seller: string;
  buyer: string;
  kwh: string;
  amount: string;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  role: "seller" | "buyer";
};

// ── Fetch listings dari backend ──────────────────────────────────────────

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/listings`);
      const data = await res.json();
      setListings(data.listings ?? []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // Refresh tiap 15 detik
    const interval = setInterval(fetchListings, 15000);
    return () => clearInterval(interval);
  }, []);

  return { listings, loading, error, refetch: fetchListings };
}

// ── Buy energy — langsung ke contract via wagmi ──────────────────────────

export function useBuyEnergy() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const buy = (seller: string, kwhAmount: number, pricePerKwhMON: string) => {
    const kwhWei = parseEther(kwhAmount.toString());
    const totalValue = parseEther((kwhAmount * parseFloat(pricePerKwhMON)).toFixed(18));

    writeContract({
      address: ENERGY_MARKET_ADDRESS,
      abi: ENERGY_MARKET_ABI,
      functionName: "buyEnergy",
      args: [seller as `0x${string}`, kwhWei],
      value: totalValue,
    });
  };

  return { buy, isPending, isConfirming, isSuccess, hash, error };
}

// ── Register sebagai seller ──────────────────────────────────────────────

export function useRegisterProducer() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const register = (pricePerKwhMON: string, availableKwh: number) => {
    writeContract({
      address: ENERGY_MARKET_ADDRESS,
      abi: ENERGY_MARKET_ABI,
      functionName: "registerProducer",
      args: [parseEther(pricePerKwhMON), parseEther(availableKwh.toString())],
    });
  };

  return { register, isPending, isConfirming, isSuccess, hash, error };
}

// ── Confirm delivery ─────────────────────────────────────────────────────

export function useConfirmDelivery() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const confirm = (tradeId: number) => {
    writeContract({
      address: ENERGY_MARKET_ADDRESS,
      abi: ENERGY_MARKET_ABI,
      functionName: "confirmDelivery",
      args: [BigInt(tradeId)],
    });
  };

  return { confirm, isPending, isConfirming, isSuccess, hash, error };
}

// ── Fetch trades per address dari backend ────────────────────────────────

export function useTrades(address?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = async () => {
    if (!address) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/trades/${address}`);
      const data = await res.json();
      setTrades(data.trades ?? []);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [address]);

  return { trades, loading, error, refetch: fetchTrades };
}

// ── Register nama seller ke backend ─────────────────────────────────

export function useRegisterSellerName() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const registerName = async (address: string, name: string) => {
    setLoading(true);
    try {
      await fetch(`${BACKEND_URL}/seller-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, name }),
      });
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return { registerName, loading, success };
}

// ── Quote harga sebelum beli ─────────────────────────────────────────────

export function useQuoteEnergy(seller?: string, kwh?: number) {
  return useReadContract({
    address: ENERGY_MARKET_ADDRESS,
    abi: ENERGY_MARKET_ABI,
    functionName: "quoteEnergy",
    args: seller && kwh ? [seller as `0x${string}`, parseEther(kwh.toString())] : undefined,
    query: { enabled: !!seller && !!kwh },
  });
}
