#!/usr/bin/env -S node --experimental-strip-types

import { loadConfig } from "./config.ts";
import { createDecision } from "./decision-engine.ts";
import { INITIAL_LEARNING_STATE, INITIAL_TREASURY, SAMPLE_MARKET } from "./fixtures.ts";
import { runSimulation } from "./simulator.ts";
import type { ProjectConfig, TreasuryDecision } from "./types.ts";

const HELP = `
PON Sovereign Agent · $PSA

USAGE
  npm run psa -- <command> [options]

COMMANDS
  status                     Show identity, mode, and treasury snapshot
  thesis                     Print the protocol thesis
  policy [--json]            Inspect configured allocation boundaries
  rebalance [--json]         Produce one policy-checked dry-run decision
  simulate [options]         Run the deterministic learning loop
  help                       Show this command reference

SIMULATION OPTIONS
  --cycles <n>               Number of decision cycles (default: 12, max: 100)
  --seed <n>                 Deterministic scenario seed (default: 42)
  --json                     Emit machine-readable output

SAFETY
  Execution is intentionally unavailable in this research release.
  Passing --execute fails closed until an audited execution adapter exists.
`;

function flagValue(args: string[], name: string, fallback: number): number {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const parsed = Number(args[index + 1]);
  if (!Number.isFinite(parsed)) throw new Error(`${name} requires a number.`);
  return parsed;
}

function percent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

function dollars(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function printHeader(config: ProjectConfig): void {
  console.log("┌──────────────────────────────────────────────────────────┐");
  console.log(`│  ${config.identity.name.padEnd(38)} ${config.identity.symbol.padStart(16)}  │`);
  console.log("│  AUTONOMOUS INTELLIGENCE × SOVEREIGN TREASURY            │");
  console.log("└──────────────────────────────────────────────────────────┘");
}

function printWeights(decision: TreasuryDecision): void {
  console.log("\nTARGET ALLOCATION");
  const entries = Object.entries(decision.allocation.targetWeights).sort(
    ([a], [b]) => a.localeCompare(b),
  );
  for (const [symbol, weight] of entries) {
    const bars = "█".repeat(Math.round(weight / 400)).padEnd(25, "░");
    console.log(`  ${symbol.padEnd(6)} ${bars} ${percent(weight).padStart(7)}`);
  }
}

function printDecision(decision: TreasuryDecision): void {
  console.log(`\nDECISION   ${decision.id}`);
  console.log(`MODE       ${decision.mode}`);
  console.log(`REGIME     ${decision.risk.regime}`);
  console.log(`CONFIDENCE ${percent(decision.risk.confidenceBps)}`);
  console.log(`TURNOVER   ${percent(decision.allocation.turnoverBps)}`);
  console.log(`GUARDRAILS ${decision.guardrails.passed ? "PASS" : "QUARANTINED"}`);
  printWeights(decision);
  console.log("\nRATIONALE");
  for (const line of decision.rationale) console.log(`  · ${line}`);
}

function printStatus(config: ProjectConfig): void {
  printHeader(config);
  console.log(`\nNETWORK      ${config.identity.network}`);
  console.log("EXECUTION    LOCKED / DRY-RUN ONLY");
  console.log(`MODEL        ${INITIAL_LEARNING_STATE.modelVersion}`);
  console.log(`TREASURY     ${dollars(INITIAL_TREASURY.navUsd)}`);
  console.log(`NEW REVENUE  ${dollars(INITIAL_TREASURY.unallocatedRevenueUsd)}`);
  console.log(`\nMANDATE\n  ${config.identity.mandate}`);
}

function printPolicy(config: ProjectConfig): void {
  const p = config.policy;
  console.log("POLICY BOUNDARIES");
  console.log(`  Reserve asset          ${p.reserveAsset}`);
  console.log(`  Minimum reserve        ${percent(p.reserveFloorBps)}`);
  console.log(`  Maximum RWA exposure   ${percent(p.maxRwaBps)}`);
  console.log(`  Maximum crypto         ${percent(p.maxCryptoBps)}`);
  console.log(`  Maximum single asset   ${percent(p.maxAssetBps)}`);
  console.log(`  Maximum turnover       ${percent(p.maxTurnoverBps)}`);
  console.log(`  Minimum confidence     ${percent(p.minConfidenceBps)}`);
  console.log(`  Drawdown breaker       ${percent(p.circuitBreakerBps)}`);
}

function printThesis(): void {
  console.log(`
PON Sovereign Agent is an autonomous AI treasury that continuously evolves
its intelligence and allocates protocol-generated revenue across crypto and
tokenized real-world assets.

The agent does not own the protocol. It serves a narrow, measurable mandate:
turn revenue into durable protocol-owned capital while remaining subordinate
to transparent policy, deterministic guardrails, and a verifiable audit trail.

Intelligence may evolve. The constitutional boundary does not.
`);
}

function printSimulation(config: ProjectConfig, args: string[]): void {
  const cycles = Math.trunc(flagValue(args, "--cycles", 12));
  const seed = Math.trunc(flagValue(args, "--seed", 42));
  if (cycles < 1 || cycles > 100) throw new Error("--cycles must be between 1 and 100.");

  const frames = runSimulation({
    cycles,
    seed,
    assets: SAMPLE_MARKET,
    treasury: INITIAL_TREASURY,
    policy: config.policy,
    learning: INITIAL_LEARNING_STATE,
  });
  if (args.includes("--json")) {
    console.log(JSON.stringify(frames, null, 2));
    return;
  }

  printHeader(config);
  console.log(`\nSCENARIO seed=${seed} cycles=${cycles} mode=DRY_RUN\n`);
  console.log("CYCLE  REGIME      CONF.    REVENUE     RESERVE      RWA   CRYPTO  MODEL");
  for (const frame of frames) {
    const { allocation, risk } = frame.decision;
    console.log(
      `${String(frame.cycle).padStart(5)}  ` +
        `${risk.regime.padEnd(9)}  ` +
        `${percent(risk.confidenceBps).padStart(7)}  ` +
        `${dollars(frame.revenueAddedUsd).padStart(9)}  ` +
        `${percent(allocation.reserveWeightBps).padStart(10)}  ` +
        `${percent(allocation.rwaWeightBps).padStart(7)}  ` +
        `${percent(allocation.cryptoWeightBps).padStart(7)}  ` +
        frame.learning.modelVersion,
    );
  }
  const last = frames.at(-1)!;
  console.log(`\nfinal decision  ${last.decision.id}`);
  console.log(`observations    ${last.learning.observations}`);
  console.log(`calibration     ${last.learning.calibrationErrorBps} bps`);
  console.log(`guardrails      ${last.decision.guardrails.passed ? "PASS" : "QUARANTINED"}`);
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0] ?? "status";
  if (args.includes("--execute")) {
    throw new Error("Execution is locked: install and audit an execution adapter first.");
  }
  const config = loadConfig();

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(HELP.trim());
    return;
  }
  if (command === "status") return printStatus(config);
  if (command === "thesis") return printThesis();
  if (command === "policy") {
    if (args.includes("--json")) console.log(JSON.stringify(config.policy, null, 2));
    else printPolicy(config);
    return;
  }
  if (command === "rebalance") {
    const decision = createDecision({
      assets: SAMPLE_MARKET,
      treasury: INITIAL_TREASURY,
      policy: config.policy,
      learning: INITIAL_LEARNING_STATE,
    });
    if (args.includes("--json")) console.log(JSON.stringify(decision, null, 2));
    else {
      printHeader(config);
      printDecision(decision);
    }
    return;
  }
  if (command === "simulate") return printSimulation(config, args);

  throw new Error(`Unknown command: ${command}. Run \"npm run psa -- help\".`);
}

try {
  main();
} catch (error) {
  console.error(`psa: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
