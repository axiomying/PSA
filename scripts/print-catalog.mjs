#!/usr/bin/env node

import { readFileSync } from "node:fs";

function read(path) {
  return JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
}

const adapters = read("adapters/registry.json");
const integrations = read("integrations/capability-matrix.json");
const deployment = read("deployments/simulation.json");

console.log("PON Sovereign Agent · capability catalog\n");
console.log(`execution        ${adapters.executionEnabled ? "enabled" : "locked"}`);
console.log(`deployment       ${deployment.status}`);
console.log(`adapters         ${adapters.adapters.length}`);
for (const adapter of adapters.adapters) {
  console.log(`  ${adapter.id.padEnd(28)} ${adapter.status}`);
}
console.log(`integrations     ${integrations.capabilities.length}`);
for (const capability of integrations.capabilities) {
  console.log(`  ${capability.id.padEnd(28)} ${capability.status}`);
}
