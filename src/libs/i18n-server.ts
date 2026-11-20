import "server-only";
import { type I18n, type Messages, setupI18n } from "@lingui/core";
import { compileMessage } from "@lingui/message-utils/compileMessage";
import { notFound } from "next/navigation";
import { catalogs } from "#/locales";
import { defaultLocale, isLocale, type Locale } from "./locales";

/** What a page or a layout gets as `params`: `locale` only under src/app/[locale]. */
export type LocaleParams = Promise<{ locale?: string }>;

/**
 * The locale of a page or a layout, from its `params`: the default one
 * under src/app/(site), the address's own under src/app/[locale]
 * (anything else there is not a page).
 */
export const pageLocale = async (params: LocaleParams): Promise<Locale> => {
	const { locale } = await params;
	if (locale === undefined) return defaultLocale;
	if (!isLocale(locale) || locale === defaultLocale) notFound();
	return locale;
};

const instances = new Map<Locale, I18n>();

/** A catalog as Lingui runs it, compiled here so the browser needs no compiler. */
const compiled = (catalog: Record<string, string>): Messages =>
	Object.fromEntries(
		Object.entries(catalog).map(([id, text]) => [
			id,
			// An untranslated entry is empty: the id, the English text, is shown.
			compileMessage(text || id),
		]),
	);

/**
 * Lingui for a Server Component, in `locale`: `i18nFor(locale)._("Text")`.
 * One instance per locale for the whole server; nothing in it is a
 * request's own. Client Components use `useLingui()` instead.
 */
export const i18nFor = (locale: Locale): I18n => {
	let i18n = instances.get(locale);
	if (!i18n) {
		i18n = setupI18n({
			locale,
			messages: { [locale]: compiled(catalogs[locale]) },
		});
		instances.set(locale, i18n);
	}
	return i18n;
};

/** Every locale's compiled catalog, for the one page that cannot know its locale on the server (src/components/UnmatchedPage.tsx). */
export const allMessages = () =>
	Object.fromEntries(
		Object.keys(catalogs).map((locale) => [
			locale,
			i18nFor(locale as Locale).messages,
		]),
	) as Record<Locale, Messages>;
