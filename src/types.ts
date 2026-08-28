export type AssetClass =
  | "reserve"
  | "liquid-crypto"
  | "yield-crypto"
  | "tokenized-rwa";

export type RiskRegime = "CALM" | "WATCH" | "DEFENSIVE" | "HALTED";

export interface AssetSnapshot {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  expectedYieldBps: number;
  volatilityBps: number;
  liquidityScore: number;
  riskScore: number;
  dataQuality: number;
  capacityUsd: number;
}

export interface TreasuryState {
  navUsd: number;
  unallocatedRevenueUsd: number;
  drawdownBps: number;
  currentWeights: Record<string, number>;
}

export interface TreasuryPolicy {
  reserveAsset: string;
  reserveFloorBps: number;
  maxRwaBps: number;
  maxCryptoBps: number;
  maxAssetBps: number;
  maxTurnoverBps: number;
  minConfidenceBps: number;
  circuitBreakerBps: number;
}

export interface ProjectIdentity {
  name: string;
  symbol: string;
  network: string;
  mandate: string;
}

export interface ProjectConfig {
  identity: ProjectIdentity;
  policy: TreasuryPolicy;
}

export interface LearningState {
  modelVersion: string;
  observations: number;
  calibrationErrorBps: number;
  explorationBudgetBps: number;
}

export interface RiskAssessment {
  regime: RiskRegime;
  marketStressBps: number;
  confidenceBps: number;
  reasons: string[];
}

export interface AllocationProposal {
  targetWeights: Record<string, number>;
  turnoverBps: number;
  reserveWeightBps: number;
  rwaWeightBps: number;
  cryptoWeightBps: number;
}

export interface GuardrailReport {
  passed: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    observed: number;
    limit: number;
  }>;
}

export interface TreasuryDecision {
  id: string;
  timestamp: string;
  mode: "DRY_RUN";
  modelVersion: string;
  risk: RiskAssessment;
  allocation: AllocationProposal;
  guardrails: GuardrailReport;
  rationale: string[];
}
