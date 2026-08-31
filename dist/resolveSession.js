import { ContentSourceRegistry } from "cloakwp/cms";
import { DEFAULT_LOGIN_PATH } from "cloakwp/auth";
export function resolveCloakWpSession() {
    let wordpressUrl = "";
    try {
        wordpressUrl = ContentSourceRegistry.get("wp").getActiveUrl();
    }
    catch {
        wordpressUrl = process.env.WORDPRESS_URL ?? "";
    }
    return {
        wordpressUrl,
        secret: process.env.CLOAKWP_SESSION_SECRET ??
            process.env.CLOAKWP_AUTH_SECRET ??
            "",
        loginPath: process.env.CLOAKWP_LOGIN_PATH ?? DEFAULT_LOGIN_PATH,
    };
}
