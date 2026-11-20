import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppLayout } from "#/layouts/AppLayout";
import { LinguiProvider } from "#/libs/i18n";
import { i18nFor, type LocaleParams, pageLocale } from "#/libs/i18n-server";
import { siteName } from "#/libs/site";
import "#/styles.css";

export const metadata: Metadata = {
	title: siteName,
	icons: { icon: { url: "/favicon.svg", type: "image/svg+xml" } },
};

// The document of every page, in the page's locale, and the frame around
// it (AppLayout). Pages render inside it: they never wrap themselves.
export default async function SiteLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: LocaleParams;
}) {
	const locale = await pageLocale(params);
	return (
		<html lang={locale}>
			<body>
				<LinguiProvider locale={locale} messages={i18nFor(locale).messages}>
					<AppLayout>{children}</AppLayout>
				</LinguiProvider>
			</body>
		</html>
	);
}
