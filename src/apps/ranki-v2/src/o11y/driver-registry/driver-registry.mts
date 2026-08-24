import { assertNotUndefined } from "_error/assertions.mjs";
import type {
  LogDriverConstructor,
  RankiLogDriverRegistryAddManyProps,
} from "./driver-registry.types.mjs";

export class RankiLogDriverRegistry {
  private static readonly list = new Map<string, LogDriverConstructor>();

  static addMany(m: RankiLogDriverRegistryAddManyProps) {
    Object.entries(m).forEach(([k, v]) => this.list.set(k, v));
  }

  static get(name: string) {
    const driver = this.list.get(name);
    assertNotUndefined(driver, {
      why: "Unregistered driver",
      details: { name, drivers: this.list },
    });
    return driver;
  }
}
