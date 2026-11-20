import type { MessageDescriptor } from "@lingui/core";
import type { Metadata } from "next";
import { LocalizedLink } from "#/libs/i18n";
import { i18nFor, type LocaleParams, pageLocale } from "#/libs/i18n-server";
import { seo } from "#/libs/seo";
import { siteName } from "#/libs/site";

const description: MessageDescriptor = /*i18n*/ {
	id: "A Next.js app with Server Components, Server Actions, and translations ready to grow.",
};

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	const locale = await pageLocale(params);
	return seo({
		title: siteName,
		description: i18nFor(locale)._(description),
		locale,
		path: "/",
	});
}

export default async function Home({ params }: { params: LocaleParams }) {
	const i18n = i18nFor(await pageLocale(params));

	return (
		<>
			<section className="py-12">
				<h1 className="text-5xl font-bold tracking-tight">
					{i18n._("Build your app here")}
				</h1>
				<p className="mt-4 max-w-2xl text-lg text-slate-600">
					{i18n._(description)}
				</p>
				<LocalizedLink
					to="/todos"
					className="mt-8 inline-flex rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
				>
					{i18n._("Open the todo example")}
				</LocalizedLink>
			</section>

			<section className="grid gap-4 sm:grid-cols-3">
				<Feature
					title={i18n._("Server Actions")}
					body={i18n._("Change data on the server, with every input checked.")}
				/>
				<Feature
					title={i18n._("Server Components")}
					body={i18n._("Pages read their data on the server as they render.")}
				/>
				<Feature
					title={i18n._("Translations")}
					body={i18n._("English today, more languages when you ask for them.")}
				/>
			</section>
		</>
	);
}

function Feature({ title, body }: { title: string; body: string }) {
	return (
		<div className="rounded-xl border border-slate-200 p-5">
			<h2 className="font-semibold">{title}</h2>
			<p className="mt-1 text-sm text-slate-600">{body}</p>
		</div>
	);
}
