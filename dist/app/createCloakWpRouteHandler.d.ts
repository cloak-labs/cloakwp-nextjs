/**
 * App Router handlers for `/api/cloakwp/[[...route]]`.
 *
 * Preview uses Draft Mode plus a pathname-scoped `__cloakwp_preview_data`
 * cookie. Revalidation calls `revalidatePath` and warms those paths after
 * the response. Session cookies and wp-admin handshakes are handled by
 * `auth/*` on the same catch-all.
 *
 * ```ts
 * import { createCloakWpRouteHandler } from "@cloakwp/nextjs/app";
 *
 * export const { GET, POST, PUT, PATCH, DELETE } = createCloakWpRouteHandler();
 * ```
 */
export declare function createCloakWpRouteHandler(): {
    GET: (req: Request) => Promise<Response>;
    POST: (req: Request) => Promise<Response>;
    PUT: (req: Request) => Promise<Response>;
    PATCH: (req: Request) => Promise<Response>;
    DELETE: (req: Request) => Promise<Response>;
};
//# sourceMappingURL=createCloakWpRouteHandler.d.ts.map