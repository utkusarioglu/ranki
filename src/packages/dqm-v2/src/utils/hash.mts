import type {
  DqmInternalConfig,
  ParserHashString,
} from "@dqm/package-dqm-api-v2";

export class Hash {
  static internalConfig(config: DqmInternalConfig): ParserHashString {
    const stringified = Hash.stringifyInternalConfig(config);
    return Hash.djb2Hash(stringified).toString() as ParserHashString;
  }

  private static djb2Hash(str: string): number {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i); // h * 33 ^ c
    }
    return h >>> 0;
  }

  private static stringifyInternalConfig(config: DqmInternalConfig): string {
    return JSON.stringify(config);
  }
}
