import { type NextConfig } from "next";

const cloakWpRewrites = [
  {
    source: "/__cloakwp/login",
    destination: "/cloakwp/login",
  },
  {
    source: "/__cloakwp/logout",
    destination: "/cloakwp/logout",
  },
];

/**
 * Merge CloakWP Next.js config. Rewrites `/__cloakwp/{login,logout}` to the
 * implementable `/cloakwp/*` routes (App Router treats `_`-prefixed
 * folders as private). WordPress wp-admin logout hits
 * `/api/cloakwp/auth/logout` directly so cookies clear on GET.
 */
export function withCloakWP(userNextConfig: NextConfig = {}): NextConfig {
  const userRewrites = userNextConfig.rewrites;

  return {
    ...userNextConfig,
    async rewrites() {
      const resolved =
        typeof userRewrites === "function" ? await userRewrites() : userRewrites;

      if (!resolved) {
        return [...cloakWpRewrites];
      }

      if (Array.isArray(resolved)) {
        return [...cloakWpRewrites, ...resolved];
      }

      return {
        ...resolved,
        beforeFiles: [...cloakWpRewrites, ...(resolved.beforeFiles ?? [])],
      };
    },
  };
}
