// Framework-free locale constants. Codes must be two lowercase letters: a
// locale is the first part of a page's address (/vi/todos). Keep in sync with
// lingui.config.ts and src/locales/index.ts (see .claude/skills/add-locale).
export const locales = [
	{ code: "en", name: "English", nativeName: "English" },
] as const;

export type Locale = (typeof locales)[number]["code"];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
	locales.some((locale) => locale.code === value);

/** The path of the page `path` in `locale`: the default locale has no prefix ("/todos"), the others have theirs ("/vi/todos"). */
export const pathIn = (locale: Locale, path: string) =>
	locale === defaultLocale ? path : `/${locale}${path === "/" ? "" : path}`;

/** A path without its locale prefix or a trailing slash ("/vi/todos/" → "/todos"). */
export const unlocalizedPath = (rawPathname: string) => {
	const pathname =
		rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;
	for (const { code } of locales) {
		if (pathname === `/${code}`) return "/";
		if (pathname.startsWith(`/${code}/`))
			return pathname.slice(code.length + 1);
	}
	return pathname;
};

/** The locale a path is in, by its prefix; the default locale without one. */
export const localeOfPath = (pathname: string): Locale => {
	const first = pathname.split("/")[1] ?? "";
	return isLocale(first) ? first : defaultLocale;
};
