# R8 benchmark deployment — isolated publication contract

**Target public path:** `/kenjatime/r8-benchmark/` on `gh-pages`.  
**Source:** `feature/r8-benchmark-preview-20261112`.  
**Never deploy these experiments to:** `/arcade/`, `/core-test/`, or the website root.

## Why a merged-PR trigger was added

The R8 preview source changes were merged to its feature branch, but
published `r8-benchmark/build-info.json` repeatedly showed the earlier
source commit `82478a57384af17d2feb569c76da228c9bf8b595`.

The workflow already accepted `push` and `workflow_dispatch`, but
GitHub documents that manual `workflow_dispatch` is only available if
the workflow file also exists on the repository's **default branch**.
Here the isolated R8 deployment workflow is maintained on the R8
feature branch; manual dispatch cannot be assumed available.

The workflow now also triggers on `pull_request` **closed** events
**targeting exactly the R8 feature branch** and only runs the publishing
job if `github.event.pull_request.merged == true`. The event ref and
checked-out SHA must match the R8 branch exactly. A PR that closes
without merge must not publish.

Reference: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows

## Test-and-publish gates

1. Confirm the workflow is triggered by the source merge commit from
   `feature/r8-benchmark-preview-20261112`, not an unmerged PR.
2. Full Core unit suite, MUGEN 1.1 parity regressions, indexed R8 GPU
   residency, archive uploader, synthetic stress, and actual browser KFM
   smoke tests must pass before publish.
3. The Pages checkout verifies checksums of `index.html`,
   `.nojekyll`, `arcade/core/index.html`, and
   `core-test/core/index.html`. Only
   `existing-pages/r8-benchmark/` can be staged.
4. The workflow verifies public
   `https://celerycore.github.io/kenjatime/r8-benchmark/build-info.json`
   contains the just-published `GITHUB_SHA`. This must be checked
   *after* the workflow succeeds, not inferred from successful Core CI.
5. If the benchmark still reports a stale SHA, inspect the separate
   `Kenjatime PR17 R8 Benchmark Preview` workflow job, not only
   `Kenjatime Core Stress Regression`. The stress suite alone does
   not deploy pages.

The merged-PR trigger is an **additional delivery path**. It does not
authenticate the published site by itself. If the workflow does not run
or pages metadata remains old, do **not** declare the preview live.
Do not copy built R8 assets over production as a workaround.

**Native MUGEN 1.1 parity remains unverified**: successful R8 source and
browser deployment are separate from an independent native comparison.


## Default-branch entrypoint (required for reliable delivery)

Repository metadata confirms **`gh-pages` is the GitHub default branch**.
A separate default-branch-only Actions entrypoint can call the verified
R8 workflow through `workflow_call`. This is more reliable than a
manual `workflow_dispatch` declared only on the non-default R8 branch.

In reusable mode the GitHub event may belong to `gh-pages`, so
`GITHUB_REF` and `GITHUB_SHA` are **not the R8 source identity**.
The called workflow explicitly checks out
`feature/r8-benchmark-preview-20261112`, derives
`R8_SOURCE_SHA=git rev-parse HEAD`, and writes that exact SHA and the
R8 branch name into `build-info.json`. It uses the recorded R8 source
SHA for the publish commit message and public cache-busting/check.
The site-only production checksum guards remain unchanged.

The entrypoint on `gh-pages` should be scoped to manual dispatch or
merged PR closures targeting R8 and optionally its own initial addition.
It must not alter `/arcade/` or publish any unmerged feature head.

The default-branch wrapper and R8 reusable workflow are distinct:
**a merged Core PR or a successful unit-test run does not establish
that the Pages deployment actually occurred.** Confirm live metadata.
