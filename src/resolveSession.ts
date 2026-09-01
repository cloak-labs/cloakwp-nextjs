import { ContentSourceRegistry } from "cloakwp/cms";
import { DEFAULT_LOGIN_PATH } from "cloakwp/auth";
import { type CloakWpSessionOptions } from "cloakwp/rest";

/**
 * Next.js webpack inlines `process.env.FOO` from the app's `.env*` files.
 * Workspace-root secrets (loaded in `next.config`) are on `process.env` at
 * runtime but would compile to `undefined` with dot access.
 */
export function readProcessEnv(name: string): string {
  return process.env[name] ?? "";
}

export function resolveCloakWpSession(): CloakWpSessionOptions {
  let wordpressUrl = "";
  try {
    const wp = ContentSourceRegistry.get("wp");
    wordpressUrl = wp.getProjectUrl() || wp.getActiveUrl();
  } catch {
    wordpressUrl = readProcessEnv("WORDPRESS_URL");
  }

  return {
    wordpressUrl,
    secret:
      readProcessEnv("CLOAKWP_SESSION_SECRET") ||
      readProcessEnv("CLOAKWP_AUTH_SECRET"),
    loginPath: readProcessEnv("CLOAKWP_LOGIN_PATH") || DEFAULT_LOGIN_PATH,
  };
}
