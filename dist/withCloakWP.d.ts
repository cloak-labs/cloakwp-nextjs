import { type NextConfig } from "next";
/**
 * Merge CloakWP Next.js config. Rewrites `/__cloakwp/login` to the
 * implementable `/cloakwp/login` route (App Router treats `_`-prefixed
 * folders as private).
 */
export declare function withCloakWP(userNextConfig?: NextConfig): NextConfig;
//# sourceMappingURL=withCloakWP.d.ts.map