import type * as ohm from "ohm-js";
export interface GrammarSpecs {
    parentGrammar: string;
    dependencies: Record<string, ohm.Grammar>;
}
export interface ParserPluginGrammar {
    altered: string;
    grammar: ohm.Grammar;
}
