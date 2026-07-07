# AGENTS.md

## Project Overview

`@deviltea/tiny-state-machine` is a tiny, type-safe finite state machine library (states, events, transitions) with a Vue integration package. pnpm monorepo: `packages/core` is the dependency-free core, `packages/vue` provides a Vue composable on top of it. Dependency versions are centralized via `catalog:` entries in `pnpm-workspace.yaml`. pnpm 10.34.4, Node >= 24 (engines).

**Repository structure:**
```
packages/
├── core/               # @deviltea/tiny-state-machine — core FSM (single-file src/index.ts)
└── vue/                # @deviltea/tiny-state-machine-vue — Vue composable, depends on core
docs/                   # VitePress docs site, deployed to GitHub Pages
scripts/newpkg.ts       # Interactive scaffold for a new packages/* package
pnpm-workspace.yaml     # Workspace globs + catalog versions + pnpm security settings
vitest.config.ts        # Root Vitest config (coverage + typecheck always on)
.github/workflows/      # ci, release, deploy-docs, security-audit
```

## Setup Commands

```bash
# Install dependencies
pnpm install

# Build all packages (unbuild, ESM + CJS dist)
pnpm build

# Stub builds for local dev (unbuild --stub)
pnpm stub

# Run tests (Vitest, watch mode; coverage + type-level checks enabled)
pnpm test

# Run tests with coverage report
pnpm test:coverage

# Lint and auto-fix
pnpm lint

# Type check all packages and docs
pnpm typecheck

# Validate published package shape
pnpm publint

# Docs dev server / build / preview
pnpm docs:dev
pnpm docs:build
pnpm docs:preview

# Scaffold a new package under packages/ (interactive)
pnpm newpkg
```

## Code Style

- ESLint flat config using `@deviltea/eslint-config`; tabs for indentation, single quotes, no semicolons.
- TypeScript strict mode via shared `@deviltea/tsconfig` (target/module ESNext). Each package has `tsconfig.package.json` (src) and `tsconfig.tests.json` (src + tests); typecheck runs both.
- ESM everywhere (`"type": "module"`); packages built with unbuild, emitting `.mjs` + `.cjs` with type declarations.
- All dependency versions go through the `catalog:` in `pnpm-workspace.yaml` — add new deps to the catalog, reference them as `"catalog:"` in package.json.
- Pre-commit hook (simple-git-hooks) runs `lint-staged` → `eslint --fix` on staged files.

## Testing

- Vitest, configured at the root (`vitest.config.ts`). Coverage is always enabled (`include: ['src/**/*.ts']`, output in `coverage/`) and `typecheck.enabled: true` runs type-level tests.
- Tests live in `packages/<pkg>/tests/*.test.ts`.
- Single test file: `pnpm vitest run packages/core/tests/index.test.ts` (`pnpm test` alone starts watch mode).
- CI runs lint, typecheck, and tests across ubuntu/windows/macos.

## Release

- Releases run in CI: trigger the `Release` workflow (workflow_dispatch) with a `bump_type` (patch/minor/major). It validates (`pnpm build && pnpm publint && pnpm typecheck && pnpm test`), bumps all packages with `bumpp -r` (pushes the release commit + `v*` tag), publishes every `packages/*` package to npm via trusted publishing (OIDC — no token secret), then generates GitHub release notes with `changelogithub`.
- The local `pnpm release` script bypasses CI validation and produces no GitHub release notes — prefer the workflow.
- Docs: pushes to `main` trigger `deploy-docs.yml`, building VitePress and deploying `docs/.vitepress/dist` to GitHub Pages.
- Weekly `security-audit.yml` runs `pnpm audit --audit-level=moderate` (Sundays 21:00 UTC).

## Gotchas

- `pnpm-workspace.yaml` sets `shellEmulator: true` — root scripts run under pnpm's shell emulator, which expands unquoted globs. Keep filter globs quoted (e.g. `--filter='./packages/*'`) when adding or editing scripts.
- Supply-chain settings in `pnpm-workspace.yaml`: `minimumReleaseAge: 4320` (packages younger than 3 days won't resolve), `trustPolicy: no-downgrade`, `blockExoticSubdeps: true`, `strictDepBuilds: true` (only `esbuild` and `simple-git-hooks` are allowed/ignored for build scripts). New deps may need catalog + these settings in mind.
- Docs nav/sidebar in `docs/.vitepress/config.ts` still point at the scaffold example pages (`markdown-examples`, `api-examples`); replace them when writing real docs.
