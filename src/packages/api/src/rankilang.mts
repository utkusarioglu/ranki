import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "./config.mjs";
import {
  ParserPlugins,
  TheaterName,
  RankiLangParseSpecs,
  RankiLangParseResult,
} from "./context.mjs";

export interface RankiLangInstance {
  getPlugins(): ParserPlugins;
  getConfig(): RankiLanguageConfig;
  parse(
    raw: Record<TheaterName, string>,
    specs: RankiLangParseSpecs,
  ): RankiLangParseResult;
  // clone(userConfigs: RankiLanguageProvidedConfig[] | null): RankiLangInstance;
}
