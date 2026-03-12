import type {
  IParser,
  DqmConfig,
  DqmPluginsTokens,
  ParserHashString,
  DqmInternalConfig,
  IPluginLib,
  IDqmPluginGrammar,
  DqmGrammarPluginsAggregatedConfig,
} from "@dqm/package-dqm-api-v2";
import { Hash } from "../../utils/hash.mjs";
import { Parser } from "./parser/parser.mjs";
import { GrammarLib } from "./grammar/grammar-lib.mjs";

export type T = IDqmPluginGrammar;

export type ILibGrammarCriteria = {
  internalConfig: DqmInternalConfig;
};

export type ILibParser = IPluginLib<T, IParser, ILibGrammarCriteria>;

export class ParserLib implements ILibParser {
  private readonly grammarLib = new GrammarLib();
  private readonly parsers = new Map<ParserHashString, IParser>();

  add(plugin: T): this {
    this.grammarLib.add(plugin);
    return this;
  }

  get({ internalConfig }: ILibGrammarCriteria): IParser {
    const hash = Hash.internalConfig(internalConfig);
    const cached = this.parsers.get(hash);
    if (cached) {
      return cached;
    }
    const parser = new Parser(hash, internalConfig, this.grammarLib);
    this.parsers.set(hash, parser);
    return parser;
  }

  getGrammarDefaultConfigs(
    defaultConfig: DqmConfig,
  ): DqmGrammarPluginsAggregatedConfig {
    return this.grammarLib.getGrammarDefaultConfigs(defaultConfig);
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return this.grammarLib.getGrammarTokens(config);
  }
}
