import type { FetchOverrideType } from "_stores/anki-dist/anki.store.types.mjs";
import type { OnFetchOverrideCallback } from "../anki-iframe/anki-iframe.types.mts";
import type { AnkiScreenProps } from "../AnkiScreen.types.mts";

type OnFetchCallbackSourceProps = Pick<AnkiScreenProps, "fetchOverride"> & {};

export type OnFetchCallback = (
  s: OnFetchCallbackSourceProps,
) => OnFetchOverrideCallback;
type OtherEndsProps = OnFetchCallbackSourceProps & {
  original: typeof window.fetch;
  url: URL | RequestInfo;
};

export interface FetchRule {
  title: string;
  type: FetchOverrideType;
  test: (url: OtherEndsProps["url"]) => boolean;
}
