import { handleCloakWpRequest } from "cloakwp/rest";
import { type NextApiRequest, type NextApiResponse } from "next";
import { warmPaths } from "../warmCache.js";
import { resolveCloakWpSession } from "../resolveSession.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: NextApiRequest): Promise<string | undefined> {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf8");
}

function requestOrigin(req: NextApiRequest): { origin: string; protocol: string } {
  const forwardedProtocol = req.headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProtocol)
    ? forwardedProtocol[0]
    : forwardedProtocol ?? "http";
  const host = req.headers.host ?? "localhost";
  return { origin: `${protocol}://${host}`, protocol };
}

function toWebRequest(req: NextApiRequest, body?: string): Request {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      headers.set(name, value.join(", "));
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  }

  const { origin } = requestOrigin(req);

  return new Request(`${origin}${req.url ?? "/"}`, {
    method: req.method,
    headers,
    body,
  });
}

async function sendWebResponse(
  response: Response,
  res: NextApiResponse,
): Promise<void> {
  response.headers.forEach((value, name) => {
    const lower = name.toLowerCase();
    if (lower === "set-cookie") {
      const current = res.getHeader("Set-Cookie");
      if (!current) {
        res.setHeader("Set-Cookie", value);
      } else if (Array.isArray(current)) {
        res.setHeader("Set-Cookie", [...current, value]);
      } else {
        res.setHeader("Set-Cookie", [String(current), value]);
      }
      return;
    }
    res.setHeader(name, value);
  });
  const body = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json") && body !== "") {
    res.status(response.status).json(JSON.parse(body));
    return;
  }

  res.status(response.status).send(body);
}

/**
 * Pages Router catch-all for `/pages/api/cloakwp/[[...route]].ts`.
 *
 * Preview cookies are pathname-scoped (`setPreviewData` / `clearPreviewData`
 * `path` option). Session cookies are set by the protocol handler. Revalidation
 * warms paths in the background after `res.revalidate`.
 */
export async function apiRouter(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const route = Array.isArray(req.query.route)
    ? req.query.route
    : [req.query.route].filter((segment): segment is string => !!segment);

  const { origin } = requestOrigin(req);
  const request = toWebRequest(req, await readRawBody(req));
  const response = await handleCloakWpRequest(request, {
    route,
    secret: process.env.CLOAKWP_AUTH_SECRET,
    revalidatePath: (path) => res.revalidate(path),
    scheduleCacheWarming: (paths) => {
      void warmPaths(origin, paths);
    },
    enablePreviewMode: ({ data, pathname, maxAge }) => {
      res.setPreviewData(data, { maxAge, path: pathname });
    },
    exitPreviewMode: (pathname) => {
      res.clearPreviewData({ path: pathname });
    },
    session: resolveCloakWpSession(),
  });

  await sendWebResponse(response, res);
}
