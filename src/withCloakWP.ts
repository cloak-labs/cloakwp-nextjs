import { type NextConfig } from "next";

const loginRewrite = {
  source: "/__cloakwp/login",
  destination: "/cloakwp/login",
};

/**
 * Merge CloakWP Next.js config. Rewrites `/__cloakwp/login` to the
 * implementable `/cloakwp/login` route (App Router treats `_`-prefixed
 * folders as private).
 */
export function withCloakWP(userNextConfig: NextConfig = {}): NextConfig {
  const userRewrites = userNextConfig.rewrites;

  return {
    ...userNextConfig,
    async rewrites() {
      const resolved =
        typeof userRewrites === "function" ? await userRewrites() : userRewrites;

      if (!resolved) {
        return [loginRewrite];
      }

      if (Array.isArray(resolved)) {
        return [loginRewrite, ...resolved];
      }

      return {
        ...resolved,
        beforeFiles: [loginRewrite, ...(resolved.beforeFiles ?? [])],
      };
    },
  };
}
