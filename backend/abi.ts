// ABI akan diupdate setelah Muti deploy contract
// Ini based on PLANNING.md EnergyMarket.sol
///ace-blitz/aceblitz-backend/abi.ts
export const EnergyMarketABI = [
  // ── Write functions ─────────────────────────────────────────────
  {
    type: 'function',
    name: 'registerProducer',
    inputs: [
      { name: 'pricePerKwh', type: 'uint256' },
      { name: 'availableKwh', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'buyEnergy',
    inputs: [
      { name: 'seller', type: 'address' },
      { name: 'kwh', type: 'uint256' },
    ],
    outputs: [{ name: 'tradeId', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'confirmDelivery',
    inputs: [{ name: 'tradeId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'cancelTrade',
    inputs: [{ name: 'tradeId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },

  // ── Read functions ───────────────────────────────────────────────
  {
    type: 'function',
    name: 'getListings',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'seller', type: 'address' },
          { name: 'pricePerKwh', type: 'uint256' },
          { name: 'availableKwh', type: 'uint256' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'trades',
    inputs: [{ name: 'tradeId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'seller', type: 'address' },
          { name: 'buyer', type: 'address' },
          { name: 'kwh', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'uint8' }, // 0=pending, 1=completed, 2=cancelled
          { name: 'createdAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tradeCounter',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },

  // ── Events ───────────────────────────────────────────────────────
  {
    type: 'event',
    name: 'ProducerRegistered',
    inputs: [
      { name: 'seller', type: 'address', indexed: true },
      { name: 'pricePerKwh', type: 'uint256', indexed: false },
      { name: 'availableKwh', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TradeCreated',
    inputs: [
      { name: 'tradeId', type: 'uint256', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'kwh', type: 'uint256', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TradeCompleted',
    inputs: [
      { name: 'tradeId', type: 'uint256', indexed: true },
      { name: 'seller', type: 'address', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
    ],
  },
  {
    type: 'event',
    name: 'TradeCancelled',
    inputs: [
      { name: 'tradeId', type: 'uint256', indexed: true },
    ],
  },
] as const;