import { clamp, sum } from "./math.ts";
import type {
  AssetSnapshot,
  LearningState,
  RiskAssessment,
  RiskRegime,
  TreasuryPolicy,
  TreasuryState,
} from "./types.ts";

function resolveRegime(stressBps: number): RiskRegime {
  if (stressBps >= 7200) return "HALTED";
  if (stressBps >= 5400) return "DEFENSIVE";
  if (stressBps >= 3600) return "WATCH";
  return "CALM";
}

export function assessRisk(
  assets: AssetSnapshot[],
  treasury: TreasuryState,
  policy: TreasuryPolicy,
  learning: LearningState,
): RiskAssessment {
  const investableAssets = assets.filter(({ assetClass }) => assetClass !== "reserve");
  const assetCount = Math.max(1, investableAssets.length);
  const averageRisk = sum(investableAssets.map(({ riskScore }) => riskScore)) / assetCount;
  const averageVolatility =
    sum(investableAssets.map(({ volatilityBps }) => volatilityBps)) / assetCount;
  const averageLiquidity =
    sum(investableAssets.map(({ liquidityScore }) => liquidityScore)) / assetCount;
  const averageDataQuality =
    sum(investableAssets.map(({ dataQuality }) => dataQuality)) / assetCount;

  const stressBps = clamp(
    Math.round(averageRisk * 55 + averageVolatility * 0.24 + (100 - averageLiquidity) * 18),
    0,
    10_000,
  );
  const confidenceBps = clamp(
    Math.round(9700 - (100 - averageDataQuality) * 35 - Math.abs(learning.calibrationErrorBps)),
    0,
    10_000,
  );

  let regime = resolveRegime(stressBps);
  const reasons = [
    `Composite market stress is ${stressBps} bps.`,
    `Signal confidence is ${confidenceBps} bps after calibration.`,
  ];

  if (treasury.drawdownBps >= policy.circuitBreakerBps) {
    regime = "HALTED";
    reasons.push(
      `Treasury drawdown ${treasury.drawdownBps} bps reached the ${policy.circuitBreakerBps} bps circuit breaker.`,
    );
  }

  if (confidenceBps < policy.minConfidenceBps) {
    regime = "HALTED";
    reasons.push(
      `Confidence fell below the ${policy.minConfidenceBps} bps execution threshold.`,
    );
  }

  if (regime === "CALM") reasons.push("Normal risk budget is available within policy caps.");
  if (regime === "WATCH") reasons.push("Incremental exposure is discounted and reserves are raised.");
  if (regime === "DEFENSIVE") reasons.push("Capital preservation dominates expected yield.");
  if (regime === "HALTED") reasons.push("Risk-taking is halted; the reserve asset is the safe target.");

  return { regime, marketStressBps: stressBps, confidenceBps, reasons };
}
