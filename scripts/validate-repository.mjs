#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const requiredDirectories = [
  "adapters",
  "assets",
  "benchmarks",
  "config",
  "contracts",
  "deployments",
  "docs",
  "examples",
  "governance",
  "integrations",
  "operations",
  "schemas",
  "scenarios",
  "scripts",
  "src",
  "tests"
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.name === ".git" || entry.name === "node_modules") return [];
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const missing = requiredDirectories.filter((directory) => !existsSync(join(root, directory)));
if (missing.length > 0) throw new Error(`Missing required directories: ${missing.join(", ")}`);

const jsonFiles = walk(root).filter((path) => extname(path) === ".json");
for (const path of jsonFiles) JSON.parse(readFileSync(path, "utf8"));

const markdownFiles = walk(root).filter((path) => extname(path) === ".md");
const missingLinks = [];
for (const path of markdownFiles) {
  const markdown = readFileSync(path, "utf8");
  for (const match of markdown.matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split("#", 1)[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    if (!existsSync(resolve(dirname(path), target))) {
      missingLinks.push(`${path}: ${target}`);
    }
  }
}
if (missingLinks.length > 0) {
  throw new Error(`Broken local Markdown links:\n${missingLinks.join("\n")}`);
}

const config = JSON.parse(readFileSync(join(root, "psa.config.json"), "utf8"));
if (config.policy.reserveFloorBps <= 0) throw new Error("Reserve floor must be positive.");
if (config.policy.maxRwaBps + config.policy.maxCryptoBps > 10_000) {
  throw new Error("Combined RWA and crypto class caps cannot exceed 100%.");
}

const example = JSON.parse(
  readFileSync(join(root, "examples/decision-envelope.json"), "utf8"),
);
const weightTotal = Object.values(example.allocation.targetWeights).reduce(
  (total, weight) => total + weight,
  0,
);
if (weightTotal !== 10_000) throw new Error(`Example weights total ${weightTotal}, expected 10000.`);

for (const directory of requiredDirectories) {
  const files = walk(join(root, directory));
  if (files.length === 0) throw new Error(`Required directory is empty: ${directory}`);
}

console.log(
  `repository: ok (${requiredDirectories.length} directories, ${jsonFiles.length} JSON files, ${markdownFiles.length} Markdown files)`,
);
