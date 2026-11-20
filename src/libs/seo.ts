import type { Metadata } from "next";
import { type Locale, pathIn } from "./locales";
import { absoluteUrl, siteName } from "./site";

export interface SeoInput {
	readonly title: string;
	readonly description?: string;
	/** Root-absolute ("/uploads/cover.png") or a full URL. */
	readonly image?: string;
	/** The page's locale and its path without one ("/todos"), for og:url. */
	readonly locale: Locale;
	readonly path?: string;
	readonly type?: "website" | "article";
	/** ISO date, for articles. */
	readonly publishedTime?: string;
}

/**
 * A page's `generateMetadata()`: title, description, Open Graph, and
 * Twitter card. Tags without a value are left out; X reads og:* when
 * twitter:* is missing.
 */
export const seo = ({
	title,
	description,
	image,
	locale,
	path,
	type = "website",
	publishedTime,
}: SeoInput): Metadata => {
	const imageUrl = image ? absoluteUrl(image) : undefined;
	const url = path ? absoluteUrl(pathIn(locale, path)) : undefined;
	return {
		title,
		description,
		openGraph: {
			siteName,
			title,
			description,
			locale,
			url,
			images: imageUrl ? [imageUrl] : undefined,
			...(type === "article"
				? { type, publishedTime }
				: { type: "website" as const }),
		},
		twitter: { card: imageUrl ? "summary_large_image" : "summary" },
	};
};
