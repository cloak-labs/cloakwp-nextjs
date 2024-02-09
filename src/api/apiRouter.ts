import { NextApiRequest, NextApiResponse } from "next";
import { validateRouteSecretToken } from "cloakwp/auth";
import { revalidatePage } from "./revalidatePage";
import { enablePreviewMode } from "./enablePreviewMode";
import { exitPreviewMode } from "./exitPreviewMode";
import { verifyUserAuthStatus } from "./verifyUserAuthStatus";

export function withSecretValidation(req, res, callback) {
  const { secret } = req.query;
  const { error } = validateRouteSecretToken(secret);
  return error ? res.status(401).json(error) : callback(req, res);
}

export function apiRouter(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const slug = req.query.route;

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
