import { assertExists } from "_error/assertions.mjs";

export class ContextKeyRegistry {
  private static readonly registry = new Map<string, symbol>();

  static getSymbol(key: string): symbol {
    const curr = ContextKeyRegistry.registry.get(key);
    assertExists(curr, { details: { key }, why: "Undefined key" });
    return curr;
  }

  static registerKey(key: string) {
    const keySymbol = Symbol(key);
    ContextKeyRegistry.registry.set(key, keySymbol);
    return keySymbol;
  }
}
