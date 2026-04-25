# ACE-Blitz — Anti Corruption Electricity

> Hackathon: Monad Blitz Jogja | Theme: Social / DeFi

---

## What is ACE-Blitz?

ACE-Blitz (Anti Corruption Electricity) is a peer-to-peer energy trading platform built on Monad. It enables households with solar panels to sell their surplus electricity directly to neighbors via smart contracts — no middleman, no monopoly, no hidden fees.

**One-liner:**
> "PLN monopolizes electricity prices with zero transparency — ACE-Blitz gives communities the power to trade energy directly, on-chain, fairly."

---

## The Problem

- State electricity monopolies (like PLN in Indonesia) control distribution in remote areas
- Households with solar panels cannot sell surplus energy to neighbors — they must sell back to the grid at heavily discounted rates
- Electricity bills are opaque and unverifiable
- Community microgrids already exist physically, but settlement is still manual and centralized

---

## The Solution

ACE-Blitz replaces the centralized intermediary with a smart contract escrow system:

```
SELLER (solar panel owner)              BUYER (needs electricity)
        │                                        │
        │  registerProducer()                    │  buyEnergy(seller, kWh)
        │  → set price per kWh                   │  → send MON token
        │  → listed on marketplace               │  → held in escrow
        │                                        │
        │              SMART CONTRACT            │
        │         ┌─────────────────────┐        │
        │         │  energy listings    │        │
        │         │  escrow payment     │        │
        │         │  confirm delivery   │        │
        │         │  release payment    │        │
        │         └─────────────────────┘        │
        │                                        │
        │  confirmDelivery()                     │
        │  → payment released to seller          │  Receive electricity ✓
        │  → NFT receipt minted to buyer         │  On-chain receipt ✓
```

---

## Why Monad?

Meter data can be recorded every minute per household. On Ethereum: slow + expensive gas = not feasible. On Monad: **< 2 seconds, near-zero gas** = P2P energy trading becomes possible at scale.

---

## Smart Contracts

| Contract | Description |
|----------|-------------|
| `EnergyMarket.sol` | Core marketplace: listings, escrow, buy/confirm/cancel |
| `EnergyReceipt.sol` | ERC-721 NFT proof of trade with on-chain SVG — no IPFS needed |

### Key Mechanics
- `buyEnergy()` — buyer sends MON, locked in contract escrow
- `confirmDelivery()` — seller confirms, MON released + NFT minted to buyer
- `cancelTrade()` — refunds buyer and restores seller stock
- `quoteEnergy()` — calculate exact MON cost before buying

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| Smart Contract | Solidity 0.8.24 + Foundry |
| Backend | Express + TypeScript + ethers.js |
| Frontend | Next.js + Wagmi v2 + RainbowKit + TailwindCSS |
| Network | Monad Testnet (Chain ID: 10143) |

---

## Project Structure

```
ace-blitz/
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
├── frontend/
└── docs/
    └── PLANNING.md
```

---

## Getting Started

### Run Tests
```bash
cd smartcontract
forge test -v
```

### Deploy to Monad Testnet
```bash
cd smartcontract
cp .env.example .env
# Fill in PRIVATE_KEY in .env

forge script script/Deploy.s.sol --rpc-url monad_testnet --broadcast
```

---

## Team

| Name | Role |
|------|------|
| Muti | Smart Contract |
| Dian | Backend |
| Dattach | Frontend |

---

Built for **Monad Blitz Jogja** hackathon.
