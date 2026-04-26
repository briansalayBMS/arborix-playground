import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Pin tracing to this app when a parent folder has its own package-lock (Next would
 * otherwise infer the wrong workspace root).
 *
 * Stale Webpack runtime (chunk graph out of sync), e.g.:
 * - `Cannot find module './611.js'`
 * - `__webpack_modules__[moduleId] is not a function`
 *
 * Recovery:
 * 1. Stop every `next dev` / `next start` for this repo (only one process may own `.next`).
 * 2. Run `npm run clean` (removes `.next` + `node_modules/.cache`).
 * 3. Start once: `npm run dev` or `npm run dev:clean` or `npm run build && npm run start`.
 * 4. Hard-refresh the browser (or disable cache for localhost) so old chunk URLs are not reused.
 *
 * DevTools 404s for names like `layout.css`, `main-app.js`, `app-pages-internals.js`, `page.js`:
 * the tab still has *old* `/_next/static/...` URLs from a prior build or server instance; the current
 * dev server generated new hashed filenames. Fix: clean + single server + full reload (not SPA-only).
 */
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  /** Ensure Visx is compiled with the same toolchain as the app (fewer Webpack edge cases). */
  transpilePackages: ["@visx/group", "@visx/responsive", "@visx/scale"],
};

export default nextConfig;
