import assert from "node:assert/strict";
import test from "node:test";
import { loadConfig } from "../src/config.ts";
import { INITIAL_LEARNING_STATE, INITIAL_TREASURY, SAMPLE_MARKET } from "../src/fixtures.ts";
import { runSimulation } from "../src/simulator.ts";

test("a seeded simulation is deterministic and remains policy-valid", () => {
  const input = {
    cycles: 8,
    seed: 42,
    assets: SAMPLE_MARKET,
    treasury: INITIAL_TREASURY,
    policy: loadConfig().policy,
    learning: INITIAL_LEARNING_STATE,
  };
  const first = runSimulation(input);
  const second = runSimulation(input);

  assert.deepEqual(first, second);
  assert.equal(first.length, 8);
  assert.ok(first.every(({ decision }) => decision.guardrails.passed));
  assert.equal(first.at(-1)?.learning.observations, 8);
});
