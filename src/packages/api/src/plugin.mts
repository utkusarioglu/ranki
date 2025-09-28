import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "./config.mjs";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;

interface RankiPluginCommon {
  version: string; // semver
  name: string;
}

export interface RankiPluginParser extends RankiPluginCommon {
  type: "parser";
  dependencies: string[];
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
}

export interface RankiPluginRenderer extends RankiPluginCommon {
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
