import assert from "node:assert/strict";
import { test } from "node:test";
import {
  openPreviewSession,
  sealPreviewSession,
} from "../dist/app/previewSession.js";

test("only a correctly signed and unexpired cookie supplies an App Router draft", () => {
  const preview = {
    pathname: "/projects/example",
    data: {
      postId: "42",
      postType: "project",
      apiMethod: "project",
      revisionId: "",
    },
  };
  const secret = "session secret";
  const now = 20_000;
  const session = sealPreviewSession(preview, secret, 60, now);
  const [payload, mac] = session.split(".");
  const altered = JSON.parse(Buffer.from(payload, "base64url"));
  altered.data.postId = "200";
  const forged =
    Buffer.from(JSON.stringify(altered)).toString("base64url") + "." + mac;

  assert.deepEqual(openPreviewSession(session, secret, now + 1000), preview);
  assert.equal(openPreviewSession(forged, secret, now + 1000), undefined);
  assert.equal(
    openPreviewSession(session, "other secret", now + 1000),
    undefined,
  );
  assert.equal(openPreviewSession(session, secret, now + 60_000), undefined);
  assert.equal(
    openPreviewSession(JSON.stringify(preview.data), secret, now),
    undefined,
  );
});
