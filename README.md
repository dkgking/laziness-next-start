# laziness-next-start

A Next.js app (App Router) for [Laziness](https://laziness.ai) Web Studio: server rendering, Server Components and Server Actions, a todo example, Tailwind CSS, and Lingui translations (English to start, more languages on request).

## Use it

```bash
bun install
bun dev                 # http://localhost:3000
bun run build           # next build
PORT=3000 bun run start
```

Checks: `bun run typecheck`, `bun run check`, `bun run i18n:check`.

## In Web Studio

Studio clones this repository into a project and previews it with `.laziness/preview.json`; `.laziness/template.json` is its card. Coding agents read `AGENTS.md` (through `CLAUDE.md`), `.claude/rules/`, and the task guides in `.claude/skills/`.

## Deploy

Vercel, a Node server, Netlify, or Cloudflare Workers: see `.claude/skills/deploy/SKILL.md`.

## License

MIT
