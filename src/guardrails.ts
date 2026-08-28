import { sumWeights } from "./math.ts";
import type {
  AllocationProposal,
  AssetSnapshot,
  GuardrailReport,
  RiskAssessment,
  TreasuryPolicy,
} from "./types.ts";

export function validateProposal(
  allocation: AllocationProposal,
  assets: AssetSnapshot[],
  policy: TreasuryPolicy,
  risk: RiskAssessment,
): GuardrailReport {
  const nonReserveWeights = assets
    .filter(({ assetClass }) => assetClass !== "reserve")
    .map(({ symbol }) => allocation.targetWeights[symbol] ?? 0);
  const largestAssetWeight = Math.max(0, ...nonReserveWeights);
  const turnoverLimit = risk.regime === "HALTED" ? 10_000 : policy.maxTurnoverBps;

  const checks = [
    {
      name: "weights-sum",
      observed: sumWeights(allocation.targetWeights),
      limit: 10_000,
      passed: sumWeights(allocation.targetWeights) === 10_000,
    },
    {
      name: "reserve-floor",
      observed: allocation.reserveWeightBps,
      limit: policy.reserveFloorBps,
      passed: allocation.reserveWeightBps >= policy.reserveFloorBps,
    },
    {
      name: "single-asset-cap",
      observed: largestAssetWeight,
      limit: policy.maxAssetBps,
      passed: largestAssetWeight <= policy.maxAssetBps,
    },
    {
      name: "rwa-cap",
      observed: allocation.rwaWeightBps,
      limit: policy.maxRwaBps,
      passed: allocation.rwaWeightBps <= policy.maxRwaBps,
    },
    {
      name: "crypto-cap",
      observed: allocation.cryptoWeightBps,
      limit: policy.maxCryptoBps,
      passed: allocation.cryptoWeightBps <= policy.maxCryptoBps,
    },
    {
      name: risk.regime === "HALTED" ? "emergency-turnover" : "turnover-cap",
      observed: allocation.turnoverBps,
      limit: turnoverLimit,
      passed: allocation.turnoverBps <= turnoverLimit,
    },
  ];

  return { passed: checks.every(({ passed }) => passed), checks };
}
