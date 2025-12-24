import type { UniqueValue } from "@dqm/package-dqm-api-v2";

export class Unique {
  private static uniqueCounter: UniqueValue;

  static getNewUnique() {
    return Unique.uniqueCounter++;
  }

  static reset() {
    Unique.uniqueCounter = 0;
  }
}
