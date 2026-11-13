import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { Readable } from "node:stream";
import { test } from "node:test";
import { apiRouter, config } from "../dist/api/apiRouter.js";

const secret = "correct horse battery staple";

test("Pages Router preserves the raw body for signed batched ISR", async () => {
  const body = JSON.stringify({ paths: ["/pages-router"] });
  const timestamp = "1893455000";
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  const request = Object.assign(Readable.from([body]), {
    method: "POST",
    url: "/api/cloakwp/revalidate",
    query: { route: ["revalidate"] },
    headers: {
      host: "site.test",
      "content-type": "application/json",
      "x-cloakwp-timestamp": timestamp,
      "x-cloakwp-signature": `sha256=${signature}`,
    },
  });
  const revalidated = [];
  const result = {};
  const response = {
    setHeader() {},
    status(status) {
      result.status = status;
      return this;
    },
    json(bodyValue) {
      result.body = bodyValue;
    },
    send(bodyValue) {
      result.body = bodyValue;
    },
    async revalidate(path) {
      revalidated.push(path);
    },
    setPreviewData() {},
    clearPreviewData() {},
  };

  process.env.CLOAKWP_AUTH_SECRET = secret;
  process.env.CLOAKWP_SKIP_CACHE_WARM = "1";
  const originalNow = Date.now;
  Date.now = () => 1_893_455_000_000;
  try {
    await apiRouter(request, response);
  } finally {
    Date.now = originalNow;
  }

  assert.equal(config.api.bodyParser, false);
  assert.equal(result.status, 200);
  assert.deepEqual(revalidated, ["/pages-router"]);
  assert.equal(result.body.ok, true);
});

test("resolveWarmUrl keeps root as /", async () => {
  const { resolveWarmUrl } = await import("../dist/warmCache.js");
  assert.equal(resolveWarmUrl("https://site.test", "/"), "https://site.test/");
  assert.equal(
    resolveWarmUrl("https://site.test", "/about"),
    "https://site.test/about",
  );
});

test("withCloakWP serves /_admin and keeps the old login path", async () => {
  const { withCloakWP } = await import("../dist/withCloakWP.js");
  const config = withCloakWP();
  const rewrites = await config.rewrites();
  const redirects = await config.redirects();
  assert.deepEqual(rewrites.slice(0, 2), [
    {
      source: "/_admin",
      destination: "/cloakwp/login",
    },
    {
      source: "/__cloakwp/logout",
      destination: "/cloakwp/logout",
    },
  ]);
  assert.deepEqual(redirects[0], {
    source: "/__cloakwp/login",
    destination: "/_admin",
    permanent: false,
  });
});

test("readProcessEnv looks up env at runtime", async () => {
  const { readProcessEnv } = await import("../dist/resolveSession.js");
  const key = "CLOAKWP_TEST_RUNTIME_ENV";
  process.env[key] = "from-runtime";
  assert.equal(readProcessEnv(key), "from-runtime");
  delete process.env[key];
  assert.equal(readProcessEnv(key), "");
});
