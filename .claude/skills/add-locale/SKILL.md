---
name: add-locale
description: Add, remove or change a language of this app (e.g. add Vietnamese "vi", drop one, change the default) across the locale list, the Lingui config and the translation catalogs. Use when the user asks for the app in another language, or for a multilingual app.
---

# Add or remove a locale

The app ships in English only. Add a language only when the user asks for it.

Locale codes must be **exactly two lowercase letters** (`vi`, `fr`, `ja`): a locale is the first part of a page's address. If two variants of one language are needed (`zh-TW`, `pt-BR`), stop and say so.

The default locale (`en`) has no URL prefix and its catalog is the Lingui source. Every other locale is served under its prefix (`/vi`, `/vi/todos`).

## Add a locale (example: `vi`)

1. **`src/libs/locales.ts`**: add an entry. `nativeName` is shown in the language switcher.
   ```ts
   { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
   ```
2. **`lingui.config.ts`**: add `"vi"` to `locales`.
3. **Catalog**: run `bun run i18n:extract`. It creates `src/locales/vi.json` with empty values. Translate every entry (see the `i18n-lingui` skill).
4. **`src/locales/index.ts`**: import the catalog and add it to `catalogs` (the type check fails while a locale has no line there).
   ```ts
   import en from "./en.json";
   import vi from "./vi.json";

   export const catalogs = { en, vi } satisfies Record<Locale, Record<string, string>>;
   ```
5. Nothing else. The pages are not copied: `scripts/locale-routes.ts` writes `src/app/[locale]/` from `src/app/(site)/` the next time Next.js starts (`bun run build`, `bun dev`, `bun run typecheck`), and the language switcher in `src/layouts/AppLayout.tsx` appears by itself once there are two locales. Never edit `src/app/[locale]/`.

## Remove a locale (example: `vi`)

1. Remove it from `src/libs/locales.ts`, `lingui.config.ts`, and `src/locales/index.ts`.
2. Delete `src/locales/vi.json`.
3. `grep -rn '"vi"\|/vi/' src` to catch leftovers. Back to one locale, `src/app/[locale]/` is removed by itself.

## Verify

```bash
bun run i18n:check        # every catalog complete
bun run verify
```

The build's route list must show each page twice: `/todos` and `/[locale]/todos`, with `/vi` under `/[locale]`. Then `/vi` and `/vi/todos` show translated text, `<html lang>` is `vi`, and the language switcher moves between `/todos` and `/vi/todos`. `/en/todos` is not a page (404): the default locale has no prefix.

Note: `Intl` formats dates per locale (`formatDate` in `src/libs/intl.ts`). For example, `th` uses the Buddhist calendar year by default. To force Gregorian, pass a locale such as `th-TH-u-ca-gregory`.
