import { clamp } from "./math.ts";
import type { LearningState } from "./types.ts";

export interface LearningObservation {
  predictedStressBps: number;
  realizedStressBps: number;
}

export function learnFromOutcome(
  state: LearningState,
  observation: LearningObservation,
): LearningState {
  const signedError = observation.realizedStressBps - observation.predictedStressBps;
  const calibrationErrorBps = Math.round(
    state.calibrationErrorBps * 0.8 + signedError * 0.2,
  );
  const observations = state.observations + 1;
  const patch = Math.floor(observations / 5);

  return {
    modelVersion: `psa-intelligence/0.1.${patch}`,
    observations,
    calibrationErrorBps: clamp(calibrationErrorBps, -2500, 2500),
    explorationBudgetBps: Math.max(150, state.explorationBudgetBps - 25),
  };
}
