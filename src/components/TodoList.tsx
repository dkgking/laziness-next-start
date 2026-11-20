"use client";

import { useLingui } from "@lingui/react";
import { type FormEvent, useOptimistic, useState, useTransition } from "react";
import { addTodo, deleteTodo, setTodoDone } from "#/server/todo-actions";
import type { Todo } from "#/server/todos";

/** The part of the todo page that reacts to the visitor: the form and each row's controls. */
export function TodoList({
	todos,
	titleMaxChars,
}: {
	todos: readonly Todo[];
	titleMaxChars: number;
}) {
	const { i18n } = useLingui();
	const [title, setTitle] = useState("");
	const [adding, startAdding] = useTransition();

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const text = title.trim();
		if (!text) return;
		startAdding(async () => {
			await addTodo({ title: text });
			setTitle("");
		});
	};

	return (
		<>
			<form onSubmit={submit} className="mt-6 flex gap-2">
				<label className="sr-only" htmlFor="todo-title">
					{i18n._("New todo")}
				</label>
				<input
					id="todo-title"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder={i18n._("What needs doing?")}
					maxLength={titleMaxChars}
					className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
				/>
				<button
					type="submit"
					disabled={adding || !title.trim()}
					className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
				>
					{i18n._("Add")}
				</button>
			</form>

			{todos.length === 0 ? (
				<p className="mt-8 text-slate-500">{i18n._("Nothing to do yet.")}</p>
			) : (
				<ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200">
					{todos.map((todo) => (
						<TodoRow key={todo.id} todo={todo} />
					))}
				</ul>
			)}
		</>
	);
}

function TodoRow({ todo }: { todo: Todo }) {
	const { i18n } = useLingui();
	// Each row waits on its own change, so the other rows stay usable.
	const [pending, startChange] = useTransition();
	// Shows the new state at once, until the server's list comes back.
	const [done, setShownDone] = useOptimistic(todo.done);
	return (
		<li className="flex items-center gap-3 px-4 py-3">
			<input
				type="checkbox"
				checked={done}
				disabled={pending}
				aria-label={i18n._("Done: {title}", { title: todo.title })}
				onChange={(event) => {
					const next = event.target.checked;
					startChange(async () => {
						setShownDone(next);
						await setTodoDone({ id: todo.id, done: next });
					});
				}}
				className="size-4"
			/>
			<span className={done ? "flex-1 text-slate-400 line-through" : "flex-1"}>
				{todo.title}
			</span>
			<button
				type="button"
				disabled={pending}
				onClick={() => startChange(() => deleteTodo({ id: todo.id }))}
				className="text-sm text-red-600 hover:underline disabled:opacity-50"
			>
				{i18n._("Delete")}
			</button>
		</li>
	);
}
