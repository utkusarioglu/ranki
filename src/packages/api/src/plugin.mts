import type * as ohm from "ohm-js";
import type { RankiConfig } from "./config.mjs";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;

interface RankiPluginCommon {
  version: string; // semver
  name: string;
}

export interface RankiPluginParser extends RankiPluginCommon {
  type: "parser";
  // name: string;
  dependencies: string[];
  grammar: (c: RankiConfig) => string;
  // parser: (specs) => getLevel(specs, "1-config"),
  // parser: (specs: PluginParserSpecs) => PluginParserGrammar;
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
