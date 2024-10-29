import { getPreviewParams } from "cloakwp/preview";
import { NextApiRequest, NextApiResponse } from "next";

export async function enablePreviewMode(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { revisionId, postId, postType, pathname } = req.query;
  const params = getPreviewParams(
    revisionId as string,
    postId as string,
    postType as string
  );

  if ("error" in params) {
    console.error("Preview Mode Error:", params.error);
    return res.status(401).json(params.error);
  }

  console.log("Preview Mode Params:", params);

  // Enable Next.js Preview Mode by setting the cookies
  res.setPreviewData(params, {
    maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
    path: pathname as string, // The preview mode cookies apply to the page we're previewing (visiting any other page turns off preview mode)
  });

  // Redirect to the path of the post we're previewing
  res.writeHead(307, { Location: pathname });
  res.end();
}
