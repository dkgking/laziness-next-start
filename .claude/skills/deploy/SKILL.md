---
name: deploy
description: >
  Publish this Next.js app (server-rendered, with Server Actions) to Vercel, a
  Node server, Netlify or Cloudflare Workers: choosing a target, what each
  needs, environment variables and post-deploy checks. Use when asked to
  deploy, host, publish, go live or move the app to another platform.
---

# Deploy

The app renders on the server and has Server Actions, so it needs a platform that runs server code. `bun run build` makes `.next/`; `bun run start` serves it with Node.

| Target | How | Code change |
|---|---|---|
| **Vercel** | detects Next.js | none |
| **Node server** (any VPS, Docker) | `next start` | none: `bun run build && PORT=3000 bun run start` |
| **Netlify** | its Next.js runtime, detected | none |
| **Cloudflare Workers** | the OpenNext adapter (`@opennextjs/cloudflare`) + wrangler | add the adapter and `wrangler.jsonc` |

Source: https://nextjs.org/docs/app/getting-started/deploying

From Web Studio, this app publishes to a zip, GitHub, or Vercel. Studio's Netlify and Cloudflare targets take static sites only, so they refuse this app; deploy to them from its GitHub repository instead.

## Vercel

Nothing to change: import the repository in Vercel (or `vercel deploy`). Vercel installs with bun because of `bun.lock` and builds `bun run build`.

## Node server

Nothing to change. Build, then run `node_modules/.bin/next start -H 0.0.0.0 -p $PORT` (default port 3000). Put it behind a proxy that terminates TLS. For a small Docker image, set `output: "standalone"` in `next.config.ts` and follow Next.js's self-hosting guide (copy `public/` and `.next/static/` beside `.next/standalone/`, run `node server.js`).

## Netlify

Connect the repository: Netlify detects Next.js and adds its runtime. Build command `bun run build`, publish directory `.next`.

## Cloudflare Workers

Follow the current OpenNext guide (https://opennext.js.org/cloudflare/get-started): `bun add -d @opennextjs/cloudflare@<exact version> wrangler@<exact version>`, the `wrangler.jsonc` and `open-next.config.ts` it gives, and its `deploy` script. Secrets: `wrangler secret put <NAME>`. No Node-only APIs (fs, child_process) in server code there beyond what `nodejs_compat` covers.

## Always

1. `bun run verify` before deploying.
2. Set `NEXT_PUBLIC_SITE_URL` (the app's public address) in the platform's build environment: `og:url` and `og:image` need it.
3. Secrets live in the platform's environment settings, never in the repository.
4. In-memory data (as in the todo example) is lost on every restart and is not shared between instances: use a database before going live.
5. After deploying, check `/` and each page (a form saves and the change shows), and a missing path → 404.
6. When moving to another platform, update the Runtime lines of `AGENTS.md` and `README.md` so later work does not follow stale instructions.
