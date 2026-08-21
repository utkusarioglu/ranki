export class ContextKeyRegistry {
  private static readonly registry = new Map<string, symbol>();

  static getSymbol(key: string): symbol | undefined {
    return ContextKeyRegistry.registry.get(key);
  }

  static registerKey(key: string) {
    const keySymbol = Symbol(key);
    ContextKeyRegistry.registry.set(key, keySymbol);
    return keySymbol;
  }
}
