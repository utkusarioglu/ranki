import * as ohm from "ohm-js";
import type {
  RankiLangAstContext,
  RankiPluginParser,
} from "@ranki/package-api-v2";
import type { GrammarSpecs } from "../types/parser.mjs";
import type { ParserPluginGrammar } from "../types/parser.mjs";

function adjustParent(specs: GrammarSpecs, raw: string): ParserPluginGrammar {
  const altered = raw.replace(/<:\s*(\w+)\s*\{/, (match, word) => {
    if (specs.parentGrammar === "") {
      throw new Error("GRAMMAR EXPECTS A PARENT BUT NONE WAS GIVEN");
    }
    return `<: ${specs.parentGrammar} {`; // replace `word` however you want
  });
  return {
    altered,
    grammar: ohm.grammar(altered, specs.dependencies),
  };
}

export function buildGrammar(
  context: RankiLangAstContext,
  importChain: string[],
  finder: (s: string) => RankiPluginParser,
) {
  const matchers: Record<string, ParserPluginGrammar> = {};
  let grammarParents = {};
  let sources: string[] = [];
  for (let si = 0; si < importChain.length; si++) {
    const name = importChain[si];
    const parserPlugin = finder(name);
    const matcher = adjustParent(
      {
        parentGrammar: si === 0 ? "" : importChain[si - 1],
        dependencies: grammarParents,
      },
      parserPlugin.grammar(context.hooks.getConfig()),
    );
    matchers[name] = matcher;
    sources.push(matcher.altered);
    grammarParents = {
      ...grammarParents,
      [name]: matcher.grammar,
    };
  }

  const last = importChain.at(-1);
  const matcher = matchers[last].grammar;

  if (!matcher) {
    throw new Error("CANNOT DEDUCE MATCHER");
  }

  return { matcher, sources };
}

export function compileOhmActionDicts(
  matcher: ohm.Grammar,
  sortedSet: Set<string>,
  parsers: Record<string, Record<string, ohm.ActionDict<any>>>,
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
        operations[operationName] = {};
        participants[operationName] = [];
      }
      participants[operationName].push(parserName);
      operations[operationName] = {
        ...operations[operationName],
        ...actionDict,
      };
    });
  });

  const methods = Object.entries(operations).reduce((a, [k, v]) => {
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
