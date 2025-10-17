import type {
  ComponentPluginComponent,
  RankiPluginComponent,
} from "../plugins/component.mjs";
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
  RankiLangParsedAst,
} from "./context.mjs";
import type { RankiPluginParser } from "../plugins/parser.mjs";
import type { AstNode } from "../stages/ast.mjs";
import type { ValidationNode } from "../stages/validation.mjs";
import type { TransformNode } from "../stages/transform.mjs";

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

  // parseAst<T extends RankiLangParseHandlerCommon>(
  //   theaterRaw: string,
  //   spec: RankiLangParseSpecs<T>,
  // ): RankiLangParsedAst;
}

export interface RankiLangParseHandlerHooks<> {
  getPlugins: RankiLangInstance["getPlugins"];
  getHandler: ParserPluginsInstance["getHandler"];
  getConfig: () => RankiLanguageConfig;
  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent;
  clone(
    userConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn;
  parseAst: (
    raw: string,
    context: RankiLangAstContext,

    hooks: RankiLangParseHandlerHooks,
  ) => RankiLangParseFunctionReturn;
}

export interface RankiLangCloneFunctionReturn {
  lang: RankiLangInstance;
  hooks: RankiLangParseHandlerHooks;
}

// export type RankiLangParserPluginParseHandler<
//   T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
// > = (
//   theaterRaw: string,
//   spec: RankiLangParseSpecs<T>,
//   hooks: RankiLangParseHandlerHooks,
// ) => RankiLangParsedAst;
