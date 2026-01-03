import type {
  GrammarName,
  IDqmPluginGrammar,
  GrammarActionsDict,
  DqmConfig,
  DqmPluginsConfigDefaults,
  DqmPluginsTokens,
  ILibGrammar,
  ILibGrammarCriteria,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { Serialize } from "../../serialize.mjs";

export class GrammarLib implements ILibGrammar {
  private grammars = new Map<GrammarName, IDqmPluginGrammar>();

  getActions(): GrammarActionsDict {
    return this.grammars
      .values()
      .reduce(
        (a, c) => (
          (a[Serialize.grammarName(c.type, c.meta.name)] = c.actions()), a
        ),
        {} as GrammarActionsDict,
      );
  }

  getNames(): Set<GrammarName> {
    return new Set<GrammarName>(this.grammars.keys());
  }

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    const config = this.grammars.entries().reduce(
      (a, [k, v]) => (
        // @ts-expect-error
        (a[k] = v.config(defaultConfig)), a
      ),
      {},
    );
    return {
      config,
    };
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return Object.fromEntries(
      this.grammars
        .values()
        .map((c) => {
          const key = Serialize.grammarName(c.type, c.meta.name);
          const tokens = config.plugins.config[key];
          const tokenized = tokens === undefined ? null : c.tokenizer(tokens);
          return [key, tokenized];
        })
        .filter((a) => a[1] !== null),
    );
  }

  add(plugin: IDqmPluginGrammar): this {
    const key = Serialize.grammarName(plugin.type, plugin.meta.name);
    if (this.grammars.has(key)) {
      throw new DqmAppError({
        code: "PLUGIN_GRAMMAR_REGISTERED",
        why: "Plugin names have to be unique",
        cause: null,
        details: {
          list: this.grammars,
          plugin,
        },
      });
    }
    this.grammars.set(key, plugin);
    return this;
  }

  @rejectValues(undefined)
  get({ grammarName }: ILibGrammarCriteria): IDqmPluginGrammar {
    return this.grammars.get(grammarName)!;
  }
}
