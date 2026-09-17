# PREIShare repository map

## What exists today

This checkout is a single root-level TanStack Start application. It is not currently a monorepo: there are no `apps/` or `packages/` directories, and there is no separate API, worker, or shared-package project.

The application runtime is React 19 with TanStack Router/Start, Vite, Tailwind CSS, and Nitro. The current share flow persists files in browser IndexedDB; it is not backed by Supabase or another server-side data service.

## Repository layout

```text
.
├── .cursor/rules/          # project and agent conventions
├── .git/                   # Git metadata; do not edit
├── .tanstack/              # generated TanStack tooling; do not edit
├── .vercel/                # generated/local Vercel output; do not edit
├── dist/                   # production build output; do not edit
├── docs/onboarding/        # onboarding and domain documentation
├── src/                    # the PREIShare application
├── AGENTS.md               # repository instructions and project context
├── README.md               # project setup and framework notes
├── package.json            # root app scripts and dependencies
├── package-lock.json       # npm-generated dependency lockfile
├── tsconfig.json           # TypeScript compiler configuration
├── tsr.config.json         # TanStack Router route-generation config
└── vite.config.ts          # Vite, TanStack Start, Nitro, Tailwind wiring
```

### `apps/` and `packages/`

These directories do not exist in the current repository. The root package is the only application package (`preishare-org-repo` in `package.json`). If the project is split into multiple deployables or shared libraries later, those folders should be added deliberately along with workspace configuration; do not assume they already exist.

## Application source: `src/`

```text
src/
├── components/             # reusable app-shell components
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ThemeToggle.tsx
├── lib/                    # shared helpers and domain utilities
│   └── user.ts
├── routes/                 # file-based route source files
│   ├── __root.tsx          # document shell and shared layout
│   ├── about.tsx           # informational route
│   ├── index.tsx           # home route
│   └── share.tsx           # browser-side file-sharing flow
├── router.tsx              # router factory
├── routeTree.gen.ts        # generated route tree; regenerate, do not hand-edit
└── styles.css              # Tailwind entrypoint and global styles
```

Route files under `src/routes/` are the source of truth for URLs and page behavior. Reusable UI belongs in `src/components/`; shared non-UI logic belongs in `src/lib/`.

## Configuration and generated output

- `vite.config.ts` composes the Vite, React, Tailwind, TanStack Start, devtools, and Nitro plugins. Nitro currently uses the Vercel preset.
- `tsconfig.json` defines strict TypeScript and the `#/*` and `@/*` aliases into `src/`.
- `tsr.config.json` controls TanStack Router route generation.
- `package.json` owns the root application scripts: `dev`, `generate-routes`, `build`, and `preview`.
- `src/routeTree.gen.ts`, `dist/`, `.tanstack/`, `.vercel/`, and `node_modules/` are generated or installed output. Do not edit them directly.
- Update `package-lock.json` through npm rather than hand-editing it.

## Runtime boundaries

There is currently no separate backend directory. TanStack Start server functions or route handlers may be added near the route that owns a server concern, but none are committed as a standalone API today. Browser-only APIs such as IndexedDB should remain behind client execution boundaries.

## Where to make changes

- Pages and URLs: `src/routes/`
- Shared UI: `src/components/`
- Shared helpers: `src/lib/`
- Global styles: `src/styles.css`
- Build, routing, and TypeScript behavior: root config files
- Product and onboarding context: `docs/` and `README.md`

After changing route structure, run `npm run generate-routes`. For a full application change, run `npm run build`.
