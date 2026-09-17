# AI tooling verification

Date: 2026-09-17
Repo: PREIshare

## Scope

This verification uses four agent checks from the onboarding tutorial: structure, safety, scope, and stack. It checks repository contents, conventions, and declared configuration only. It does not run `npm run build`, `npm run dev`, or route generation.

The current repo is a single root-level React/TanStack Start app. It has no separate backend service, Supabase integration, `apps/` directory, or `packages/` directory.

## Agent check 1 — structure

Purpose: confirm that the repository has the expected PREIshare source, documentation, and rules locations without assuming a monorepo layout.

Command:
```bash
find src docs .cursor -maxdepth 2 -type d -print | sort
test ! -d apps && test ! -d packages
```

Observed result:
- `src/`, `src/components/`, `src/lib/`, and `src/routes/` are present.
- `docs/onboarding/` and `.cursor/rules/` are present.
- `apps/` and `packages/` are absent.

Interpretation: the checked-out structure matches the root-app layout documented in `docs/onboarding/repo-map.md`.

## Agent check 2 — safety

Purpose: look for common secret-bearing files and credential patterns before treating the repository as ready for AI-assisted work.

Command:
```bash
git ls-files | grep -E '(^|/)(\.env|.*\.pem|.*\.key)$' || true
grep -RInE 'SUPABASE_SERVICE_ROLE|BEGIN (RSA|OPENSSH|EC) PRIVATE KEY|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]+' \
	--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
	--exclude-dir=.vercel --exclude-dir=.tanstack . || true
```

Observed result:
- No tracked `.env`, private-key, or credential-named files were found.
- No matching service-role, private-key, AWS access-key, or GitHub-token patterns were found.

Interpretation: no obvious secret material was detected by this limited static check. The Cursor rules remain the authority for handling future environment variables and server-only values.

## Agent check 3 — scope

Purpose: confirm that tracked files stay within the documented application, onboarding, configuration, and project-guidance scope.

Command:
```bash
git ls-files | grep -vE '^(src|docs|\.cursor|AGENTS\.md|README\.md|package(-lock)?\.json|tsconfig\.json|tsr\.config\.json|vite\.config\.ts|\.hintrc)(/|$)' || true
```

Observed result:
- The command returned no out-of-scope tracked paths.

Interpretation: the repository remains focused on the PREIshare app and its supporting documentation/configuration. Generated local directories such as `dist/`, `.tanstack/`, and `.vercel/` are not part of the tracked source scope.

## Agent check 4 — stack

Purpose: verify the declared framework/tooling dependencies and their Vite integration without executing the application.

Command:
```bash
node -e "const p=require('./package.json'); const deps={...p.dependencies,...p.devDependencies}; for (const name of ['react','@tanstack/react-start','@tanstack/react-router','vite','typescript','tailwindcss','@tailwindcss/vite','nitro']) console.log(name+': '+(deps[name] ?? 'MISSING'))"
grep -nE 'tanstackStart|tailwindcss|viteReact|nitro' vite.config.ts
```

Observed result:
- React `^19.2.0`, TanStack Start `latest`, TanStack Router `latest`, Vite `^8.0.0`, TypeScript `^6.0.2`, Tailwind `^4.1.18`, `@tailwindcss/vite` `^4.1.18`, and Nitro’s Vercel-targeted nightly package are declared.
- `vite.config.ts` wires the React, Tailwind, TanStack Start, devtools, and Nitro plugins.

Interpretation: the declared stack matches the PREIshare repository map and project rules.

## GO / NO-GO decision

Decision: GO

Reasoning:
- All four agent checks passed in the current repo state.
- The repository structure and tracked scope match the documented root-level app.
- No obvious secret material was found by the safety scan.
- The declared React/TanStack/Vite/Tailwind/Nitro stack matches the Vite configuration.

## Caveat

This is a GO for repository structure, safety signals, scope, and declared stack only. It is not evidence that the app builds, the dev server starts, or a future backend/deployment configuration works. Those require separate runtime checks when they are requested.
