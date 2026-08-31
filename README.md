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

- Preview: Draft Mode plus a pathname-scoped `__cloakwp_preview_data` cookie
  (httpOnly). `sameSite: none` on HTTPS so the WP editor iframe can read it.
- Revalidation: `revalidatePath`, then `after()` cache warming.
- Session: same cookie + handshake protocol as Pages Router.

Import App Router adapters from `@cloakwp/nextjs/app` so Pages-only apps do
not load `next/headers` / `next/cache`.

## Login

Default login URL is `/__cloakwp/login` (`withCloakWP()` rewrites that to
`/cloakwp/login`, because App Router treats `_`-prefixed folders as private).

```ts
import { CloakWpLoginPage } from "@cloakwp/nextjs/login";
```

Machine REST should use Application Passwords (`WP_APPLICATION_USER` +
`WP_APPLICATION_PASSWORD`). `WP_JWT` remains a deprecated server-only fallback
until every site is redeployed.
