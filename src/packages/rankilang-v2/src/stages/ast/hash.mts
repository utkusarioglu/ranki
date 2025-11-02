// import { djb2Hash, stringifyContext } from "./utils.mjs";
import type {
  // RankiLangAstContext,
  RankiLangParseDefinition,
} from "@ranki/package-api-v2";
import type { RankiLangConfig } from "../../config.mjs";

export class ParserHash {
  static compute(
    def: RankiLangParseDefinition,
    config: RankiLangConfig,
    // context: RankiLangAstContext,
  ): string {
    const stringified = ParserHash.stringifyContext(def, config);
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
    config: RankiLangConfig,
    // context: RankiLangAstContext,
  ): string {
    return [def.type, JSON.stringify(config.getMerged())].join("");
  }
}
