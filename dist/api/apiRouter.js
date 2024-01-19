"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = exports.withSecretValidation = void 0;
const revalidatePage_1 = require("./revalidatePage");
const enablePreviewMode_1 = require("./enablePreviewMode");
const exitPreviewMode_1 = require("./exitPreviewMode");
const cloakwp_1 = require("cloakwp");
const verifyUserAuthStatus_1 = require("./verifyUserAuthStatus");
function withSecretValidation(req, res, callback) {
    const { secret } = req.query;
    const { error } = (0, cloakwp_1.validateRouteSecretToken)(secret);
    return error ? res.status(401).json(error) : callback(req, res);
}
exports.withSecretValidation = withSecretValidation;
function apiRouter(req, res) {
    const slug = req.query.route;
    switch (slug[0]) {
        case "is-authenticated":
            return (0, verifyUserAuthStatus_1.verifyUserAuthStatus)(req, res);
        case "revalidate":
            return withSecretValidation(req, res, revalidatePage_1.revalidatePage);
        case "preview":
            return withSecretValidation(req, res, enablePreviewMode_1.enablePreviewMode);
        case "exit-preview":
            return (0, exitPreviewMode_1.exitPreviewMode)(req, res);
        default:
            res.statusCode = 404;
            res.end();
    }
}
exports.apiRouter = apiRouter;
