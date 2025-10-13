import {
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
}

export interface RankiLangParseHandlerHooks<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> {
  lang: RankiLangInstance;
  clone(userConfigs: RankiLanguageProvidedConfig[] | null): RankiLangInstance;
  parseValidation: (
    ast: AstNode,
    spec: RankiLangParseSpecs<T>,
  ) => ValidationNode;
  parseAst: (
    raw: string,
    context: RankiLangAstContext,
  ) => RankiLangParseFunctionReturn;
  parseTransform: (
    v: ValidationNode,
    spec: RankiLangParseSpecs<T>,
  ) => TransformNode;
}

export type RankiLangParserPluginParseHandler<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = (
  theaterRaw: string,
  spec: RankiLangParseSpecs<T>,
  hooks: RankiLangParseHandlerHooks,
) => RankiLangParseResult;
