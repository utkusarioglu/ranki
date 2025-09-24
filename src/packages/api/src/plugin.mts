import type * as ohm from "ohm-js";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;

export interface RankiPluginParser {
  type: "parser";
  name: string;
  dependencies: string[];
  grammar: string;
  // parser: (specs) => getLevel(specs, "1-config"),
  // parser: (specs: PluginParserSpecs) => PluginParserGrammar;
}

export interface RankiPluginRenderer {
  type: "renderer";
  name: string;
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
