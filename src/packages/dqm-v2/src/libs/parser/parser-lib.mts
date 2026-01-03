import type {
  IParser,
  DqmPluginsConfigDefaults,
  DqmConfig,
  DqmPluginsTokens,
  ParserHashString,
  DqmInternalConfig,
} from "@dqm/package-dqm-api-v2";
import { ParserHash } from "./hash.mjs";
import { Parser } from "./parser.mjs";
import type { GrammarLib } from "../grammar/grammar-lib.mjs";

export class ParserLib {
  private readonly grammarLib: GrammarLib;

  constructor(grammarLib: GrammarLib) {
    this.grammarLib = grammarLib;
  }

  private parsers = new Map<ParserHashString, IParser>();

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    return this.grammarLib.getGrammarDefaultConfigs(defaultConfig);
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return this.grammarLib.getGrammarTokens(config);
  }

  getParser(internalConfig: DqmInternalConfig): IParser {
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
