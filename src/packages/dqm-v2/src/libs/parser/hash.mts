// import { djb2Hash, stringifyContext } from "./utils.mjs";
// import type {
//   // RankiLangAstContext,
//   RankiLangParseDefinition,
// } from "@ranki/package-api-v2";
// import type { RankiLangConfig } from "../../config.mjs";
import type { CpsDefinition, DqmConfig } from "@ranki/package-dqm-api-v2";

export class ParserHash {
  static compute(
    def: CpsDefinition,
    config: DqmConfig,
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
    def: CpsDefinition,
    config: DqmConfig,
    // context: RankiLangAstContext,
  ): string {
    return [def.id.join("."), JSON.stringify(config)].join("");
  }
}
