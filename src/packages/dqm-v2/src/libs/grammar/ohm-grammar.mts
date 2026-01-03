import * as ohm from "ohm-js";
import type {
  DqmInternalConfig,
  GrammarActionsDict,
  ILibGrammar,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";
import { Serialize } from "../../utils/serialize.mjs";

export interface GrammarSpecs {
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}

export interface OhmGrammarAdjusted {
  altered: string;
  grammar: ohm.Grammar;
}

export class OhmGrammar {
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
      return `<: ${specs.parentGrammar} {`; // replace `word` however you want
    });
    return {
      altered,
      grammar: ohm.grammar(altered, specs.dependencies),
    };
  }

  static build(
    sorted: PluginUrn<"grammar">[],
    config: DqmInternalConfig,
    grammarLib: ILibGrammar,
  ) {
    const importChainName = sorted.map(Serialize.getPluginName);
    const matchers: Record<string, OhmGrammarAdjusted> = {};
    let grammarParents = {};
    let sources: string[] = [];
    for (let si = 0; si < sorted.length; si++) {
      const urn = sorted[si];
      const name = importChainName[si];
      const parserPlugin = grammarLib.getSingle(urn);
      const matcher = this.adjustParent(
        {
          parentGrammar: si === 0 ? "" : importChainName[si - 1],
          dependencies: grammarParents,
        },
        parserPlugin.grammar(config),
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

  static compileActionDicts(
    matcher: ohm.Grammar,
    sortedSet: Set<string>,
    parsers: GrammarActionsDict,
  ) {
    let semantics = matcher.createSemantics();
    const operations = {};
    const contributors = {};

    Object.entries(parsers).forEach(([parserName, parser]) => {
      if (!sortedSet.has(parserName)) {
        return;
      }
      Object.entries(parser).forEach(([operationName, actionDict]) => {
        if (!operations.hasOwnProperty(operationName)) {
          // @ts-expect-error
          operations[operationName] = {};
          // @ts-expect-error
          contributors[operationName] = [];
        }
        // @ts-expect-error
        contributors[operationName].push(parserName);
        // @ts-expect-error
        operations[operationName] = {
          // @ts-expect-error
          ...operations[operationName],
          ...actionDict,
        };
      });
    });

    const methods = Object.entries(operations).reduce((a, [k, v]) => {
      // @ts-expect-error
      a[k] = Object.keys(v);
      return a;
    }, {});

    Object.entries(operations).forEach(([operationName, actionDict]) => {
      semantics = semantics.addOperation(
        `${operationName}(context)`,
        actionDict as ohm.ActionDict<unknown>,
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
