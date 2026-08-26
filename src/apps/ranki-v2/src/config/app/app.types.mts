import type { RawFields } from "_collect/collect.types.mjs";
import type { RankiCollectedConfig } from "_config/config.types.mjs";

export interface AppConfigBuildParams {
  collected: RankiCollectedConfig;
  raw: RawFields;
}

export interface AppConfigCreateParams {
  collected: null | RankiCollectedConfig;
  raw: null | RawFields;
}
