import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import {
	syncLocaleRoutes,
	watchLocaleRoutes,
} from "./scripts/locale-routes.ts";

/**
 * The address Web Studio shows the dev server at: Next.js refuses its dev
 * resources to any origin it was not told about.
 */
const previewHosts = process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS;

const config: NextConfig = {
	reactCompiler: true,
	allowedDevOrigins: previewHosts ? [`*${previewHosts}`] : [],
};

export default function nextConfig(phase: string): NextConfig {
	// The other locales' routes mirror src/app/(site): scripts/locale-routes.ts.
	syncLocaleRoutes();
	if (phase === PHASE_DEVELOPMENT_SERVER) watchLocaleRoutes();
	return config;
}
