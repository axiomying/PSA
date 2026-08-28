import { createHash } from "node:crypto";
import { proposeAllocation } from "./allocator.ts";
import { validateProposal } from "./guardrails.ts";
import { assessRisk } from "./risk-engine.ts";
import type {
  AssetSnapshot,
  LearningState,
  TreasuryDecision,
  TreasuryPolicy,
  TreasuryState,
} from "./types.ts";

export interface DecisionInput {
  assets: AssetSnapshot[];
  treasury: TreasuryState;
  policy: TreasuryPolicy;
  learning: LearningState;
  now?: Date;
}

export function createDecision(input: DecisionInput): TreasuryDecision {
  const timestamp = (input.now ?? new Date()).toISOString();
  const risk = assessRisk(input.assets, input.treasury, input.policy, input.learning);
  const allocation = proposeAllocation(input.assets, input.treasury, input.policy, risk);
  const guardrails = validateProposal(allocation, input.assets, input.policy, risk);
  const rationale = [
    ...risk.reasons,
    `Reserve target is ${(allocation.reserveWeightBps / 100).toFixed(2)}%.`,
    `Proposed one-way turnover is ${(allocation.turnoverBps / 100).toFixed(2)}%.`,
    guardrails.passed
      ? "Every deterministic policy check passed."
      : "Proposal is quarantined because at least one deterministic policy check failed.",
  ];
  const id = createHash("sha256")
    .update(JSON.stringify({ timestamp, risk, allocation, model: input.learning.modelVersion }))
    .digest("hex")
    .slice(0, 16);

  return {
    id: `psa_${id}`,
    timestamp,
    mode: "DRY_RUN",
    modelVersion: input.learning.modelVersion,
    risk,
    allocation,
    guardrails,
    rationale,
  };
}
