import { createHmac, timingSafeEqual } from "node:crypto";
import { getPreviewParams, type PreviewModeParams } from "cloakwp/preview";

export const previewCookieName = "__cloakwp_preview";

export type CloakWpPreview = {
  pathname: string;
  data: PreviewModeParams;
};

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret)
    .update("cloakwp:app-preview:v1:")
    .update(payload)
    .digest();
}

export function sealPreviewSession(
  preview: CloakWpPreview,
  secret: string,
  maxAge: number,
  now = Date.now(),
): string {
  const payload = Buffer.from(
    JSON.stringify({ ...preview, expires: now + maxAge * 1000 }),
  ).toString("base64url");
  return `${payload}.${signature(payload, secret).toString("base64url")}`;
}

export function openPreviewSession(
  value: string | undefined,
  secret: string,
  now = Date.now(),
): CloakWpPreview | undefined {
  if (!value || !secret || value.length > 4096) return;
  const segments = value.split(".");
  if (segments.length !== 2) return;
  const [payload, digest] = segments;
  if (!/^[\w-]+$/.test(payload) || !/^[\w-]{43}$/.test(digest)) return;
  const supplied = Buffer.from(digest, "base64url");
  const expected = signature(payload, secret);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  )
    return;

  try {
    const { pathname, data, expires } = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      typeof pathname !== "string" ||
      !pathname.startsWith("/") ||
      !Number.isSafeInteger(expires) ||
      expires <= now ||
      typeof data?.postId !== "string" ||
      typeof data?.postType !== "string" ||
      typeof data?.revisionId !== "string"
    )
      return;
    const params = getPreviewParams(
      data.revisionId,
      data.postId,
      data.postType,
    );
    if (!("error" in params)) return { pathname, data: params };
  } catch {
    // Invalid session data never enables a privileged WordPress fetch.
  }
}
