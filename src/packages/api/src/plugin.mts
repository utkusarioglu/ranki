import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "./config.mjs";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;

interface RankiPluginMeta {
  version: string; // semver
  name: string;
}

export interface RankiPluginParser {
  type: "parser";
  meta: RankiPluginMeta;
  dependencies: string[];
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
}

export interface RankiPluginRenderer extends RankiPluginMeta {
  type: "renderer";
  // name: string;
  // !TODO
}

export interface RankiPluginParserGrammar {
  // raw: string;
  altered: string;
  // grammar: ohm.Grammar;
}

export interface RankiPluginParserSpecs {
  // grammarCb: (typeof ohm)["grammar"];
  versionPath: string;
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}
