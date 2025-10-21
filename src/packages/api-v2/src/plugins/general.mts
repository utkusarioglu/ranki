import type { RankiPluginParser } from "./parser.mjs";

export type RankiPlugin = RankiPluginParser;

export type RankiPluginCommon = {
  meta: RankiPluginMeta;
};

export interface RankiPluginMeta {
  version: string; // semver
  name: string;
}
