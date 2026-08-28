import { readFileSync } from "node:fs";
import type { ProjectConfig, TreasuryPolicy } from "./types.ts";

const REQUIRED_POLICY_KEYS: Array<keyof TreasuryPolicy> = [
  "reserveAsset",
  "reserveFloorBps",
  "maxRwaBps",
  "maxCryptoBps",
  "maxAssetBps",
  "maxTurnoverBps",
  "minConfidenceBps",
  "circuitBreakerBps",
];

export function loadConfig(path = process.env.PSA_CONFIG ?? "./psa.config.json"): ProjectConfig {
  const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<ProjectConfig>;

  if (!parsed.identity?.name || !parsed.identity.symbol || !parsed.policy) {
    throw new Error(`Invalid PSA config at ${path}: identity and policy are required.`);
  }

  for (const key of REQUIRED_POLICY_KEYS) {
    if (parsed.policy[key] === undefined || parsed.policy[key] === null) {
      throw new Error(`Invalid PSA config at ${path}: policy.${key} is required.`);
    }
  }

  const numericPolicyValues = Object.entries(parsed.policy).filter(
    ([key]) => key !== "reserveAsset",
  );
  for (const [key, value] of numericPolicyValues) {
    if (typeof value !== "number" || value < 0 || value > 10_000) {
      throw new Error(`Invalid PSA config at ${path}: policy.${key} must be 0..10000.`);
    }
  }

  return parsed as ProjectConfig;
}
