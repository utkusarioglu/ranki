import type {
  FetchOverrideType,
  RankiFetchOverrideMode,
  RankiOnEvent,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { OnFetchOverrideCallback } from "./anki-iframe/anki-iframe.types.mts";
import type { AnkiScreenProps } from "./AnkiScreen.types.mts";

type OnFetchCallbackSourceProps = Pick<AnkiScreenProps, "fetchOverride"> & {
  onEvent: RankiOnEvent;
};

export type OnFetchCallback = (
  s: OnFetchCallbackSourceProps,
) => OnFetchOverrideCallback;

export const onFetchCallback: OnFetchCallback =
  ({ onEvent, fetchOverride }) =>
  (original) =>
  (url) => {
    let mode = fetchOverride.all;
    if (mode === "passthru") {
      mode = otherEnds({ onEvent, fetchOverride, original, url });
    }

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

type OtherEndsProps = OnFetchCallbackSourceProps & {
  original: typeof window.fetch;
  url: URL | RequestInfo;
};

type OtherEnds = (o: OtherEndsProps) => RankiFetchOverrideMode;

interface FetchRule {
  title: string;
  type: FetchOverrideType;
  test: (url: OtherEndsProps["url"]) => boolean;
}

export const FETCH_RULES: FetchRule[] = [
  {
    title: "Telemetry",
    type: "telemetry" as const,
    test: (u) => ["8080", "file-batch"].some((v) => u.toString().includes(v)),
  },
];

const otherEnds: OtherEnds = ({ onEvent, fetchOverride, url }) => {
  for (const rule of FETCH_RULES) {
    if (!rule.test(url)) continue;
    onEvent({ log: `Fetch override: ${rule.type}: ${url.toString()}` });
    return fetchOverride[rule.type];
  }
  return "passthru";
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
