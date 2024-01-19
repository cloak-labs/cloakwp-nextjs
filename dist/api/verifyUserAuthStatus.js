"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUserAuthStatus = void 0;
const cloakwp_1 = require("cloakwp");
async function verifyUserAuthStatus(req, res) {
    const wp = (0, cloakwp_1.getCMSInstance)().client();
    const wpCookie = req.headers.cookie || ""; // Get the WordPress cookies from the client-side request
    wp.setHeaders("Cookie", wpCookie); // include cookies in `isLoggedIn` request we make below
    const isLoggedIn = await wp.isLoggedIn();
    res.json(isLoggedIn);
}
exports.verifyUserAuthStatus = verifyUserAuthStatus;
