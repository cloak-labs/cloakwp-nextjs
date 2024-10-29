import { stripTrailingSlash } from "cloakwp/cms";
import { NextApiRequest, NextApiResponse } from "next";

export async function revalidatePage(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { pathname } = req.query;
  pathname = stripTrailingSlash(pathname as string);

  try {
    await res.revalidate(pathname).catch((err) => {
      throw `Page Revalidation ${err}`;
    });

    return res.json({ page: pathname, revalidated: true });
  } catch (error) {
    return res.status(500).send({ error: error, path: pathname });
  }
}
