# Guidance for AI agents

Read [CONTRIBUTING.md](CONTRIBUTING.md) before working on this repository, especially [Use of AI Tools](CONTRIBUTING.md#use-of-ai-tools). These rules apply to all agent-assisted work.

## Contribution boundaries

- Do not open or submit pull requests, including "on behalf of" a human. Prepare local changes for a human to review, verify, and submit personally.
- The project does not accept PRs that are entirely or mostly AI-derived. Human submission and disclosure do not override this rule.
- AI-generated content must be clearly disclosed. When handing work back to a human, identify what was generated or changed with AI assistance so they can disclose it accurately.

## Ideas matter more than code

Homepage is simple by design. It is modular, and most changes — a new service widget, for example — are small and self-contained. There are already well over a hundred widgets that all follow the same shape, so producing another is easy, and an LLM makes it easier still.

That is exactly the problem. When writing the code is cheap, the scarce and valuable thing is a well-described idea that someone actually wants:

- The bottleneck is not implementation. It is whether a feature is wanted, fits the project, and can be maintained. A generated PR shifts all of that cost onto maintainers.
- New features and enhancements should almost always target an existing feature request with real community interest and discussion. Do not generate a widget or feature nobody has asked for.
- Help contributors describe the problem, their use case, the behavior they want, and who would benefit. An implementation is not required for a valuable contribution — and a flawed one can bury a good idea under arguments about the generated code before anyone discusses whether the idea is useful.
- Encourage first-time contributors to open a discussion before preparing a PR, especially for anything large or involving AI-generated code.

## Issue and security reports

- Issue reports must describe observed behavior only: what happened, how to reproduce it, and the relevant logs. Do not add speculative root causes, code analysis, or proposed fixes to agent-generated reports.
- AI-assisted security reports must meet the requirements in [SECURITY.md](SECURITY.md#ai-assisted-reports). A human must reproduce a real Homepage code path, with realistic prerequisites and impact, before submission. Scanner output, affected dependency versions, or concerns without a demonstrated, reachable exploit do not meet this threshold. Disclose AI assistance and use the private reporting channel in [SECURITY.md](SECURITY.md#reporting-a-vulnerability).

## Working on changes

- Read the relevant code, tests, and documentation before editing. Follow the existing patterns — for widgets, mirror a comparable widget in `src/widgets/` rather than inventing a new shape.
- Keep changes focused on the requested work. Avoid unrelated refactoring, formatting, or dependency changes.
- Add or update tests for behavior changes. Do not weaken tests or checks to make a change pass.
- Update the docs in `docs/` when behavior or setup changes.
- Keep credentials and private config out of commits, fixtures, logs, and examples.

## Repository and validation

- `src/widgets/`: service widgets (one directory each).
- `src/components/`: shared React components.
- `src/pages/`: Next.js pages and API routes.
- `src/utils/`: shared logic (config loading, proxies, helpers).
- `docs/`: documentation published to [gethomepage.dev](https://gethomepage.dev).
- `config/`: example and schema config.

This is a Next.js app managed with `pnpm`. Common checks:

- `pnpm lint` — ESLint.
- `pnpm test` — Vitest.
- Pre-commit hooks handle formatting: run `pre-commit run --files <changed-files>` from the repository root.

See the [development documentation](https://gethomepage.dev/widgets/authoring/getting-started/) for setup and the [service widget guidelines](https://gethomepage.dev/widgets/authoring/getting-started/#service-widget-guidelines).

When handing work back, summarize the changes, the checks you actually ran and their results, and any remaining uncertainty. Clearly state when a check could not be run; do not claim verification that did not happen. The human contributor must understand and independently verify the contribution before submitting it.

## Fork notes (WentTheFox/homepage)

Everything above is upstream's and applies as written (in particular: no pull requests to `gethomepage/homepage` from agent work). This section is the fork's own and is kept at the end of the file to keep merges with upstream simple. Facts below were checked on 2026-11-12, on top of upstream 2.8.0.

### Branches and upstream

- The fork has one branch, `main` (the default). There is no `dev`: upstream develops on `dev` and releases from `main`, and the fork follows the releases.
- Update from upstream's `main`, not its `dev`: `git fetch https://github.com/gethomepage/homepage.git main && git merge FETCH_HEAD`.
- GitHub Actions is enabled on the fork. The repository requires every action to be pinned to a full commit SHA, so an unpinned action, including one used inside another action, fails the job at setup.

### Differences from upstream

- **Node 26** (the LTS line since 2026-11-10) where upstream uses Node 24: `Dockerfile` (`node:26-slim` builder, `node:26-alpine` runner), `Dockerfile-tilt`, and `node-version: 26` in `test.yml`, `lint.yml` and `docker-publish.yml`.
- **corepack is installed explicitly.** Node 25+ no longer ships it, so the `Dockerfile` runs `npm install -g corepack` before `corepack enable`.
- **`Dockerfile-tilt` exists only in the fork** (upstream deleted it): a single-stage dev image that runs `next dev` (named for Tilt; the Tiltfile itself is not in this repo). Its Node version follows the main `Dockerfile`.
- **`test.yml` sets `NODE_OPTIONS: --no-experimental-webstorage` for vitest.** Node 25+ defines a global `localStorage` that returns `undefined` unless `--localstorage-file` is given, and it shadows jsdom's, so every test touching `localStorage` fails without the flag. The same step no longer runs `--coverage`.
- **Codecov is removed:** the upload step in `test.yml`, `.codecov.yml` and the README badge are gone (the fork has no token).
- **`lint.yml` runs pre-commit directly** (SHA-pinned `actions/cache`, `pip install pre-commit`, `pre-commit run --all-files`) instead of `pre-commit/action`, which calls an unpinned `actions/cache` that the SHA-pinning rule rejects.
- **No image is published from the fork:** `docker-publish.yml` only runs for `gethomepage/homepage` (upstream's own guard, unchanged). The production image was only smoke-tested by hand on Node 26 (`/`, `/api/hash` and `/api/widgets` answer 200 with a config directory mounted, no errors in the log); tests and lint run in CI.

### When merging upstream

- Expect conflicts in `Dockerfile`, `Dockerfile-tilt` (modify/delete: keep the fork's file), `.github/workflows/test.yml`, `.github/workflows/lint.yml`, `.github/workflows/docker-publish.yml`, `.codecov.yml` (delete) and the README badge line. Keep the fork's side, then take over any real upstream change in the same file.
- If upstream changes its Node version, decide on purpose whether to follow; the fork stays on 26 until changed here.
- If upstream stops needing the `localStorage` flag (their tests change, or they move to a Node where it is not needed), the flag can go; until then keep it.
- Verify with `pnpm lint`, `pnpm test` and the CI runs (Tests and Lint both pass on Node 26 at the time of writing).
