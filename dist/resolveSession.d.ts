import { type CloakWpSessionOptions } from "cloakwp/rest";
/**
 * Next.js webpack inlines `process.env.FOO` from the app's `.env*` files.
 * Workspace-root secrets (loaded in `next.config`) are on `process.env` at
 * runtime but would compile to `undefined` with dot access.
 */
export declare function readProcessEnv(name: string): string;
export declare function resolveCloakWpSession(): CloakWpSessionOptions;
//# sourceMappingURL=resolveSession.d.ts.map