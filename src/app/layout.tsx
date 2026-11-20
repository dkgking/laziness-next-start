import type { ReactNode } from "react";

// The document (<html>, <body>) is made by src/app/(site)/layout.tsx, which
// knows the page's locale; this root only has to exist.
export default function RootLayout({ children }: { children: ReactNode }) {
	return children;
}
