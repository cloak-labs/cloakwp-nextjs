import { getPreviewParams } from "cloakwp/preview";
export async function enablePreviewMode(req, res) {
    let { revisionId, postId, postType, pathname } = req.query;
    const params = getPreviewParams(revisionId, postId, postType);
    if ("error" in params)
        return res.status(401).json(params.error);
    // Enable Next.js Preview Mode by setting the cookies
    res.setPreviewData(params, {
        maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
        path: pathname, // The preview mode cookies apply to the page we're previewing (visiting any other page turns off preview mode)
    });
    // Redirect to the path of the post we're previewing
    res.writeHead(307, { Location: pathname });
    res.end();
}
