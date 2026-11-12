# Guidance for AI agents

## Fork notes (WentTheFox/homepage)

This is a personal fork. Upstream's agent guidance (CONTRIBUTING.md's AI rules, contribution boundaries, issue/security report rules) was removed from this file on purpose; it is not the fork's workflow. Do not open pull requests to `gethomepage/homepage` from agent work. Facts below were checked on 2026-11-12, on top of upstream 2.8.0.

Repository basics: Next.js app managed with `pnpm`. Check with `pnpm lint` and `pnpm test`; formatting is handled by pre-commit (`pre-commit run --files <changed-files>`). Widgets live in `src/widgets/`, components in `src/components/`, pages and API routes in `src/pages/`, shared logic in `src/utils/`, docs in `docs/`.

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
- **The fork publishes its own image** with `.github/workflows/publish-fork.yml` (fork-only file, so merges from upstream do not touch it): `ghcr.io/wentthefox/homepage`, multi-arch (amd64 and arm64, each built natively), tags `<sha7>` and `sha-<sha7>` for every push to `main`, no `latest`. The Rathalos cluster repo deploys it (Argo CD Image Updater follows the `sha-` tag). `docker-publish.yml` still only runs for `gethomepage/homepage` (upstream's own guard, unchanged). The production image was first smoke-tested by hand on Node 26 (`/`, `/api/hash` and `/api/widgets` answer 200 with a config directory mounted, no errors in the log); tests and lint run in CI.

### When merging upstream

- Expect a conflict in `AGENTS.md`: keep the fork's version (upstream's guidance stays removed).
- Expect conflicts in `Dockerfile`, `Dockerfile-tilt` (modify/delete: keep the fork's file), `.github/workflows/test.yml`, `.github/workflows/lint.yml`, `.github/workflows/docker-publish.yml`, `.codecov.yml` (delete) and the README badge line. Keep the fork's side, then take over any real upstream change in the same file.
- If upstream changes its Node version, decide on purpose whether to follow; the fork stays on 26 until changed here.
- If upstream stops needing the `localStorage` flag (their tests change, or they move to a Node where it is not needed), the flag can go; until then keep it.
- Verify with `pnpm lint`, `pnpm test` and the CI runs (Tests and Lint both pass on Node 26 at the time of writing).
