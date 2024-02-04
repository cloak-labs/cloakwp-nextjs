import { stripTrailingSlash } from "cloakwp";

export async function revalidatePage(req, res) {
  let { pathname } = req.query;
  pathname = stripTrailingSlash(pathname);

  try {
    await res.revalidate(pathname).catch((err) => {
      throw `Page Revalidation ${err}`;
    });

    return res.json({ page: pathname, revalidated: true });
  } catch (error) {
    return res.status(500).send({ error: error, path: pathname });
  }
}
