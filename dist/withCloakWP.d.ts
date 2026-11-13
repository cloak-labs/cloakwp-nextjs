import { type NextConfig } from "next";
/**
 * Merge CloakWP Next.js config. The public login URL is `/_admin`.
 * App Router treats `_`-prefixed folders as private, so that URL rewrites
 * to the shared `/cloakwp/login` page each frontend mounts. The previous
 * `/__cloakwp/login` path redirects there. WordPress wp-admin logout hits
 * `/api/cloakwp/auth/logout` directly so cookies clear on GET.
 */
export declare function withCloakWP(userNextConfig?: NextConfig): NextConfig;
//# sourceMappingURL=withCloakWP.d.ts.map