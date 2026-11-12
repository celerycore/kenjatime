import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const workflow=readFileSync(new URL("../../.github/workflows/r8-benchmark-preview.yml",import.meta.url),"utf8");
const branch="feature/r8-benchmark-preview-20261112";

test("R8 deployment is triggered on merged PR closure, not on open PR updates",()=>{
  assert.match(workflow,/pull_request:\s*\n\s+types:\s*\[closed\]/);
  assert.match(workflow,/pull_request:\s*\n\s+types:\s*\[closed\]\s*\n\s+branches:\s*\[feature\/r8-benchmark-preview-20261112\]/);
  assert.match(workflow,/if: github\.event_name != 'pull_request' \|\| github\.event\.pull_request\.merged == true/);
  assert.doesNotMatch(workflow,/types:\s*\[(?:opened|synchronize|reopened)/);
  assert.ok(workflow.includes("workflow_dispatch:"));
});

test("R8 publishing requires exact source branch and unchanged production Pages",()=>{
  assert.match(workflow,/test "\$\{GITHUB_REF\}" = "refs\/heads\/feature\/r8-benchmark-preview-20261112"/);
  assert.match(workflow,/test "\$\(git rev-parse HEAD\)" = "\$\{GITHUB_SHA\}"/);
  assert.match(workflow,/ref: gh-pages/);
  assert.match(workflow,/rsync -a --delete dist-core\/ existing-pages\/r8-benchmark\//);
  assert.match(workflow,/sha256sum -c \/tmp\/kenjatime-live-before/);
  assert.match(workflow,/if git diff --cached --name-only \| grep -v '\^r8-benchmark\//);
  assert.ok(workflow.includes("test -f existing-pages/arcade/core/index.html"));
  assert.ok(workflow.includes("Verify public benchmark belongs to this source commit"));
});
