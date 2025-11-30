import type { DqmConfig } from "@ranki/package-dqm-api-v2";

export type ParserHashString = string & { type?: "ParserHash" };

export class ParserHash {
  static compute(name: string, config: DqmConfig): ParserHashString {
    const stringified = ParserHash.stringifyContext(name, config);
    return ParserHash.djb2Hash(stringified).toString() as ParserHashString;
  }

  private static djb2Hash(str: string): number {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
    }
    return h >>> 0;
  }

  private static stringifyContext(name: string, config: DqmConfig): string {
    return [name, JSON.stringify(config)].join("");
  }
}
