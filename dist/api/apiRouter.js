import { validateRouteSecretToken } from "cloakwp/auth";
import { revalidatePage } from "./revalidatePage";
import { enablePreviewMode } from "./enablePreviewMode";
import { exitPreviewMode } from "./exitPreviewMode";
import { verifyUserAuthStatus } from "./verifyUserAuthStatus";
export function withSecretValidation(req, res, callback) {
    const { secret } = req.query;
    const { error } = validateRouteSecretToken(secret);
    if (error) {
        console.error("Secret Validation Error:", error);
        return res.status(401).json(error);
    }
    return callback(req, res);
}
export function apiRouter(req, res) {
    const slug = req.query.route;
    console.log("API Request:", slug);
    switch (slug[0]) {
        case "is-authenticated":
            return verifyUserAuthStatus(req, res);
        case "revalidate":
            return withSecretValidation(req, res, revalidatePage);
        case "preview":
            return withSecretValidation(req, res, enablePreviewMode);
        case "exit-preview":
            return exitPreviewMode(req, res);
        default:
            res.statusCode = 404;
            res.end();
    }
}
