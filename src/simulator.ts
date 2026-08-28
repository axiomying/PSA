import { createDecision } from "./decision-engine.ts";
import { learnFromOutcome } from "./intelligence.ts";
import { clamp } from "./math.ts";
import type {
  AssetSnapshot,
  LearningState,
  TreasuryDecision,
  TreasuryPolicy,
  TreasuryState,
} from "./types.ts";

export interface SimulationFrame {
  cycle: number;
  revenueAddedUsd: number;
  treasury: TreasuryState;
  learning: LearningState;
  decision: TreasuryDecision;
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function evolveMarket(
  assets: AssetSnapshot[],
  random: () => number,
): { assets: AssetSnapshot[]; shockBps: number } {
  const tailEvent = random() < 0.1 ? 1800 + random() * 1500 : 0;
  const shockBps = Math.round((random() - 0.5) * 900 + tailEvent);

  return {
    shockBps,
    assets: assets.map((asset) => {
      if (asset.assetClass === "reserve") return { ...asset };
      const sensitivity = asset.assetClass === "tokenized-rwa" ? 0.45 : 1;
      return {
        ...asset,
        volatilityBps: clamp(
          Math.round(asset.volatilityBps * 0.88 + Math.abs(shockBps) * sensitivity),
          100,
          10_000,
        ),
        riskScore: clamp(
          Math.round(asset.riskScore * 0.9 + Math.max(0, shockBps) * sensitivity * 0.012),
          5,
          100,
        ),
        dataQuality: clamp(asset.dataQuality - (tailEvent > 0 ? 3 : 0), 50, 100),
      };
    }),
  };
}

export function runSimulation(input: {
  cycles: number;
  seed: number;
  assets: AssetSnapshot[];
  treasury: TreasuryState;
  policy: TreasuryPolicy;
  learning: LearningState;
}): SimulationFrame[] {
  const random = seededRandom(input.seed);
  const frames: SimulationFrame[] = [];
  let assets = structuredClone(input.assets);
  let treasury = structuredClone(input.treasury);
  let learning = structuredClone(input.learning);

  for (let cycle = 1; cycle <= input.cycles; cycle += 1) {
    const market = evolveMarket(assets, random);
    assets = market.assets;
    const revenueAddedUsd = Math.round(3200 + random() * 2100);
    treasury = {
      ...treasury,
      navUsd: treasury.navUsd + revenueAddedUsd,
      unallocatedRevenueUsd: treasury.unallocatedRevenueUsd + revenueAddedUsd,
      drawdownBps: clamp(
        Math.round(treasury.drawdownBps * 0.72 + Math.max(0, market.shockBps) * 0.2 - 35),
        0,
        3000,
      ),
    };

    const now = new Date(Date.UTC(2026, 0, 1, 0, cycle, 0));
    const decision = createDecision({ assets, treasury, policy: input.policy, learning, now });
    const realizedStressBps = clamp(
      decision.risk.marketStressBps + Math.round((random() - 0.5) * 900),
      0,
      10_000,
    );
    learning = learnFromOutcome(learning, {
      predictedStressBps: decision.risk.marketStressBps,
      realizedStressBps,
    });
    treasury = {
      ...treasury,
      currentWeights: decision.allocation.targetWeights,
      unallocatedRevenueUsd: 0,
    };
    frames.push({ cycle, revenueAddedUsd, treasury, learning, decision });
  }

  return frames;
}
