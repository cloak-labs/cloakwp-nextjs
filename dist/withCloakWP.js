const cloakWpRedirects = [
    {
        source: "/__cloakwp/login",
        destination: "/_admin",
        permanent: false,
    },
];
const cloakWpRewrites = [
    {
        source: "/_admin",
        destination: "/cloakwp/login",
    },
    {
        source: "/__cloakwp/logout",
        destination: "/cloakwp/logout",
    },
];
/**
 * Merge CloakWP Next.js config. The public login URL is `/_admin`.
 * App Router treats `_`-prefixed folders as private, so that URL rewrites
 * to the shared `/cloakwp/login` page each frontend mounts. The previous
 * `/__cloakwp/login` path redirects there. WordPress wp-admin logout hits
 * `/api/cloakwp/auth/logout` directly so cookies clear on GET.
 */
export function withCloakWP(userNextConfig = {}) {
    const userRewrites = userNextConfig.rewrites;
    const userRedirects = userNextConfig.redirects;
    return {
        ...userNextConfig,
        async redirects() {
            const resolved = typeof userRedirects === "function"
                ? await userRedirects()
                : userRedirects;
            return [...cloakWpRedirects, ...(resolved ?? [])];
        },
        async rewrites() {
            const resolved = typeof userRewrites === "function"
                ? await userRewrites()
                : userRewrites;
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
