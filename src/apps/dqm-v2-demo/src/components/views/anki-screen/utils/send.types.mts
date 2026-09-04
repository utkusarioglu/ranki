import type {
  FetchOverrideRecord,
  RankiContentType,
} from "_stores/anki-dist/anki.store.types.mjs";
import type { IDqmRendererClientPreferences } from "@dqm/package-dqm-api-v2";

export type RankiIframeMessage =
  | RankiIframeMessageFetch
  | RankiIframeMessageUpdate;

export interface RankiIframeMessageFetch {
  fetchOverride: FetchOverrideRecord;
  type: "ranki-fetch";
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
