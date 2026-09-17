<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# PREIshare contributor guide

This repository contains PREIshare, a root-level React 19 and TanStack Start application. It is not currently a monorepo: there are no `apps/` or `packages/` directories.

## Read these first

- `.cursor/rules/preishare.mdc` is the primary project rules file. Follow it for architecture, security, environment variables, generated files, and validation expectations.
- `docs/onboarding/` contains the repository map and domain onboarding material. Start with `docs/onboarding/repo-map.md` when locating code or deciding where a change belongs.

## Repository shape

- `src/routes/` contains TanStack Router file-based routes and is the source of truth for URLs.
- `src/components/` contains reusable UI components.
- `src/lib/` contains shared helpers and domain utilities.
- `src/styles.css` contains the Tailwind entrypoint and global styles.
- Root configuration lives in `vite.config.ts`, `tsconfig.json`, `tsr.config.json`, and `package.json`.
- `src/routeTree.gen.ts`, `dist/`, `.tanstack/`, `.vercel/`, and `node_modules/` are generated or installed output and should not be edited directly.

## Commands

```bash
npm install
npm run dev
npm run generate-routes
npm run build
npm run preview
```

After changing route structure, run `npm run generate-routes`. Run `npm run build` before considering an application or server-boundary change complete.

## Runtime boundaries

Keep browser-only APIs behind client execution boundaries. Use TanStack Start server functions or route handlers for server-only work, and never expose secrets through `VITE_*` environment variables.
