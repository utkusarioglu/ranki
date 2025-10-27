import * as ohm from "ohm-js";
import type { RankiLangAstContext, RankiPluginParser } from "@ranki/package-api-v2";
export declare function buildGrammar(context: RankiLangAstContext, importChain: string[], finder: (s: string) => RankiPluginParser): {
    matcher: any;
    sources: string[];
};
export declare function compileOhmActionDicts(matcher: ohm.Grammar, sortedSet: Set<string>, parsers: Record<string, Record<string, ohm.ActionDict<any>>>): {
    participants: {};
    semantics: ohm.Semantics;
    operations: {};
    methods: {};
};
