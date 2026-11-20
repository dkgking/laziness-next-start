import { UnmatchedPage } from "#/components/UnmatchedPage";
import { allMessages } from "#/libs/i18n-server";
import { defaultLocale } from "#/libs/locales";
import "#/styles.css";

// An address no route matches. It is rendered outside every layout, so it
// makes its own document.
export default function GlobalNotFound() {
	return (
		<html lang={defaultLocale}>
			<body>
				<UnmatchedPage messages={allMessages()} />
			</body>
		</html>
	);
}
