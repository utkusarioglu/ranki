import type { FetchOverrideType } from "_stores/anki-dist/anki.store.types.mjs";

import type { OnFetchOverrideCallback } from "../anki-iframe/anki-iframe.types.mts";
import type { AnkiScreenProps } from "../AnkiScreen.types.mts";

export interface FetchRule {
  test: (url: OtherEndsProps["url"]) => boolean;
  title: string;
  type: FetchOverrideType;
}

export type OnFetchCallback = (
  s: OnFetchCallbackSourceProps,
) => OnFetchOverrideCallback;
type OnFetchCallbackSourceProps = Pick<AnkiScreenProps, "fetchOverride">;

type OtherEndsProps = {
  original: typeof window.fetch;
  url: RequestInfo | URL;
} & OnFetchCallbackSourceProps;
