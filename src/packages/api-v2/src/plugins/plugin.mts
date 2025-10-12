import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import {
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
} from "../lang/context.mjs";
import { RankiLangParseHandlerHooks } from "../lang/rankilang.mjs";

export interface RankiPluginMeta {
  version: string; // semver
  name: string;
}

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

export interface RankiPluginParserSpecs {
  versionPath: string;
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}
