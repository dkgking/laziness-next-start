import type { MessageDescriptor } from "@lingui/core";
import type { Metadata } from "next";
import { TodoList } from "#/components/TodoList";
import { i18nFor, type LocaleParams, pageLocale } from "#/libs/i18n-server";
import { seo } from "#/libs/seo";
import { listTodos, TODO_TITLE_MAX_CHARS } from "#/server/todos";

const pageTitle: MessageDescriptor = /*i18n*/ { id: "Todos" };

// Read on every request: the list changes while the server runs.
export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: LocaleParams;
}): Promise<Metadata> {
	const locale = await pageLocale(params);
	return seo({
		title: i18nFor(locale)._(pageTitle),
		locale,
		path: "/todos",
	});
}

export default async function TodosPage({ params }: { params: LocaleParams }) {
	const i18n = i18nFor(await pageLocale(params));
	const todos = await listTodos();
	const left = todos.filter((todo) => !todo.done).length;

	return (
		<>
			<h1 className="text-3xl font-bold">{i18n._(pageTitle)}</h1>
			<p className="mt-1 text-slate-600">
				{i18n._(
					"{left} of {count, plural, one {# todo} other {# todos}} left",
					{ left, count: todos.length },
				)}
			</p>
			<TodoList todos={todos} titleMaxChars={TODO_TITLE_MAX_CHARS} />
		</>
	);
}
