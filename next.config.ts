import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import {
	syncLocaleRoutes,
	watchLocaleRoutes,
} from "./scripts/locale-routes.ts";

/**
 * The host Web Studio shows the dev server under (each preview is a
 * subdomain of it): Next.js refuses its dev resources to any origin it was
 * not told about.
 */
const previewHost = process.env.LAZINESS_PREVIEW_HOST;

const config: NextConfig = {
	reactCompiler: true,
	allowedDevOrigins: previewHost ? [`*.${previewHost}`] : [],
};

export default function nextConfig(phase: string): NextConfig {
	// The other locales' routes mirror src/app/(site): scripts/locale-routes.ts.
	syncLocaleRoutes();
	if (phase === PHASE_DEVELOPMENT_SERVER) watchLocaleRoutes();
	return config;
}
