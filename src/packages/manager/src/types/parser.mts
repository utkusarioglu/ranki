import type * as ohm from "ohm-js";

export interface GrammarSpecs {
  // versionPath: string;
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}

// export interface ParserPlugin {
//   name: string;
//   dependencies: string[];
//   parser: (specs: GrammarSpecs) => ParserPluginGrammar;
//   // parser: (specs: GrammarSpecs) => ohm.Grammar;
// }

export interface ParserPluginGrammar {
  // raw: string;
  altered: string;
  grammar: ohm.Grammar;
}
