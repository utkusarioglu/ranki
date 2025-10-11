import type {
  RankiLanguageConfig,
  RankiLanguageMergedConfig,
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

interface ComponentPluginShape {
  // TODO
  ast: {
    preprocess: (raw: string) => string;
    directives: Partial<RankiLanguageMergedConfig>;
    params: {
      setting: {
        positional: string[][];
        shorthands: Record<string, string[]>;
      };
      directive: {
        positional: string[][];
        shorthands: Record<string, string[]>;
      };
    };
  };
}

interface ComponentPluginsInstance {
  get(chain: string[]): ComponentPluginShape;
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
