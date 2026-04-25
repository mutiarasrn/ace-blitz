///ace-blitz/aceblitz-backend/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import { EnergyMarketABI } from './abi';

// ── Setup ────────────────────────────────────────────────────────────
const app  = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// ── Blockchain connection ────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC);
const serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY!, provider);

const CONTRACT_ADDRESS = process.env.ENERGY_MARKET_ADDRESS!;
const contract = new ethers.Contract(CONTRACT_ADDRESS, EnergyMarketABI, serverWallet);

// ── Health check ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ACEBlitz backend running ⚡',
    wallet: serverWallet.address,
    contract: CONTRACT_ADDRESS,
    network: process.env.MONAD_RPC,
  });
});

// ── POST /simulate-meter ─────────────────────────────────────────────
// Simulasi IoT meter data → call confirmDelivery() on-chain
// Di production: dipanggil otomatis oleh smart meter device
app.post('/simulate-meter', async (req, res) => {
  const { seller, buyer, kwh, tradeId } = req.body;

  // Validasi input
  if (!seller || !buyer || !kwh || tradeId === undefined)
    return res.status(400).json({ error: 'Missing fields: seller, buyer, kwh, tradeId' });

  if (!ethers.isAddress(seller) || !ethers.isAddress(buyer))
    return res.status(400).json({ error: 'Invalid address format' });

  if (kwh <= 0)
    return res.status(400).json({ error: 'kWh must be greater than 0' });

  try {
    console.log(`📡 Meter data received: ${kwh} kWh | seller: ${seller} | buyer: ${buyer} | tradeId: ${tradeId}`);

    // Call confirmDelivery() on-chain
    // Backend wallet yang call ini — di production diganti oleh meter wallet
    const tx = await (contract as any).confirmDelivery(tradeId);
    const receipt = await tx.wait();

    console.log(`✅ Delivery confirmed | tx: ${receipt.hash}`);

    res.json({
      success: true,
      message: `${kwh} kWh delivery confirmed on-chain`,
      tradeId,
      seller,
      buyer,
      kwh,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    });

  } catch (err: unknown) {
    console.error('confirmDelivery error:', err);

    // Surface contract revert reason
    if (err instanceof Error) {
      if (err.message.includes('Not seller'))
        return res.status(403).json({ error: 'Only seller can confirm delivery' });
      if (err.message.includes('Invalid trade'))
        return res.status(404).json({ error: 'Trade not found' });
      if (err.message.includes('Already completed'))
        return res.status(409).json({ error: 'Trade already completed' });
      return res.status(500).json({ error: err.message });
    }

    res.status(500).json({ error: 'Unknown error' });
  }
});

// ── GET /listings ─────────────────────────────────────────────────────
// Fetch semua active listings dari contract
app.get('/listings', async (req, res) => {
  try {
    const raw = await (contract as any).getActiveListings();

    // Format bigint → readable
    const listings = raw
      .filter((l: any) => l.active)
      .map((l: any) => ({
        seller: l.seller,
        pricePerKwh: ethers.formatEther(l.pricePerKwh), // MON per kWh
        pricePerKwhWei: l.pricePerKwh.toString(),
        availableKwh: Number(l.availableKwh),
        active: l.active,
      }));

    res.json({ listings, total: listings.length });

  } catch (err: unknown) {
    console.error('getListings error:', err);
    // Contract belum deploy atau address 0x000 → return empty list buat dev
    return res.json({ listings: [], total: 0, note: 'Contract not deployed yet' });
  }
});

// ── GET /trades/:address ──────────────────────────────────────────────
// Fetch trade history untuk address tertentu (sebagai buyer atau seller)
app.get('/trades/:address', async (req, res) => {
  const { address } = req.params;

  if (!ethers.isAddress(address))
    return res.status(400).json({ error: 'Invalid address format' });

  try {
    // Ambil total trade counter dulu
    const total = await (contract as any).totalTrades();
    const count = Number(total);

    if (count === 0)
      return res.json({ trades: [], total: 0 });

    const tradePromises = Array.from({ length: count }, (_, i) =>
      (contract as any).getTrade(i).then((t: any) => ({ id: i, ...t }))
    );

    const allTrades = await Promise.all(tradePromises);

    const STATUS_MAP: Record<number, string> = {
      0: 'pending',
      1: 'completed',
      2: 'cancelled',
    };

    const userTrades = allTrades
      .filter((t: any) =>
        t.seller.toLowerCase() === address.toLowerCase() ||
        t.buyer.toLowerCase() === address.toLowerCase()
      )
      .map((t: any) => ({
        tradeId: t.id,
        seller: t.seller,
        buyer: t.buyer,
        kwh: Number(t.kwh),
        amount: ethers.formatEther(t.amount),
        amountWei: t.amount.toString(),
        status: STATUS_MAP[Number(t.status)] ?? 'unknown',
        createdAt: new Date(Number(t.timestamp) * 1000).toISOString(),
        role: t.seller.toLowerCase() === address.toLowerCase() ? 'seller' : 'buyer',
      }));

    res.json({ trades: userTrades, total: userTrades.length });

  } catch (err: unknown) {
    console.error('getTrades error:', err);
    return res.json({ trades: [], total: 0, note: 'Contract not deployed yet' });
  }
});

// ── GET /stats ────────────────────────────────────────────────────────
// Global stats buat landing page
app.get('/stats', async (req, res) => {
  try {
    const tradeCounter = await (contract as any).totalTrades();
    const listings = await (contract as any).getActiveListings();
    const activeListings = listings.filter((l: any) => l.active).length;

    res.json({
      totalTrades: Number(tradeCounter),
      activeListings,
    });

  } catch {
    // Contract belum deploy — return zeros
    res.json({ totalTrades: 0, activeListings: 0, note: 'Contract not deployed yet' });
  }
});

// ── Start server ──────────────────────────────────────────────────────
app.listen(3001, () => {
  console.log('');
  console.log('⚡ ACEBlitz backend running on http://localhost:3001');
  console.log(`🔑 Server wallet: ${serverWallet.address}`);
  console.log(`📄 Contract: ${CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: ${process.env.MONAD_RPC}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  GET  /              → health check');
  console.log('  GET  /listings      → active energy listings');
  console.log('  GET  /trades/:addr  → trade history per address');
  console.log('  GET  /stats         → global stats');
  console.log('  POST /simulate-meter → confirm delivery on-chain');
  console.log('');
});