import {
  ComponentPluginComponent,
  RankiPluginComponent,
} from "./component.mjs";
import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "./config.mjs";
import {
  ParserPluginsInstance,
  TheaterName,
  RankiLangParseSpecs,
  RankiLangParseResult,
  RankiLangParseFunctionReturn,
  RankiLangAstContext,
  RankiLangParseHandlerCommon,
} from "./context.mjs";
import { RankiPluginParser } from "./plugin.mjs";

export interface ComponentPluginsInstance {
  addPlugin(plugin: RankiPluginComponent): void;
  getPlugin(handler: string, chain: string[]): ComponentPluginComponent;
}

export interface RankiLangInstancePluginsRecord {
  parsers: RankiPluginParser[] | ParserPluginsInstance;
  components: RankiPluginComponent[] | ComponentPluginsInstance;
}

export interface RankiLangInstance {
  components: ComponentPluginsInstance;
  parsers: ParserPluginsInstance;

  getPlugins(): ParserPluginsInstance;
  getConfig(): RankiLanguageConfig;
  parse<T extends RankiLangParseHandlerCommon>(
    raw: Record<TheaterName, string>,
    specs: RankiLangParseSpecs<T>,
  ): RankiLangParseResult;
  // clone(userConfigs: RankiLanguageProvidedConfig[] | null): RankiLangInstance;
}

export interface RankiLangParseHandlerHooks {
  lang: RankiLangInstance;
  clone(userConfigs: RankiLanguageProvidedConfig[] | null): RankiLangInstance;
  parseAst: (
    context: RankiLangAstContext,
    raw: string,
  ) => RankiLangParseFunctionReturn;
}

export type RankiLangParserPluginParseHandler<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = (
  theaterRaw: string,
  spec: RankiLangParseSpecs<T>,
  hooks: RankiLangParseHandlerHooks,
) => RankiLangParseResult;
