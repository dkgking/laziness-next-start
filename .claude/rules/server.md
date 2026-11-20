# Server and client

- Pages and layouts are Server Components: they read data by calling functions of `src/server/<feature>.ts` (which starts with `import "server-only"`) and render it. No `fetch` to the app's own API for the app's own data.
- Data changes only through Server Actions in `src/server/<feature>-actions.ts` (the file starts with `"use server"`). Every action is a public endpoint: it checks its input with zod first (`schema.parse(input)`), never trusts an id or a length from the browser, and ends with `refresh()` from `next/cache` so the page reads its data again.
- A Client Component (`"use client"`, in `src/components/`) holds only what reacts to the visitor: forms, toggles, anything with state or an event handler. It gets its data as props from the page and calls actions inside `useTransition`.
- Never import `src/server/<feature>.ts` from a Client Component, except `import type`. Pass constants a form needs (a max length) as props.
- Secrets come from `process.env` inside `src/server/` only. Never in a Client Component, never `NEXT_PUBLIC_`-prefixed.
- Module-level data is lost on restart: say so to the user when they rely on it, and offer a database.
