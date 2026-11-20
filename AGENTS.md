# AGENTS.md

Guide for coding agents working in this repository. Read it, and `.claude/rules/`, before changing code.

## What this is

A server-rendered web app:

- **Next.js 16** (App Router, React 19, Turbopack) with the **React Compiler**: Server Components read data, Server Actions change it
- Built with `next build`, run with `next start` on Node
- **Lingui** for every visible string (language in the URL); **English only** until the user asks for more
- **Tailwind CSS v4**, **zod**, **Biome**, **bun**

`src/app/(site)/todos/page.tsx` with `src/server/todos.ts`, `src/server/todo-actions.ts`, and `src/components/TodoList.tsx` is the example to copy: a page that reads on the server, a form, and Server Actions with zod-checked input.

## The example is not the app

The todo page, its nav link, the home page button and the demo home page text only show the patterns. **In the first round that builds the user's app, remove them** with `.claude/skills/remove-example/SKILL.md` (unless the user asked for a todo list), and make `/` the user's own page. Never hand back an app that still has template pages, links or text.

## Working in Web Studio

- The project is in `/workspace`. Change it in place; never start a second project beside it or start the app over.
- Never commit, push, or touch `.git`: Studio commits each round itself.
- `.laziness/preview.json` says how Studio shows the app: when you end it runs `bun run build` and opens the production server (`start`, what the user gets), and while you work it runs the `live` dev server on `$PORT`, which follows your edits as you save them and is paused while you install, build, or check. Keep `bun run dev` and `bun run build` working.
- Studio starts and stops these servers itself. Never start another dev server (`bun dev`, `next dev`) or the production server (`bun run start`, `next start`, on any port), and never wait for one: each holds hundreds of MB beside it.
- Never open a browser (Playwright, Chromium) to look at the app: Studio opens it when you end, takes its screenshots, and tells you what failed on the page.
- `/workspace/.cache` holds the package managers' caches: never format, lint, search, or delete it.
- The sandbox's memory is small and shared by everything running in it: you, the preview, and the build. Run one heavy command at a time (install, typecheck, build, verify), never in the background or side by side.
- English only, unless the user asks for other languages or a multilingual app: then follow `.claude/skills/add-locale/SKILL.md`.

## Commands

| Task | Command |
|---|---|
| Dev server (port 3000; not in Web Studio) | `bun dev` |
| Type check | `bun run typecheck` |
| Lint + format check | `bun run check` (`bun run check:fix` to fix) |
| Extract UI strings into catalogs | `bun run i18n:extract` |
| Fail if any translation is missing | `bun run i18n:check` |
| Production build | `bun run build` |
| Run the production build (not in Web Studio) | `PORT=3000 bun run start` |

| Every check above, then the build | `bun run verify` |

**Before you say a change is done**, run `bun run verify` once, at the end (not after every file), and fix what it reports.

## Layout

```
src/
  app/
    layout.tsx            # only has to exist: the document is made by (site)/layout.tsx
    not-found.tsx         # an address no route matches
    (site)/               # every page lives here
      layout.tsx          # <html>, the page's locale, Lingui for Client Components, AppLayout
      page.tsx            # home
      todos/page.tsx      # example: a Server Component page + Server Actions
      not-found.tsx, error.tsx
    [locale]/             # GENERATED mirror of (site) for the other locales; absent with one locale
    api/                  # route handlers (webhooks, JSON for other programs), when the app needs any
  server/                 # server-only code: data access (<feature>.ts) and Server Actions (<feature>-actions.ts)
  components/             # Client Components and shared UI (TodoList, NotFound, ErrorPage)
  layouts/AppLayout.tsx   # header, nav, language switcher (shown with 2+ locales)
  libs/
    locales.ts            # locale list, pathIn() (framework-free)
    i18n-server.ts        # for Server Components: pageLocale(params), i18nFor(locale)
    i18n.tsx              # for Client Components: LocalizedLink, useLocale, LinguiProvider
    intl.ts               # number and date formatting
    seo.ts, site.ts       # seo() for each page's metadata; site name and address (NEXT_PUBLIC_SITE_URL)
  locales/<locale>.json   # Lingui catalogs (en.json is the source); index.ts lists them
scripts/locale-routes.ts  # writes src/app/[locale] (run by next.config.ts)
public/                   # static files (favicon.svg)
.laziness/                # Web Studio: preview command and template card
```

## Rules

The must-follow rules are in `.claude/rules/`: `routing.md`, `server.md`, `i18n.md`, `style.md`. In short:

- Pages under `src/app/(site)/`, linked with `LocalizedLink`. Never write under `src/app/[locale]/`: it is generated.
- A page or layout is a Server Component that takes `params: LocaleParams` and starts with `await pageLocale(params)`. Only what reacts to the visitor is a Client Component (`"use client"`) in `src/components/`.
- Data is read in Server Components through `src/server/<feature>.ts`, and changed only through Server Actions in `src/server/<feature>-actions.ts`, input checked with zod; secrets only in server code.
- Every visible string through `i18n._()`: `i18nFor(locale)` on the server, `useLingui()` in Client Components; dates and numbers through `#/libs/intl`.

## Task guides

Step-by-step guides in `.claude/skills/` (also at `.agents/skills/`, the same folder); read the one that matches the task before starting it:

| Task | Guide |
|---|---|
| Remove the todo example and demo text (first round) | `.claude/skills/remove-example/SKILL.md` |
| Add a page / route | `.claude/skills/add-page/SKILL.md` |
| Read or change data on the server | `.claude/skills/add-server-action/SKILL.md` |
| Add or remove a language | `.claude/skills/add-locale/SKILL.md` |
| UI text and translations (house rules) | `.claude/skills/i18n-lingui/SKILL.md` |
| Client-side global state (Zustand) | `.claude/skills/zustand-store/SKILL.md` |
| Deploy (Vercel, Node, Netlify, Cloudflare) | `.claude/skills/deploy/SKILL.md` |
