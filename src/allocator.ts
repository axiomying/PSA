import { calculateTurnoverBps, capTurnover, clamp, sum } from "./math.ts";
import type {
  AllocationProposal,
  AssetClass,
  AssetSnapshot,
  RiskAssessment,
  TreasuryPolicy,
  TreasuryState,
} from "./types.ts";

interface Candidate {
  asset: AssetSnapshot;
  utility: number;
  ceilingBps: number;
}

const RISK_BUFFER_BPS = {
  CALM: 0,
  WATCH: 1000,
  DEFENSIVE: 2500,
  HALTED: 8000,
} as const;

function classLimit(assetClass: AssetClass, policy: TreasuryPolicy): number {
  if (assetClass === "tokenized-rwa") return policy.maxRwaBps;
  if (assetClass === "liquid-crypto" || assetClass === "yield-crypto") {
    return policy.maxCryptoBps;
  }
  return 10_000;
}

function classKey(assetClass: AssetClass): "reserve" | "rwa" | "crypto" {
  if (assetClass === "tokenized-rwa") return "rwa";
  if (assetClass === "reserve") return "reserve";
  return "crypto";
}

function riskMultiplier(assetClass: AssetClass, risk: RiskAssessment): number {
  if (risk.regime === "CALM") return 1;
  if (risk.regime === "WATCH") return assetClass === "tokenized-rwa" ? 0.82 : 0.62;
  if (risk.regime === "DEFENSIVE") return assetClass === "tokenized-rwa" ? 0.55 : 0.24;
  return 0;
}

function utility(asset: AssetSnapshot, risk: RiskAssessment): number {
  const raw =
    asset.expectedYieldBps +
    asset.liquidityScore * 6 +
    asset.dataQuality * 3 -
    asset.riskScore * 6 -
    asset.volatilityBps * 0.025;
  return Math.max(1, raw * riskMultiplier(asset.assetClass, risk));
}

function portfolioClassWeight(
  weights: Record<string, number>,
  assets: AssetSnapshot[],
  expectedClass: "rwa" | "crypto",
): number {
  return sum(
    assets
      .filter(({ assetClass }) => classKey(assetClass) === expectedClass)
      .map(({ symbol }) => weights[symbol] ?? 0),
  );
}

function rawAllocation(
  assets: AssetSnapshot[],
  treasury: TreasuryState,
  policy: TreasuryPolicy,
  risk: RiskAssessment,
): Record<string, number> {
  if (risk.regime === "HALTED") return { [policy.reserveAsset]: 10_000 };

  const reserveTarget = clamp(
    policy.reserveFloorBps + RISK_BUFFER_BPS[risk.regime],
    policy.reserveFloorBps,
    7000,
  );
  const weights: Record<string, number> = Object.fromEntries(
    assets.map(({ symbol }) => [symbol, 0]),
  );
  const candidates: Candidate[] = assets
    .filter(({ assetClass }) => assetClass !== "reserve")
    .map((asset) => ({
      asset,
      utility: utility(asset, risk),
      ceilingBps: Math.min(
        policy.maxAssetBps,
        Math.floor((asset.capacityUsd / treasury.navUsd) * 10_000),
      ),
    }));

  let remaining = 10_000 - reserveTarget;
  let passes = 0;
  while (remaining > 0 && passes < 100) {
    passes += 1;
    const active = candidates.filter(({ asset, ceilingBps }) => {
      const ownRoom = ceilingBps - (weights[asset.symbol] ?? 0);
      const bucket = classKey(asset.assetClass);
      const used = bucket === "rwa"
        ? portfolioClassWeight(weights, assets, "rwa")
        : portfolioClassWeight(weights, assets, "crypto");
      return ownRoom > 0 && classLimit(asset.assetClass, policy) - used > 0;
    });
    if (active.length === 0) break;

    const totalUtility = sum(active.map(({ utility }) => utility));
    let moved = 0;
    for (const candidate of active) {
      const { asset, ceilingBps } = candidate;
      const bucket = classKey(asset.assetClass);
      const classUsed = bucket === "rwa"
        ? portfolioClassWeight(weights, assets, "rwa")
        : portfolioClassWeight(weights, assets, "crypto");
      const ownRoom = ceilingBps - (weights[asset.symbol] ?? 0);
      const bucketRoom = classLimit(asset.assetClass, policy) - classUsed;
      const proportional = Math.max(1, Math.floor((remaining * candidate.utility) / totalUtility));
      const amount = Math.min(remaining, ownRoom, bucketRoom, proportional);
      if (amount <= 0) continue;
      weights[asset.symbol] = (weights[asset.symbol] ?? 0) + amount;
      remaining -= amount;
      moved += amount;
    }
    if (moved === 0) break;
  }

  weights[policy.reserveAsset] = 10_000 - sum(
    Object.entries(weights)
      .filter(([symbol]) => symbol !== policy.reserveAsset)
      .map(([, weight]) => weight),
  );
  return weights;
}

export function proposeAllocation(
  assets: AssetSnapshot[],
  treasury: TreasuryState,
  policy: TreasuryPolicy,
  risk: RiskAssessment,
): AllocationProposal {
  const desired = rawAllocation(assets, treasury, policy, risk);
  const targetWeights = risk.regime === "HALTED"
    ? desired
    : capTurnover(treasury.currentWeights, desired, policy.maxTurnoverBps);

  return {
    targetWeights,
    turnoverBps: calculateTurnoverBps(treasury.currentWeights, targetWeights),
    reserveWeightBps: targetWeights[policy.reserveAsset] ?? 0,
    rwaWeightBps: portfolioClassWeight(targetWeights, assets, "rwa"),
    cryptoWeightBps: portfolioClassWeight(targetWeights, assets, "crypto"),
  };
}
