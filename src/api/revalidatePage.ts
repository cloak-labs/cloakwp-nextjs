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

    const result = { page: pathname, revalidated: true };
    console.log('Page Revalidation Result:', result);
    return res.json(result);
  } catch (error) {
    console.error('Page Revalidation Error:', error);
    return res.status(500).send({ error: error, path: pathname });
  }
}
