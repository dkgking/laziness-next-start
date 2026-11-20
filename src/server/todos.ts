import "server-only";

export type Todo = {
	id: string;
	title: string;
	done: boolean;
	createdAt: string;
};

export const TODO_TITLE_MAX_CHARS = 200;

// Kept in the server's memory: it resets whenever the server restarts.
// Swap this module's body for a database when the app needs to keep data.
// On globalThis, since the dev server loads this module again on each edit.
const store = globalThis as typeof globalThis & { todos?: Map<string, Todo> };
store.todos ??= new Map<string, Todo>();
const todos = store.todos;

export const listTodos = async (): Promise<Todo[]> =>
	[...todos.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

export const insertTodo = async (title: string): Promise<Todo> => {
	const todo: Todo = {
		id: crypto.randomUUID(),
		title,
		done: false,
		createdAt: new Date().toISOString(),
	};
	todos.set(todo.id, todo);
	return todo;
};

export const updateTodoDone = async (id: string, done: boolean) => {
	const todo = todos.get(id);
	if (todo) todos.set(id, { ...todo, done });
};

export const removeTodo = async (id: string) => {
	todos.delete(id);
};
