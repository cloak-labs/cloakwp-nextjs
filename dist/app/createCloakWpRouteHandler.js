import { handleCloakWpRequest } from "cloakwp/rest";
import { warmPaths } from "../warmCache.js";
import { resolveCloakWpSession, readProcessEnv } from "../resolveSession.js";
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
export function createCloakWpRouteHandler(options = {}) {
    return {
        GET: createCloakWpHandler(options),
        POST: createCloakWpHandler(options),
        PUT: createCloakWpHandler(options),
        PATCH: createCloakWpHandler(options),
        DELETE: createCloakWpHandler(options),
    };
}
function resolveSession(options) {
    if (typeof options.session === "function") {
        return options.session();
    }
    return options.session ?? resolveCloakWpSession();
}
function createCloakWpHandler(options) {
    return async function handler(req) {
        const { revalidatePath } = await import("next/cache");
        const { after } = await import("next/server");
        const { draftMode, cookies } = await import("next/headers");
        const url = new URL(req.url);
        const pathAfterPrefix = url.pathname.replace(/^\/api\/cloakwp\/?/, "");
        const route = pathAfterPrefix.split("/").filter(Boolean);
        const secure = url.protocol === "https:";
        return handleCloakWpRequest(req, {
            route,
            secret: readProcessEnv("CLOAKWP_AUTH_SECRET"),
            revalidatePath(path) {
                revalidatePath(path);
            },
            scheduleCacheWarming(paths) {
                after(async () => {
                    await warmPaths(url.origin, paths);
                });
            },
            async enablePreviewMode({ data, pathname, maxAge }) {
                const draft = await draftMode();
                draft.enable();
                const cookieStore = await cookies();
                cookieStore.set("__cloakwp_preview_data", JSON.stringify(data), {
                    httpOnly: true,
                    sameSite: secure ? "none" : "lax",
                    secure,
                    path: pathname,
                    maxAge,
                });
            },
            async exitPreviewMode(pathname) {
                const draft = await draftMode();
                draft.disable();
                const cookieStore = await cookies();
                cookieStore.set("__cloakwp_preview_data", "", {
                    httpOnly: true,
                    sameSite: secure ? "none" : "lax",
                    secure,
                    path: pathname,
                    maxAge: 0,
                });
            },
            session: resolveSession(options),
        });
    };
}
