import { handleCloakWpRequest } from "cloakwp/rest";
import { warmPaths } from "../warmCache.js";
import { resolveCloakWpSession, readProcessEnv } from "../resolveSession.js";
import { previewCookieName, sealPreviewSession } from "./previewSession.js";
/**
 * App Router handlers for `/api/cloakwp/[[...route]]`.
 *
 * Preview uses Draft Mode plus a signed, pathname-scoped session cookie. Revalidation calls `revalidatePath` and warms those paths after
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
        const secret = readProcessEnv("CLOAKWP_AUTH_SECRET");
        return handleCloakWpRequest(req, {
            route,
            secret,
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
                const options = {
                    httpOnly: true,
                    sameSite: secure ? "none" : "lax",
                    secure,
                    path: pathname,
                    maxAge,
                };
                cookieStore.set(previewCookieName, sealPreviewSession({ data, pathname }, secret, maxAge), options);
                // Keep the old cookie for integrations that consume it themselves.
                cookieStore.set("__cloakwp_preview_data", JSON.stringify(data), options);
            },
            async exitPreviewMode(pathname) {
                const draft = await draftMode();
                draft.disable();
                const cookieStore = await cookies();
                for (const name of [previewCookieName, "__cloakwp_preview_data"]) {
                    cookieStore.set(name, "", {
                        httpOnly: true,
                        sameSite: secure ? "none" : "lax",
                        secure,
                        path: pathname,
                        maxAge: 0,
                    });
                }
            },
            session: resolveSession(options),
        });
    };
}
