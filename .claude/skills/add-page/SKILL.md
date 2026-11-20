---
name: add-page
description: Add a new page/route to this Next.js app (under src/app/(site)/), with data read on the server, translated UI strings and a nav link. Use when asked to create a page, screen, route or section such as /about or /dashboard.
---

# Add a page

Every page lives under `src/app/(site)/`, so it works at `/about` and, once the app has other languages, at `/vi/about` (the mirror under `src/app/[locale]/` is generated: never write there).

## 1. Create the page file

Folder → URL: `src/app/(site)/about/page.tsx` → `/about`, `src/app/(site)/projects/[id]/page.tsx` → `/projects/:id`, `src/app/(site)/projects/page.tsx` → `/projects`.

```tsx
import type { Metadata } from "next";
import { i18nFor, type LocaleParams, pageLocale } from "#/libs/i18n-server";
import { seo } from "#/libs/seo";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	const locale = await pageLocale(params);
	const i18n = i18nFor(locale);
	return seo({
		title: i18n._("About us"),
		description: i18n._("Who we are and what we do."),
		locale,
		path: "/about",
	});
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
	const i18n = i18nFor(await pageLocale(params));
	return <h1 className="text-4xl font-bold">{i18n._("About us")}</h1>;
}
```

- A page is an `async` Server Component. It starts with `await pageLocale(params)`: that is its language, and what makes `/fr/about` a 404 when the app has no French.
- The layout already puts `AppLayout` (header, nav) around it: return only the page's own content.
- `seo()` from `#/libs/seo` makes the title, description, Open Graph, and Twitter card tags. A page with its own picture passes `image` (a root-absolute path or a full URL); an article passes `type: "article"` and `publishedTime`. Set the app's name in `src/libs/site.ts`. Never write the `og:*` or `twitter:*` tags by hand.

## 2. Data (optional)

Read data in the page itself, from a function of `src/server/<feature>.ts` (the `add-server-action` skill). The todo example (`src/app/(site)/todos/page.tsx`, until it is removed) looks like this:

```tsx
import { listTodos } from "#/server/todos";

// Read on every request: the list changes while the server runs.
export const dynamic = "force-dynamic";

export default async function TodosPage({ params }: { params: LocaleParams }) {
	const i18n = i18nFor(await pageLocale(params));
	const todos = await listTodos();
	// ...
}
```

- Without `export const dynamic = "force-dynamic";` a page with no request data is rendered once at build time: right for a page whose content only changes with the code, wrong for one that shows stored data.
- A page with its own param: `params: Promise<{ locale?: string; id: string }>`; read it with `const { id } = await params;` after `pageLocale(params)`.
- Call `notFound()` from `next/navigation` when an item does not exist: `src/app/(site)/not-found.tsx` renders with HTTP 404.
- What reacts to the visitor (a form, a toggle) is a Client Component in `src/components/`, given its data as props: see `src/components/TodoList.tsx`.

## 3. Nav link (optional)

Add an entry to `navItems` in `src/layouts/AppLayout.tsx`. Labels are module-level descriptors, and `LocalizedLink` adds the locale prefix:

```tsx
const navItems = [
	{ to: "/", label: /*i18n*/ { id: "Home" } },
	{ to: "/todos", label: /*i18n*/ { id: "Todos" } },
	{ to: "/about", label: /*i18n*/ { id: "About" } },
] satisfies { to: string; label: MessageDescriptor }[];
```

`to` is typed as plain `string`, so check that the page exists.

## 4. Translate and verify

1. Follow the `i18n-lingui` skill: every visible string goes through `i18n._("...")`. Run `bun run i18n:extract`; when the app has other locales, fill the new keys in each of their catalogs.
2. `bun run verify`: the build's route list shows the new page (and `/[locale]/about` with other locales).
