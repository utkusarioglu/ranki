import type { OnFetchCallback } from "./on-fetch.types.mts";

import { FETCH_RULES } from "./on-fetch.constants.mts";

export const onFetchCallback: OnFetchCallback =
  ({ fetchOverride }) =>
  (original) =>
  (url) => {
    let mode = fetchOverride.all;
    let active: string = "-";
    if (mode === "passthru") {
      for (const rule of FETCH_RULES) {
        if (rule.test(url)) {
          mode = fetchOverride[rule.type];
          active = rule.type;
          break;
        }
      }
    }

    window.top?.postMessage(`Fetch ${active} ${mode}: ${url.toString()}`);
    switch (mode) {
      case "autoFail":
        return respond(404);
      case "autoSucceed":
        return respond(200);
      case "autoThrow":
        return autoThrow();
      case "passthru":
        return original(url);
    }
  };

function autoThrow() {
  return Promise.reject(new Error("Simulated network failure"));
}

function respond(status: number) {
  return Promise.reject(
    new Response(JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json",
      },
      status,
    }),
  );
}
