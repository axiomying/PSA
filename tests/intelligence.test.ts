import assert from "node:assert/strict";
import test from "node:test";
import { INITIAL_LEARNING_STATE } from "../src/fixtures.ts";
import { learnFromOutcome } from "../src/intelligence.ts";

test("the learner updates calibration and versions after verified outcomes", () => {
  let state = structuredClone(INITIAL_LEARNING_STATE);
  for (let index = 0; index < 5; index += 1) {
    state = learnFromOutcome(state, {
      predictedStressBps: 3000,
      realizedStressBps: 3500,
    });
  }

  assert.equal(state.observations, 5);
  assert.equal(state.modelVersion, "psa-intelligence/0.1.1");
  assert.ok(state.calibrationErrorBps > 0);
  assert.ok(state.explorationBudgetBps < INITIAL_LEARNING_STATE.explorationBudgetBps);
});
