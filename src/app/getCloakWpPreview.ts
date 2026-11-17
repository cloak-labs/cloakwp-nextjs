import { readProcessEnv } from "../resolveSession.js";
import {
  openPreviewSession,
  previewCookieName,
  type CloakWpPreview,
} from "./previewSession.js";

/** Reads the verified preview session from an App Router server render. */
export async function getCloakWpPreview(): Promise<CloakWpPreview | undefined> {
  const { cookies, draftMode } = await import("next/headers");
  if (!(await draftMode()).isEnabled) return;
  // Keep cookies() out of normal public renders so static routes can stay static.
  const cookieStore = await cookies();
  return openPreviewSession(
    cookieStore.get(previewCookieName)?.value,
    readProcessEnv("CLOAKWP_AUTH_SECRET"),
  );
}
