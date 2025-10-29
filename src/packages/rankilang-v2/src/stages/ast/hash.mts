// import { djb2Hash, stringifyContext } from "./utils.mjs";
import type {
  RankiLangAstContext,
  RankiLangParseDefinition,
} from "@ranki/package-api-v2";

export class ParserHash {
  static compute(
    def: RankiLangParseDefinition,
    context: RankiLangAstContext,
  ): string {
    const stringified = ParserHash.stringifyContext(def, context);
    return ParserHash.djb2Hash(stringified).toString();
  }

  private static djb2Hash(str: string) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
    }
    return h >>> 0;
  }

  private static stringifyContext(
    def: RankiLangParseDefinition,
    context: RankiLangAstContext,
  ): string {
    return [def.type, JSON.stringify(context.getMergedConfig())].join("");
  }
}
