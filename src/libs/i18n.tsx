"use client";

import { type Messages, setupI18n } from "@lingui/core";
import { I18nProvider, useLingui } from "@lingui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
	type ComponentProps,
	type ReactNode,
	useEffect,
	useState,
} from "react";
import {
	defaultLocale,
	type Locale,
	localeOfPath,
	pathIn,
	unlocalizedPath,
} from "./locales";

/**
 * Lingui for the Client Components under it, in the page's locale with
 * the messages its layout read on the server (src/app/(site)/layout.tsx).
 */
export function LinguiProvider({
	locale,
	messages,
	children,
}: {
	locale: Locale;
	messages: Messages;
	children: ReactNode;
}) {
	const [i18n] = useState(() =>
		setupI18n({ locale, messages: { [locale]: messages } }),
	);
	return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}

/**
 * The locale the address in the browser names, for the one page rendered
 * with no locale of its own: an address no route matches
 * (src/components/UnmatchedPage.tsx). That page is prerendered once for
 * every address, in the default locale; the address's own takes over in
 * the browser.
 */
export function usePathLocale(): Locale {
	const pathname = usePathname();
	const [locale, setLocale] = useState<Locale>(defaultLocale);
	useEffect(() => {
		const inPath = localeOfPath(pathname);
		setLocale(inPath);
		document.documentElement.lang = inPath;
	}, [pathname]);
	return locale;
}

/** The page's locale and a way to open the same page in another one. */
export function useLocale() {
	const { i18n } = useLingui();
	const router = useRouter();
	const pathname = usePathname();
	return {
		currentLocale: i18n.locale as Locale,
		switchLocale: (locale: Locale) =>
			router.push(pathIn(locale, unlocalizedPath(pathname))),
	};
}

/**
 * `next/link` to a page of this app by its path without a locale
 * ("/todos"): the prefix of the page's own locale is added. Usable from
 * Server and Client Components.
 */
export function LocalizedLink({
	to,
	...props
}: Omit<ComponentProps<typeof Link>, "href"> & { to: string }) {
	const { i18n } = useLingui();
	return <Link href={pathIn(i18n.locale as Locale, to)} {...props} />;
}
