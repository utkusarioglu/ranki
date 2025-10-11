import type * as ohm from "ohm-js";
import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "./config.mjs";
import {
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
} from "./context.mjs";
import { RankiLangParseHandlerHooks } from "./rankilang.mjs";

export type RankiPlugin = RankiPluginParser | RankiPluginRenderer;

interface RankiPluginMeta {
  version: string; // semver
  name: string;
}

// export type RankiLangParseHandlerHooks = {
//   lang: RankiLangInstance;
//   clone: (
//     providedConfigs: RankiLanguageProvidedConfig[] | null,
//   ) => RankiLangInstance;
// };

export type RankiLangParseHandlerFunction<
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = (
  raw: string,
  spec: RankiLangParseSpecs<HandlerShape>,
  hooks: RankiLangParseHandlerHooks,
) => RankiLangParseResult;

export type RankiPluginParser<
  ConfigShape = {},
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = {
  type: "parser";
  meta: RankiPluginMeta;
  handler?: RankiLangParseHandlerFunction<HandlerShape>;
  dependencies: string[];
  config: ConfigShape;
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
};

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
