"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidatePage = void 0;
// TODO: need to re-export this utility function from 'cloakcms' out of "cloakwp"
const cloakwp_1 = require("cloakwp");
async function revalidatePage(req, res) {
    let { pathname } = req.query;
    pathname = (0, cloakwp_1.stripTrailingSlash)(pathname);
    try {
        await res.revalidate(pathname).catch((err) => {
            throw `Page Revalidation ${err}`;
        });
        return res.json({ page: pathname, revalidated: true });
    }
    catch (error) {
        return res.status(500).send({ error: error, path: pathname });
    }
}
exports.revalidatePage = revalidatePage;
