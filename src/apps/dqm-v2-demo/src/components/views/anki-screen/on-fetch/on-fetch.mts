import { FETCH_RULES } from "./on-fetch.constants.mts";
import type { OnFetchCallback } from "./on-fetch.types.mts";

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

    console.log(`Fetch ${active} ${mode}: ${url.toString()}`);
    switch (mode) {
      case "autoFail":
        return autoFail();
      case "autoSucceed":
        return autoSucceed();
      case "autoThrow":
        return autoThrow();
      case "passthru":
        return original(url);
    }
  };

function autoFail() {
  return Promise.reject(
    new Response(JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 404,
    }),
  );
}

function autoSucceed() {
  return Promise.resolve(
    new Response(JSON.stringify({}), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }),
  );
}

function autoThrow() {
  return Promise.reject(new Error("Simulated network failure"));
}
