import type { UniqueValue } from "@dqm/package-dqm-api-v2";

export class Unique {
  private static uniqueCounter: UniqueValue = 0;
  private static registry = new Map<UniqueValue, WeakRef<any>>();

  static getNewUnique(val: any) {
    this.registry.set(this.uniqueCounter, new WeakRef(val));
    return this.uniqueCounter++;
  }

  static reset() {
    this.uniqueCounter = 0;
    this.registry.clear();
  }

  /**
   * Reports all the references that have been registered.
   *
   * @dev
   * These are weak references. they may disappear if this method is called
   * late or if the system is under pressure.
   */
  static getRegistrySnapshot() {
    return Object.fromEntries(
      this.registry.entries().map(([k, v]) => [k, v.deref()]),
    );
  }
}
