import assert from "node:assert/strict";
import test from "node:test";
import { proposeAllocation } from "../src/allocator.ts";
import { loadConfig } from "../src/config.ts";
import { createDecision } from "../src/decision-engine.ts";
import { INITIAL_LEARNING_STATE, INITIAL_TREASURY, SAMPLE_MARKET } from "../src/fixtures.ts";
import { calculateTurnoverBps, sumWeights } from "../src/math.ts";
import { assessRisk } from "../src/risk-engine.ts";

const { policy } = loadConfig();

test("a normal decision satisfies every deterministic guardrail", () => {
  const decision = createDecision({
    assets: SAMPLE_MARKET,
    treasury: INITIAL_TREASURY,
    policy,
    learning: INITIAL_LEARNING_STATE,
    now: new Date("2026-01-01T00:00:00.000Z"),
  });

  assert.equal(sumWeights(decision.allocation.targetWeights), 10_000);
  assert.equal(decision.guardrails.passed, true);
  assert.ok(decision.allocation.reserveWeightBps >= policy.reserveFloorBps);
  assert.ok(decision.allocation.rwaWeightBps <= policy.maxRwaBps);
  assert.ok(decision.allocation.cryptoWeightBps <= policy.maxCryptoBps);
});

test("normal rebalances cannot exceed the turnover budget", () => {
  const risk = assessRisk(SAMPLE_MARKET, INITIAL_TREASURY, policy, INITIAL_LEARNING_STATE);
  const allocation = proposeAllocation(SAMPLE_MARKET, INITIAL_TREASURY, policy, risk);

  assert.ok(allocation.turnoverBps <= policy.maxTurnoverBps);
  assert.equal(
    allocation.turnoverBps,
    calculateTurnoverBps(INITIAL_TREASURY.currentWeights, allocation.targetWeights),
  );
});

test("the circuit breaker moves the target entirely to reserves", () => {
  const distressedTreasury = {
    ...INITIAL_TREASURY,
    drawdownBps: policy.circuitBreakerBps,
  };
  const decision = createDecision({
    assets: SAMPLE_MARKET,
    treasury: distressedTreasury,
    policy,
    learning: INITIAL_LEARNING_STATE,
    now: new Date("2026-01-01T00:00:00.000Z"),
  });

  assert.equal(decision.risk.regime, "HALTED");
  assert.deepEqual(decision.allocation.targetWeights, { USDC: 10_000 });
  assert.equal(decision.guardrails.passed, true);
});
