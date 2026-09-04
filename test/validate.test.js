"use strict";

// Structural validation for the template JSON. Not a substitute for the real "import into n8n and
// execute" verification done before each release (see README), but catches the class of mistakes CI
// can actually check: valid JSON, every connection points at a node that exists, no leftover
// credentials, required n8n fields present on every node.

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert");

const filePath = path.join(__dirname, "..", "engagement-monitor-template.json");
const raw = fs.readFileSync(filePath, "utf8");

let workflow;
try {
  workflow = JSON.parse(raw);
} catch (err) {
  console.error("FAIL: template is not valid JSON:", err.message);
  process.exit(1);
}

function check(condition, message) {
  if (!condition) {
    console.error("FAIL:", message);
    process.exit(1);
  }
  console.log("PASS:", message);
}

check(typeof workflow.name === "string" && workflow.name.length > 0, "workflow has a name");
check(Array.isArray(workflow.nodes) && workflow.nodes.length > 0, "workflow has at least one node");
check(typeof workflow.connections === "object", "workflow has a connections object");

const nodeNames = new Set(workflow.nodes.map((n) => n.name));

for (const node of workflow.nodes) {
  check(typeof node.id === "string" && node.id.length > 0, `node "${node.name}" has an id`);
  check(typeof node.type === "string" && node.type.startsWith("n8n-nodes-base."), `node "${node.name}" has a valid type`);
  check(Array.isArray(node.position) && node.position.length === 2, `node "${node.name}" has a position`);
  check(!node.credentials, `node "${node.name}" has no embedded credentials (this is a public template)`);
}

for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
  check(nodeNames.has(sourceName), `connection source "${sourceName}" refers to a real node`);
  for (const branch of outputs.main || []) {
    for (const target of branch) {
      check(nodeNames.has(target.node), `connection target "${target.node}" (from "${sourceName}") refers to a real node`);
    }
  }
}

check(!/AKIA|sk_live_|ghp_|xox[baprs]-/.test(raw), "no obvious secret patterns embedded in the template");

console.log("\nAll checks passed.");
