import type {
  ComponentPluginComponent,
  RankiPluginComponent,
} from "../plugins/component.mjs";
import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "./config.mjs";
import type {
  ParserPluginsInstance,
  TheaterName,
  RankiLangParseSpecs,
  RankiLangParseResult,
  RankiLangParseFunctionReturn,
  RankiLangAstContext,
  RankiLangParseDefinition,
} from "./context.mjs";
import type { RankiPluginParser } from "../plugins/parser.mjs";

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
  parse(
    raw: Record<TheaterName, string>,
    specs: RankiLangParseSpecs,
  ): RankiLangParseResult;
}

export interface RankiLangParseHandlerHooks {
  getPlugins: RankiLangInstance["getPlugins"];
  getHandler: ParserPluginsInstance["getHandler"];
  getConfig: () => RankiLanguageConfig;
  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent;
  clone(
    userConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn;

  parseAst: (
    raw: string,
    def: RankiLangParseDefinition,
    context: RankiLangAstContext,
  ) => RankiLangParseFunctionReturn;

  createParser(
    def: RankiLangParseDefinition,
    context: RankiLangAstContext,
  ): CreateParserReturn;
}

export interface CreateParserReturn {
  expandedDefinition: RankiLangParseDefinition & { hash: string };
  callback: ParseAstFunction;
}

export type ParseAstFunction = (
  raw: string,
  // newContext: RankiLangAstContext,
) => RankiLangParseFunctionReturn;

export interface RankiLangCloneFunctionReturn {
  lang: RankiLangInstance;
  hooks: RankiLangParseHandlerHooks;
}
