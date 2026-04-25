export const ENERGY_MARKET_ADDRESS = "0x7af0f45E445724dEfC8943F73461988eDeE86E1D" as const;
export const BACKEND_URL = "http://localhost:3001";

export const ENERGY_MARKET_ABI = [
  {
    type: "function", name: "buyEnergy",
    inputs: [{ name: "seller", type: "address" }, { name: "kwh", type: "uint256" }],
    outputs: [], stateMutability: "payable",
  },
  {
    type: "function", name: "registerProducer",
    inputs: [{ name: "pricePerKwh", type: "uint256" }, { name: "availableKwh", type: "uint256" }],
    outputs: [], stateMutability: "nonpayable",
  },
  {
    type: "function", name: "updateListing",
    inputs: [{ name: "pricePerKwh", type: "uint256" }, { name: "availableKwh", type: "uint256" }],
    outputs: [], stateMutability: "nonpayable",
  },
  {
    type: "function", name: "confirmDelivery",
    inputs: [{ name: "tradeId", type: "uint256" }],
    outputs: [], stateMutability: "nonpayable",
  },
  {
    type: "function", name: "cancelTrade",
    inputs: [{ name: "tradeId", type: "uint256" }],
    outputs: [], stateMutability: "nonpayable",
  },
  {
    type: "function", name: "getActiveListings",
    inputs: [],
    outputs: [{
      name: "", type: "tuple[]",
      components: [
        { name: "seller", type: "address" },
        { name: "pricePerKwh", type: "uint256" },
        { name: "availableKwh", type: "uint256" },
      ],
    }],
    stateMutability: "view",
  },
  {
    type: "function", name: "getTrade",
    inputs: [{ name: "tradeId", type: "uint256" }],
    outputs: [{
      name: "", type: "tuple",
      components: [
        { name: "seller", type: "address" },
        { name: "buyer", type: "address" },
        { name: "kwh", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "status", type: "uint8" },
        { name: "timestamp", type: "uint256" },
      ],
    }],
    stateMutability: "view",
  },
  {
    type: "function", name: "quoteEnergy",
    inputs: [{ name: "seller", type: "address" }, { name: "kwh", type: "uint256" }],
    outputs: [{ name: "amount", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "totalTrades",
    inputs: [], outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function", name: "listings",
    inputs: [{ name: "seller", type: "address" }],
    outputs: [
      { name: "pricePerKwh", type: "uint256" },
      { name: "availableKwh", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "event", name: "TradeCreated",
    inputs: [
      { name: "tradeId", type: "uint256", indexed: true },
      { name: "seller", type: "address", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "kwh", type: "uint256", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event", name: "TradeCompleted",
    inputs: [
      { name: "tradeId", type: "uint256", indexed: true },
      { name: "seller", type: "address", indexed: true },
      { name: "buyer", type: "address", indexed: true },
      { name: "nftTokenId", type: "uint256", indexed: false },
    ],
  },
] as const;
