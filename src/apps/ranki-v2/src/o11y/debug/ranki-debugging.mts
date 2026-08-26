import type {
  DebugLogDriver,
  O11yDebugLogAttributes,
} from "_controllers/geometry/o11y/debug/debug.types.mjs";

import type {
  RankiDebuggingRuntimeProps,
  RankiDebuggingStaticConfiguration,
} from "./ranki-debugging.types.mjs";

import { RankiLogDriverRegistry } from "../driver-registry/driver-registry.mjs";

declare global {
  var o11yDebugger: DebugLogDriver;
}

export class RankiDebugging {
  private static readonly active = new Map<string, DebugLogDriver>();
  private static readonly registry = RankiLogDriverRegistry;

  public static configure(conf: RankiDebuggingStaticConfiguration) {
    this.registry.addMany(conf.drivers);
  }

  public static enable(props: RankiDebuggingRuntimeProps) {
    Object.entries(props.drivers).forEach(([key, def]) => {
      const Driver = this.registry.get(key);
      const instance = new Driver(def);
      RankiDebugging.active.set(key, instance);
    });

    globalThis.o11yDebugger = { log: RankiDebugging.logToDrivers.bind(this) };
  }

  public static getConsoleAccess() {
    return RankiDebugging.active.get("consoleBatch");
  }

  private static logToDrivers(log: O11yDebugLogAttributes) {
    for (const [, driver] of this.active) {
      driver.log(log);
    }
  }
}
