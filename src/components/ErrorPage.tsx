"use client";

import { useLingui } from "@lingui/react";
import { useEffect } from "react";
import { LocalizedLink } from "#/libs/i18n";

/**
 * An error thrown while a page renders (src/app/(site)/error.tsx). The
 * error's own message shows only in development: in production Next.js
 * sends the browser a digest, never a server's details.
 */
export function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { i18n } = useLingui();

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
			<h1 className="text-4xl font-bold">{i18n._("Something went wrong")}</h1>
			<p className="mt-2 text-slate-600">
				{i18n._("This page could not be shown. Try again in a moment.")}
			</p>
			{process.env.NODE_ENV === "development" && (
				<pre className="mt-6 max-w-full overflow-x-auto rounded-lg bg-slate-100 p-4 text-left text-sm text-red-700">
					{error.message}
				</pre>
			)}
			<div className="mt-8 flex gap-3">
				<button
					type="button"
					onClick={reset}
					className="rounded-lg bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700"
				>
					{i18n._("Try again")}
				</button>
				<LocalizedLink
					to="/"
					className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
				>
					{i18n._("Back to home")}
				</LocalizedLink>
			</div>
		</div>
	);
}
