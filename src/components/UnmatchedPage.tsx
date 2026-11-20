"use client";

import type { Messages } from "@lingui/core";
import { NotFound } from "#/components/NotFound";
import { AppLayout } from "#/layouts/AppLayout";
import { LinguiProvider, usePathLocale } from "#/libs/i18n";
import type { Locale } from "#/libs/locales";

/**
 * The not-found page of an address no route matches
 * (src/app/not-found.tsx). The server cannot know its language there, so
 * it is given every locale's messages and reads the locale from the
 * address in the browser.
 */
export function UnmatchedPage({
	messages,
}: {
	messages: Record<Locale, Messages>;
}) {
	const locale = usePathLocale();
	return (
		<LinguiProvider key={locale} locale={locale} messages={messages[locale]}>
			<AppLayout>
				<NotFound />
			</AppLayout>
		</LinguiProvider>
	);
}
