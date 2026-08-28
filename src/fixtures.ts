import type { AssetSnapshot, LearningState, TreasuryState } from "./types.ts";

export const SAMPLE_MARKET: AssetSnapshot[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    assetClass: "reserve",
    expectedYieldBps: 0,
    volatilityBps: 12,
    liquidityScore: 98,
    riskScore: 12,
    dataQuality: 98,
    capacityUsd: 100_000_000,
  },
  {
    symbol: "ETH",
    name: "Ether",
    assetClass: "liquid-crypto",
    expectedYieldBps: 0,
    volatilityBps: 6200,
    liquidityScore: 95,
    riskScore: 45,
    dataQuality: 97,
    capacityUsd: 50_000_000,
  },
  {
    symbol: "stETH",
    name: "Liquid Staked Ether",
    assetClass: "yield-crypto",
    expectedYieldBps: 360,
    volatilityBps: 4500,
    liquidityScore: 80,
    riskScore: 55,
    dataQuality: 92,
    capacityUsd: 20_000_000,
  },
  {
    symbol: "USTB",
    name: "Tokenized US Treasury Bills",
    assetClass: "tokenized-rwa",
    expectedYieldBps: 525,
    volatilityBps: 1200,
    liquidityScore: 90,
    riskScore: 35,
    dataQuality: 90,
    capacityUsd: 10_000_000,
  },
  {
    symbol: "XAUT",
    name: "Tokenized Gold",
    assetClass: "tokenized-rwa",
    expectedYieldBps: 0,
    volatilityBps: 2800,
    liquidityScore: 70,
    riskScore: 40,
    dataQuality: 88,
    capacityUsd: 5_000_000,
  },
];

export const INITIAL_TREASURY: TreasuryState = {
  navUsd: 1_000_000,
  unallocatedRevenueUsd: 35_000,
  drawdownBps: 80,
  currentWeights: {
    USDC: 3000,
    ETH: 1500,
    stETH: 1500,
    USTB: 3000,
    XAUT: 1000,
  },
};

export const INITIAL_LEARNING_STATE: LearningState = {
  modelVersion: "psa-intelligence/0.1.0",
  observations: 0,
  calibrationErrorBps: 0,
  explorationBudgetBps: 750,
};
