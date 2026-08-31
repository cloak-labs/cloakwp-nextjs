export function resolveWarmUrl(origin: string, path: string): string {
  const normalized = path && path !== "/" ? path : "/";
  return new URL(normalized, origin).toString();
}

export function vercelBypassHeaders(): HeadersInit {
  const headers: HeadersInit = {};
  const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (bypass) {
    headers["x-vercel-protection-bypass"] = bypass;
  }
  return headers;
}

export async function warmPaths(
  origin: string,
  paths: readonly string[],
): Promise<void> {
  if (process.env.CLOAKWP_SKIP_CACHE_WARM === "1") {
    return;
  }

  const headers = vercelBypassHeaders();
  await Promise.allSettled(
    paths.map(async (path) => {
      const warmUrl = resolveWarmUrl(origin, path);
      try {
        await fetch(warmUrl, {
          method: "GET",
          cache: "no-store",
          headers,
        });
      } catch (error) {
        console.error("Cache warm after revalidate failed:", warmUrl, error);
      }
    }),
  );
}
