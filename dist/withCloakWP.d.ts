import { type NextConfig } from "next";
/**
 * Merge CloakWP Next.js config. Rewrites `/__cloakwp/{login,logout}` to the
 * implementable `/cloakwp/*` routes (App Router treats `_`-prefixed
 * folders as private). WordPress wp-admin logout hits
 * `/api/cloakwp/auth/logout` directly so cookies clear on GET.
 */
export declare function withCloakWP(userNextConfig?: NextConfig): NextConfig;
//# sourceMappingURL=withCloakWP.d.ts.map