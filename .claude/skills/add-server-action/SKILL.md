---
name: add-server-action
description: Read data on the server for a page (a server-only module) and change it with a Server Action whose input is checked with zod, called from a Client Component. Use when a page needs data, a form must save something, or code must run only on the server (secrets, a database, another API).
---

# Read and change data on the server

Two files per feature in `src/server/`: `<feature>.ts` holds the data access and runs only on the server; `<feature>-actions.ts` holds the Server Actions the browser may call. `src/server/todos.ts` and `src/server/todo-actions.ts` are the reference while the example is still in the repo; the snippets below are complete without it.

## 1. Data access: `src/server/notes.ts`

```ts
import "server-only";

export type Note = { id: string; text: string };

export const NOTE_MAX_CHARS = 500;

export const listNotes = async (): Promise<Note[]> => db.notes.all();
export const insertNote = async (text: string): Promise<Note> => db.notes.add(text);
```

- `import "server-only"` makes the build fail if a Client Component imports the module (importing a `type` from it is fine).
- Return only what the page renders (plain JSON values: no class instances, no secrets).
- Secrets come from `process.env`, read only here. Never prefix them with `NEXT_PUBLIC_` (that ships them to the browser).
- Data kept in a module-level variable (as the todo example does) is lost when the server restarts and is not shared between server instances. For data that must stay, use a database or an API, read in this module.

## 2. Read it in the page

```tsx
import { listNotes, NOTE_MAX_CHARS } from "#/server/notes";

export const dynamic = "force-dynamic";

export default async function NotesPage({ params }: { params: LocaleParams }) {
	const i18n = i18nFor(await pageLocale(params));
	const notes = await listNotes();
	return (
		<>
			<h1>{i18n._("Notes")}</h1>
			<NoteList notes={notes} maxChars={NOTE_MAX_CHARS} />
		</>
	);
}
```

## 3. Change it: `src/server/note-actions.ts`

```ts
"use server";

import { refresh } from "next/cache";
import { z } from "zod";
import { insertNote, NOTE_MAX_CHARS } from "./notes";

const addInput = z.object({ text: z.string().trim().min(1).max(NOTE_MAX_CHARS) });

export async function addNote(input: z.input<typeof addInput>) {
	const { text } = addInput.parse(input);
	await insertNote(text);
	refresh();
}
```

- Every exported function of a `"use server"` file is a public endpoint anyone can call with any value: parse the input with zod on its first line. Lengths, ids, enums are all checked there.
- `refresh()` makes the page the visitor is on read its data again. To refresh another page too, `revalidatePath("/notes")`.
- Only `async` functions may be exported from a `"use server"` file: keep types and constants in `notes.ts`.

## 4. Call it from a Client Component

```tsx
"use client";

import { useLingui } from "@lingui/react";
import { useState, useTransition } from "react";
import { addNote } from "#/server/note-actions";
import type { Note } from "#/server/notes";

export function NoteList({ notes, maxChars }: { notes: readonly Note[]; maxChars: number }) {
	const { i18n } = useLingui();
	const [text, setText] = useState("");
	const [saving, startSaving] = useTransition();
	// ... a form whose submit runs:
	// startSaving(async () => { await addNote({ text }); setText(""); });
}
```

For a checkbox or toggle that must change at once, show the new state with `useOptimistic` inside the transition, as `TodoRow` in `src/components/TodoList.tsx` does.

## 5. Verify

`bun run verify`, then try the page: the change shows, and survives a reload while the server runs.
