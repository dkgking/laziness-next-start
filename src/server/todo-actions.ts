"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import {
	insertTodo,
	removeTodo,
	TODO_TITLE_MAX_CHARS,
	updateTodoDone,
} from "./todos";

// Server Actions: the only way the browser changes data. Each one is a
// public endpoint, so each checks its input with zod before it does
// anything, then has the page read its data again (`refresh()`).

const addInput = z.object({
	title: z.string().trim().min(1).max(TODO_TITLE_MAX_CHARS),
});

export async function addTodo(input: z.input<typeof addInput>) {
	const { title } = addInput.parse(input);
	await insertTodo(title);
	refresh();
}

const doneInput = z.object({ id: z.string(), done: z.boolean() });

export async function setTodoDone(input: z.input<typeof doneInput>) {
	const { id, done } = doneInput.parse(input);
	await updateTodoDone(id, done);
	refresh();
}

const deleteInput = z.object({ id: z.string() });

export async function deleteTodo(input: z.input<typeof deleteInput>) {
	const { id } = deleteInput.parse(input);
	await removeTodo(id);
	refresh();
}
