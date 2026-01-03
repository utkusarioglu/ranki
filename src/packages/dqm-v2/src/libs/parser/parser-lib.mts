import type {
  IParser,
  DqmPluginsConfigDefaults,
  DqmConfig,
  DqmPluginsTokens,
  ParserHashString,
  DqmInternalConfig,
  IPluginLib,
  IDqmPluginGrammar,
} from "@dqm/package-dqm-api-v2";
import { ParserHash } from "./hash.mjs";
import { Parser } from "./parser/parser.mjs";
import { GrammarLib } from "./grammar/grammar-lib.mjs";

export type T = IDqmPluginGrammar;

export type ILibGrammarCriteria = {
  internalConfig: DqmInternalConfig;
};

export type ILibParser = IPluginLib<T, IParser, ILibGrammarCriteria>;

export class ParserLib implements ILibParser {
  private readonly grammarLib = new GrammarLib();

  add(plugin: T): IPluginLib<T, IParser, ILibGrammarCriteria> {
    this.grammarLib.add(plugin);
    return this;
  }

  private parsers = new Map<ParserHashString, IParser>();

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    return this.grammarLib.getGrammarDefaultConfigs(defaultConfig);
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return this.grammarLib.getGrammarTokens(config);
  }

  get({ internalConfig }: ILibGrammarCriteria): IParser {
    const hash = ParserHash.compute(internalConfig);
    const cached = this.parsers.get(hash);
    if (cached) {
      return cached;
    }
    const parser = new Parser(hash, internalConfig, this.grammarLib);
    this.parsers.set(hash, parser);
    return parser;
  }
}
