# Routing

- Every page lives under `src/app/(site)/` (`(site)/about/page.tsx` → `/about`). Never add a page outside it. Route handlers for other programs (webhooks, JSON) go under `src/app/api/`.
- `src/app/[locale]/` is generated from `(site)` by `scripts/locale-routes.ts` (run by `next.config.ts`; it exists only with two or more locales): never edit, create, or delete anything in it.
- A page or a layout takes `params: LocaleParams` and reads its locale with `await pageLocale(params)` (`#/libs/i18n-server`), never from a cookie or a header. The same file serves `/about` and `/vi/about`.
- A page with its own params types them with the locale: `params: Promise<{ locale?: string; id: string }>`.
- Link to internal pages with `LocalizedLink` from `#/libs/i18n` (`to="/about"`, without a locale), never a bare `next/link` or `<a>`. `to` is a plain string: check the page exists.
- A page's metadata comes from `generateMetadata` returning `seo()` from `#/libs/seo` (title through `i18nFor(locale)._()`, `locale`, `path: "/about"`).
- Pages render inside `AppLayout`, put around them by `src/app/(site)/layout.tsx`: a page never wraps itself in it.
- A page calls `notFound()` (`next/navigation`) for a missing item: `src/app/(site)/not-found.tsx` shows it. An error thrown while rendering shows `src/app/(site)/error.tsx`. An address no route matches shows `src/app/not-found.tsx`. Give a folder its own `not-found.tsx` or `error.tsx` only when it needs a different message.
- A page that must read fresh data on every request says `export const dynamic = "force-dynamic";` (one line, a literal: the generated mirror copies it).
