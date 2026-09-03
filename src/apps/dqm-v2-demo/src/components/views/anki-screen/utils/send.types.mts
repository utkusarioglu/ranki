import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";
import type {
  FetchOverrideRecord,
  RankiContentType,
} from "_stores/anki-dist/anki.store.types.mjs";

export type RankiIframeMessage =
  | RankiIframeMessageUpdate
  | RankiIframeMessageFetch;

export interface RankiIframeMessageFetch {
  type: "ranki-fetch";
  fetchOverride: FetchOverrideRecord;
}

export interface RankiIframeMessageUpdate {
  ranki: {
    contentType: RankiContentType;
    fields: {
      a: string;
      b: string;
      card: string;
      deck: string;
      face: string;
      flag: string;
      tags: string;
      type: string;
    };
    pref: IDqmRendererClientPreferences;
  };
  type: "ranki-update";
}
