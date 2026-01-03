import type {
  IParser,
  IDqmPluginGrammar,
  DqmPluginsConfigDefaults,
  DqmConfig,
  DqmPluginsTokens,
  ParserHashString,
  GrammarName,
} from "@dqm/package-dqm-api-v2";
import type { ILibParser, Criteria } from "./parser-lib.types.mjs";
import { ParserHash } from "./hash.mjs";
import { Parser } from "./parser.mjs";
import { GrammarLib } from "./grammar-lib.mjs";

export class ParserLib implements ILibParser {
  private grammarLib = new GrammarLib();
  private parsers = new Map<ParserHashString, IParser>();

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    return this.grammarLib.getGrammarDefaultConfigs(defaultConfig);
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return this.grammarLib.getGrammarTokens(config);
  }

  add(plugin: IDqmPluginGrammar): ILibParser {
    this.grammarLib.add(plugin);
    return this;
  }

  get(criteria: Criteria): IParser {
    const hash = ParserHash.compute(criteria.config);
    const cached = this.parsers.get(hash);
    if (cached) {
      return cached;
    }
    const parser = new Parser(hash, criteria.config, {
      getGrammar: (grammarName: GrammarName) =>
        this.grammarLib.get({ grammarName }),
      namesSet: this.grammarLib.namesSet.bind(this.grammarLib),
      getActions: this.grammarLib.getActions.bind(this.grammarLib),
    });
    this.parsers.set(hash, parser);
    return parser;
  }
}
