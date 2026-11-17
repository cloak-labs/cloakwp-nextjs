# @cloakwp/nextjs

Thin Next.js adapters for CloakWP. Framework-neutral signing, preview-token,
revalidation, and native `Request`/`Response` handling live in `cloakwp`.
Reusable React preview UI lives in `@cloakwp/react`.

This package supports **Pages Router and App Router**. Both adapters call the
same `handleCloakWpRequest` protocol (`preview`, `exit-preview`, `revalidate`,
`auth/authorize`, `auth/token`, `auth/logout`, `auth/wp-admin`).

## Pages Router

Catch-all at `pages/api/cloakwp/[[...route]].ts`:

```ts
import { apiRouter, config } from "@cloakwp/nextjs/api";

export { config };
export default apiRouter;
```

- Preview: Next.js Preview Mode via `setPreviewData` / `clearPreviewData`,
  scoped to the previewed pathname.
- Revalidation: `res.revalidate(path)`, then a background GET to warm the cache.
- Session: httpOnly access/refresh cookies on the frontend origin, then a 302
  to WordPress `establish-session` so `wp_set_auth_cookie()` runs on the CMS
  host. AdminBar Dashboard/Edit links go through `auth/wp-admin`.

Standalone helpers (`enablePreviewMode`, `exitPreviewMode`, `revalidatePage`)
remain for apps that still wire those routes one-by-one.

## App Router

Catch-all at `app/api/cloakwp/[[...route]]/route.ts`:

```ts
import { createCloakWpRouteHandler } from "@cloakwp/nextjs/app";

export const { GET, POST, PUT, PATCH, DELETE } = createCloakWpRouteHandler();
```

- Preview: Draft Mode plus a signed, pathname-scoped HttpOnly cookie.
  Use `getCloakWpPreview()` in server-side page loaders and metadata.
- Revalidation: `revalidatePath`, then `after()` cache warming.
- Session: same cookie + handshake protocol as Pages Router.

In an App Router page loader, read the preview before looking for a published
document by slug. The signed preview identifies the WordPress document by ID,
so it also works for drafts that have no published URL yet:

```ts
import { getCloakWpPreview } from "@cloakwp/nextjs/app";
import { getPreviewData } from "cloakwp/preview";

async function loadDocument(pathname: string) {
  const preview = await getCloakWpPreview();
  if (preview?.pathname === pathname) {
    return getPreviewData(preview.data, await createWordPressServerClient());
  }
  return loadPublishedDocument(pathname);
}
```

Use a server-side WordPress client with permission to read the applicable
drafts and revisions. Use the same loader for metadata and page content.
The route handler validates WordPress's preview token before setting cookies;
the reader only trusts a signed session while Next.js Draft Mode is enabled.

Import App Router adapters from `@cloakwp/nextjs/app` so Pages-only apps do
not load `next/headers` / `next/cache`.

## Login and logout

The public login URL is `/_admin`. `withCloakWP()` rewrites it to
`/cloakwp/login`, because App Router treats `_`-prefixed folders as private.
`/__cloakwp/login` redirects to `/_admin`. Logout stays at `/__cloakwp/logout`,
rewritten to `/cloakwp/logout`.

Each frontend still mounts a thin `app/cloakwp/login/page.tsx` (or
`pages/cloakwp/login.tsx`) that renders `CloakWpLoginPage`. The URL, the
rewrite, and the page UI all live in this package; Next.js only needs that
route file so the rewrite has a page to serve.

WordPress `wp-login.php?action=logout` redirects to `/api/cloakwp/auth/logout`
(GET) so frontend session cookies clear without client JS. AdminBar Log Out
POSTs to the same BFF and then WordPress `establish-logout`.

```ts
import { CloakWpLoginPage, CloakWpLogoutPage } from "@cloakwp/nextjs/login";
```

Machine REST should use Application Passwords (`WP_APPLICATION_USER` +
`WP_APPLICATION_PASSWORD`). `WP_JWT` remains a deprecated server-only fallback
until every site is redeployed.
