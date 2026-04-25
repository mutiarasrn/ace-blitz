//ace-blitz/aceblitz-backend/abi.ts
// ABI generated from EnergyMarket.sol + EnergyReceipt.sol by Muti

export const EnergyMarketABI = [
  // ── Write functions ──────────────────────────────────────────────
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
    name: 'updateListing',
    inputs: [
      { name: 'pricePerKwh', type: 'uint256' },
      { name: 'availableKwh', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deactivateListing',
    inputs: [],
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
    outputs: [],
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
    name: 'getActiveListings',  // bukan getListings()!
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'seller', type: 'address' },
          { name: 'pricePerKwh', type: 'uint256' },
          { name: 'availableKwh', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTrade',
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
          { name: 'status', type: 'uint8' }, // 0=Pending 1=Completed 2=Cancelled
          { name: 'timestamp', type: 'uint256' }, // bukan createdAt!
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalTrades', // ini function, bukan public var
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'quoteEnergy',
    inputs: [
      { name: 'seller', type: 'address' },
      { name: 'kwh', type: 'uint256' },
    ],
    outputs: [{ name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'listings',
    inputs: [{ name: 'seller', type: 'address' }],
    outputs: [
      { name: 'pricePerKwh', type: 'uint256' },
      { name: 'availableKwh', type: 'uint256' },
      { name: 'active', type: 'bool' },
    ],
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
      { name: 'nftTokenId', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'TradeCancelled',
    inputs: [
      { name: 'tradeId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'refund', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const EnergyReceiptABI = [
  {
    type: 'function',
    name: 'getReceipt',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'seller', type: 'address' },
          { name: 'buyer', type: 'address' },
          { name: 'kwh', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'tradeId', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'tokenURI',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ReceiptMinted',
    inputs: [
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'tradeId', type: 'uint256', indexed: true },
    ],
  },
] as const;