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

test("withCloakWP rewrites /__cloakwp/login onto /cloakwp/login", async () => {
  const { withCloakWP } = await import("../dist/withCloakWP.js");
  const rewrites = await withCloakWP().rewrites();
  assert.deepEqual(rewrites[0], {
    source: "/__cloakwp/login",
    destination: "/cloakwp/login",
  });
});
