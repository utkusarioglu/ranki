import * as ohm from "ohm-js";
import type {
  Contributors,
  DqmInternalConfig,
  GrammarActionsDict,
  IAstNodeActionDict,
  PluginDictionary,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import { Serialize } from "../../../utils/serialize.mjs";

export interface GrammarSpecs {
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}

export interface OhmGrammarAdjusted {
  altered: string;
  grammar: ohm.Grammar;
}

export class OhmGrammar {
  static build(
    plugins: PluginDictionary,
    sorted: PluginUrn<"grammar">[],
    internalConfig: DqmInternalConfig,
  ) {
    const importChainName = sorted.map(Serialize.getPluginName);
    const matchers: Record<string, OhmGrammarAdjusted> = {};
    let grammarParents = {};
    let sources: string[] = [];
    for (let si = 0; si < sorted.length; si++) {
      const urn = sorted[si];
      const name = importChainName[si];
      const parserPlugin = plugins[urn];
      const matcher = this.adjustParent(
        {
          parentGrammar: si === 0 ? "" : importChainName[si - 1],
          dependencies: grammarParents,
        },
        parserPlugin.grammar(internalConfig),
      );
      matchers[name] = matcher;
      sources.push(matcher.altered);
      grammarParents = {
        ...grammarParents,
        [name]: matcher.grammar,
      };
    }

    const last = importChainName.at(-1)!;
    const matcher = matchers[last].grammar;

    assertExists(matcher, {
      why: "matcher has to be defined at this point during runtime",
    });

    return { matcher, sources };
  }

  private static adjustParent(
    specs: GrammarSpecs,
    raw: string,
  ): OhmGrammarAdjusted {
    const altered = raw.replace(/<:\s*(\w+)\s*\{/, (_match, _word) => {
      if (specs.parentGrammar === "") {
        throw new DqmAppError({
          code: "NO_PARENT_GRAMMAR",
          why: "Parent adjustment algorithm expects a preset parent field.",
          cause: null,
          details: {
            specs,
            raw,
          },
        });
      }
      return `<: ${specs.parentGrammar} {`;
    });
    return {
      altered,
      grammar: ohm.grammar(altered, specs.dependencies),
    };
  }

  static compileActionDicts(
    matcher: ohm.Grammar,
    sortedSet: Set<PluginUrn<"grammar">>,
    parsers: GrammarActionsDict,
  ) {
    let semantics = matcher.createSemantics();
    type Operations = Record<string, IAstNodeActionDict>;
    const operations: Operations = {};
    const contributors: Contributors = {};

    Object.entries(parsers).forEach(([parserName, parser]) => {
      if (!sortedSet.has(parserName as PluginUrn<"grammar">)) {
        return;
      }
      Object.entries(parser).forEach(([operationName, actionDict]) => {
        if (!operations.hasOwnProperty(operationName)) {
          operations[operationName] = {};
          contributors[operationName] = [];
        }
        contributors[operationName].push(parserName);
        operations[operationName] = {
          ...operations[operationName],
          ...actionDict,
        };
      });
    });

    const methods = Object.fromEntries(
      Object.entries(operations).map(([k, v]) => [k, Object.keys(v)]),
    );

    Object.entries(operations).forEach(([operationName, actionDict]) => {
      semantics = semantics.addOperation(
        `${operationName}(context)`,
        actionDict,
      );
    });

    return {
      contributors,
      semantics,
      operations,
      methods,
    };
  }
}
