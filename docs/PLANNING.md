# WattChain — P2P Energy Trading on Monad
> Hackathon: Monad Blitz | Theme: Social / DeFi | Duration: 6 hours

---

## TL;DR

Rumah dengan solar panel bisa jual surplus listrik langsung ke tetangga via smart contract — tanpa PLN sebagai perantara. Harga transparan, pembayaran otomatis, semua tercatat on-chain di Monad.

**Pitch in one sentence:**
> "PLN monopoli harga listrik dan datanya tidak transparan — WattChain kasih warga kemampuan jual-beli energi langsung, on-chain, fair."

**Why Monad?**
Transaksi meter bisa terjadi tiap menit per household. Di Ethereum: lambat + gas mahal = tidak feasible. Di Monad: < 2 detik, near-zero gas = P2P energy trading jadi possible.

---

## The Problem

- PLN monopoli distribusi listrik di daerah terpencil (contoh: Gili Ketapang)
- Warga yang punya solar panel tidak bisa jual surplus ke tetangga — harus jual balik ke PLN dengan harga sangat murah
- Tagihan listrik tidak transparan, warga tidak bisa verifikasi
- Microgrid komunal sudah ada secara fisik, tapi settlement-nya masih manual / terpusat

---

## The Solution — Flow

```
SELLER (punya solar panel)               BUYER (butuh listrik)
        │                                        │
        │  1. registerProducer()                 │  1. buyEnergy(seller, kWh)
        │  → set harga per kWh                   │  → kirim MON token
        │  → list di marketplace                 │  → smart contract hold
        │                                        │
        │         SMART CONTRACT                 │
        │    ┌─────────────────────┐             │
        │    │ - energy listings   │             │
        │    │ - escrow payment    │             │
        │    │ - confirm delivery  │             │
        │    │ - release payment   │             │
        │    └─────────────────────┘             │
        │                                        │
        │  2. confirmDelivery()                  │
        │  → backend post meter data             │
        │  → payment released ke seller          │  2. Terima listrik ✓
        │  → NFT receipt ke buyer                │  3. Receipt on-chain ✓
```

---

## Smart Contracts

### 1. `EnergyMarket.sol` — Core contract
```
State:
- listings: mapping(address => Listing)  // seller → {pricePerKwh, availableKwh, active}
- trades: mapping(uint256 => Trade)       // tradeId → {seller, buyer, kwh, amount, status}
- tradeCounter: uint256

Functions:
- registerProducer(pricePerKwh, availableKwh)  // seller daftar + set harga
- updateListing(pricePerKwh, availableKwh)     // update listing
- buyEnergy(seller, kwh) payable               // buyer beli, MON masuk escrow
- confirmDelivery(tradeId)                     // seller confirm, MON released
- cancelTrade(tradeId)                         // refund jika tidak jadi
- getListings()                                // ambil semua listing aktif

Events:
- ProducerRegistered(seller, pricePerKwh, availableKwh)
- TradeCreated(tradeId, seller, buyer, kwh, amount)
- TradeCompleted(tradeId, seller, buyer)
- TradeCancelled(tradeId)
```

### 2. `EnergyReceipt.sol` — ERC-721 NFT bukti transaksi
```
- Mint otomatis saat trade completed
- tokenURI berisi: seller, buyer, kwh, timestamp, tradeId
- On-chain SVG — no IPFS needed
```

---

## Backend (Dian)

**Stack:** Express + TypeScript + ethers.js

**Endpoints:**
```
POST /simulate-meter
  body: { seller, buyer, kwh }
  → simulasi IoT meter data
  → call confirmDelivery() on-chain
  → return tx hash

GET /listings
  → fetch semua active listings dari contract
  → return formatted list

GET /trades/:address
  → fetch trade history untuk address
```

**Note:** Untuk hackathon, meter data di-simulasi manual via endpoint. Tidak perlu IoT device fisik.

---

## Frontend (Dattach)

**Stack:** Next.js + Wagmi v2 + RainbowKit + TailwindCSS

### Pages:

#### `/` — Landing
- Hero: "Jual Beli Listrik Langsung, Tanpa PLN"
- Stats: total trades, total kWh traded, active sellers
- Live feed transaksi terbaru

#### `/marketplace`
- List semua seller aktif: nama wallet, harga/kWh, stok kWh tersedia
- Tombol "Buy" → trigger buyEnergy()
- Filter by harga

#### `/seller`
- Form register sebagai producer: set harga/kWh, stok kWh
- Dashboard: pending trades, total earned
- Tombol "Confirm Delivery" per trade

#### `/dashboard`
- History semua trade user (sebagai buyer/seller)
- NFT receipts yang dimiliki
- Total spent / total earned

---

## Team Split

| Person | Role | Deliverable |
|--------|------|-------------|
| Muti | Smart Contract | EnergyMarket.sol + EnergyReceipt.sol + deploy script |
| Dian | Backend | Express API + simulate-meter endpoint + ethers.js integration |
| Dattach | Frontend | 4 pages + wagmi hooks + wallet connect |

---

## 6-Hour Battle Plan

### Jam 1 (Setup)
- [ ] Muti: init contract, deploy ke Monad testnet, share ABI + address
- [ ] Dian: setup Express, connect ke contract, test confirmDelivery()
- [ ] Dattach: setup Next.js, RainbowKit, Monad chain config, routing

### Jam 2-3 (Core Build)
- [ ] Muti: selesaikan EnergyMarket.sol + EnergyReceipt.sol, tulis test
- [ ] Dian: implement semua endpoints, test dengan curl
- [ ] Dattach: marketplace page + buyEnergy() hook

### Jam 4 (Integration)
- [ ] Dattach connect ke backend + contract
- [ ] Dian test full flow: buy → simulate-meter → confirmDelivery
- [ ] Muti bantu debug contract kalau ada issue

### Jam 5 (Polish)
- [ ] Landing page + live feed
- [ ] Seller dashboard
- [ ] End-to-end flow test semua

### Jam 6 (Demo Prep)
- [ ] Dry run demo 2x
- [ ] Pastikan ada data di-chain sebelum demo
- [ ] Siapkan talking points

---

## Demo Script (2 Menit)

**Setup sebelum demo:**
- Register 2 seller dengan harga berbeda (sudah ada listing)
- Ada beberapa completed trades di history
- Landing page terbuka di layar besar

**Beat-by-beat:**

`[0:00]` Layar besar tampil marketplace — ada 2-3 seller dengan harga listrik berbeda. "Ini WattChain — marketplace jual beli listrik antar warga, langsung, tanpa PLN."

`[0:15]` "Di Gili Ketapang, rumah yang punya solar panel produksi surplus listrik tiap hari — tapi tidak bisa jual ke tetangga. Mereka harus jual balik ke PLN dengan harga dipotong habis."

`[0:30]` Connect wallet sebagai buyer. Pilih seller termurah. Klik "Buy 5 kWh". MetaMask popup — confirm. Tx landing dalam 1 detik.

`[0:45]` "Trade terbuat — MON-nya sekarang di escrow smart contract. Bukan di tangan PLN, bukan di tangan admin. Di blockchain."

`[1:00]` Switch ke seller view. Klik "Confirm Delivery". Tx 1 detik — MON langsung masuk ke wallet seller. NFT receipt ter-mint ke buyer.

`[1:15]` Buka /dashboard — tampil NFT receipt on-chain. "Ini bukti transaksi energi yang tidak bisa dipalsukan, tidak bisa dihapus."

`[1:30]` "Di Ethereum ini butuh 20 detik dan $5 gas per transaksi — kalau meter data masuk tiap menit, tidak feasible. Di Monad: 1 detik, near-zero gas. Ini yang bikin P2P energy trading possible."

`[1:50]` "WattChain. Energi rakyat, untuk rakyat." — selesai.

---

## Repo Structure

```
monad-blitz/
├── smartcontract/
│   ├── src/
│   │   ├── EnergyMarket.sol
│   │   └── EnergyReceipt.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── test/
│   │   └── EnergyMarket.t.sol
│   └── foundry.toml
├── backend/
│   ├── index.ts
│   ├── routes/
│   │   └── energy.ts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # landing
│   │   ├── marketplace/page.tsx  # buy energy
│   │   ├── seller/page.tsx       # manage listings
│   │   └── dashboard/page.tsx    # history + receipts
│   ├── hooks/
│   │   ├── useEnergyMarket.ts
│   │   └── useLiveFeed.ts
│   ├── components/
│   │   ├── ListingCard.tsx
│   │   ├── TradeHistory.tsx
│   │   └── LiveFeed.tsx
│   └── lib/
│       ├── monad.ts              # chain config
│       └── abi.ts                # contract ABIs
└── docs/
    └── PLANNING.md
```

---

## Monad Config

```ts
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: { default: { http: ['https://testnet-rpc.monad.xyz'] } },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
});
```

---

## Why This Wins

- **Problem nyata** — PLN monopoli, warga Gili Ketapang tidak punya pilihan
- **Demo compelling** — ada duit beneran (MON) yang pindah tangan live
- **DeFi mechanic** — escrow, marketplace, NFT receipt
- **Monad angle jelas** — frequent meter data = butuh throughput tinggi + gas murah
- **Relatable** — semua orang bayar listrik, semua orang ngerti monopoli PLN
