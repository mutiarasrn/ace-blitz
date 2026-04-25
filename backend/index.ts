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

// ── In-memory seller name store ───────────────────────────────────────
const sellerNames = new Map<string, string>();

// ── Simple cache (5s TTL) ─────────────────────────────────────────────
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 5000; // 5 detik

function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return Promise.resolve(hit.data as T);
  return fn().then(data => { cache.set(key, { data, ts: Date.now() }); return data; });
}

// POST /seller-name — seller daftar nama
app.post('/seller-name', (req, res) => {
  const { address, name } = req.body;
  if (!address || !name) {
    res.status(400).json({ error: 'address and name are required' });
    return;
  }
  if (!ethers.isAddress(address)) {
    res.status(400).json({ error: 'Invalid address' });
    return;
  }
  sellerNames.set(address.toLowerCase(), name.trim());
  res.json({ success: true, address, name });
});

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
    const raw = await cached('listings', () => (contract as any).getActiveListings());

    // Format bigint → readable
    const listings = raw
      .map((l: any) => ({
        seller: l.seller,
        name: sellerNames.get(l.seller.toLowerCase()) ?? null,
        pricePerKwh: ethers.formatEther(l.pricePerKwh),
        pricePerKwhWei: l.pricePerKwh.toString(),
        availableKwh: ethers.formatEther(l.availableKwh),
        active: true,
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
    const total = await cached('totalTrades', () => (contract as any).totalTrades());
    const count = Number(total);

    if (count === 0)
      return res.json({ trades: [], total: 0 });

    const allTrades = await cached(`allTrades:${count}`, async () => {
      const settled = await Promise.allSettled(
        Array.from({ length: count }, (_, i) =>
          (contract as any).getTrade(i).then((t: any) => ({ id: i, ...t }))
        )
      );
      return settled
        .filter((r): r is PromiseFulfilledResult<any> => {
          if (r.status === 'rejected') console.error('getTrade failed:', r.reason);
          return r.status === 'fulfilled';
        })
        .map(r => r.value);
    });

    const STATUS_MAP: Record<number, string> = {
      0: 'pending',
      1: 'completed',
      2: 'cancelled',
    };

    const userTrades = allTrades
      .map((t: any) => {
        // ethers v6 Result — access by name with fallback to index
        const seller: string = t.seller ?? t[0];
        const buyer: string  = t.buyer  ?? t[1];
        const kwh            = t.kwh    ?? t[2];
        const amount         = t.amount ?? t[3];
        const status         = t.status ?? t[4];
        const timestamp      = t.timestamp ?? t[5];
        return {
          tradeId: t.id,
          seller,
          buyer,
          kwh: Number(kwh),
          amount: ethers.formatEther(amount),
          amountWei: amount.toString(),
          status: STATUS_MAP[Number(status)] ?? 'unknown',
          createdAt: new Date(Number(timestamp) * 1000).toISOString(),
          role: seller.toLowerCase() === address.toLowerCase() ? 'seller' : 'buyer',
        };
      })
      .filter((t: any) =>
        t.seller.toLowerCase() === address.toLowerCase() ||
        t.buyer.toLowerCase() === address.toLowerCase()
      );

    res.json({ trades: userTrades, total: userTrades.length });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('getTrades error:', msg);
    return res.json({ trades: [], total: 0, error: msg });
  }
});

// ── GET /stats ────────────────────────────────────────────────────────
// Global stats buat landing page
app.get('/stats', async (req, res) => {
  try {
    const [tradeCounter, listings] = await Promise.all([
      cached('totalTrades', () => (contract as any).totalTrades()),
      cached('listings', () => (contract as any).getActiveListings()),
    ]);
    const activeListings = listings.length;

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
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log('');
  console.log(`⚡ ACEBlitz backend running on port ${PORT}`);
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