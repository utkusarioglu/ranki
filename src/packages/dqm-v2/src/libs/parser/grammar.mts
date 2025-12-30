import * as ohm from "ohm-js";
import type {
  DqmInternalConfig,
  IDqmPluginGrammar,
} from "@dqm/package-dqm-api-v2";
import type { GrammarActionsDict } from "./parser-lib.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { assertExists } from "@dqm/package-dqm-utils";

export interface GrammarSpecs {
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}

export interface ParserPluginGrammar {
  altered: string;
  grammar: ohm.Grammar;
}

function adjustParent(specs: GrammarSpecs, raw: string): ParserPluginGrammar {
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

export function buildGrammar(
  config: DqmInternalConfig,
  importChainUrn: string[],
  finder: (s: string) => IDqmPluginGrammar,
) {
  const importChainName = importChainUrn.map((v) => v.split(":").at(-1)!);
  const matchers: Record<string, ParserPluginGrammar> = {};
  let grammarParents = {};
  let sources: string[] = [];
  for (let si = 0; si < importChainUrn.length; si++) {
    const urn = importChainUrn[si];
    const name = importChainName[si];
    const parserPlugin = finder(urn);
    const matcher = adjustParent(
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
    why: "matcher has to be defined at this point in the code",
  });

  return { matcher, sources };
}

export function compileOhmActionDicts(
  matcher: ohm.Grammar,
  sortedSet: Set<string>,
  parsers: GrammarActionsDict,
) {
  let semantics = matcher.createSemantics();
  const operations = {};
  const participants = {};

  Object.entries(parsers).forEach(([parserName, parser]) => {
    if (!sortedSet.has(parserName)) {
      return;
    }
    Object.entries(parser).forEach(([operationName, actionDict]) => {
      if (!operations.hasOwnProperty(operationName)) {
        // @ts-expect-error
        operations[operationName] = {};
        // @ts-expect-error
        participants[operationName] = [];
      }
      // @ts-expect-error
      participants[operationName].push(parserName);
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
    participants,
    semantics,
    operations,
    methods,
  };
}
