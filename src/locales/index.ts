import type { Locale } from "#/libs/locales";
import en from "./en.json";

/**
 * Every locale's catalog (the message id is the English text). A locale
 * without its line here fails the type check: see .claude/skills/add-locale.
 */
export const catalogs = { en } satisfies Record<Locale, Record<string, string>>;
