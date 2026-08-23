import type {
  DebugLogDriver,
  O11yDebugLogAttributes,
} from "_controllers/geometry/o11y/debug/debug.types.mjs";
import type { RankiDebuggingRuntimeProps } from "./ranki-debugging.types.mjs";
import type { LogDriver } from "../log/ranki-logging.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

declare global {
  var o11yDebugger: DebugLogDriver;
}

interface LogDriverConstructor {
  new (p: any): LogDriver;
}

type RankiLogDriverRegistryAddManyProps = Record<string, LogDriverConstructor>;

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

export class RankiDebugging {
  private static readonly active = new Map<string, DebugLogDriver>();
  private static readonly registry = RankiLogDriverRegistry;

  public static enable(props: RankiDebuggingRuntimeProps) {
    Object.entries(props.drivers).forEach(([key, def]) => {
      const Driver = this.registry.get(key);
      const instance = new Driver(def);
      RankiDebugging.active.set(key, instance);
    });

    globalThis.o11yDebugger = { log: RankiDebugging.logToDrivers.bind(this) };
  }

  private static logToDrivers(log: O11yDebugLogAttributes) {
    for (const [_, driver] of this.active) {
      driver.log(log);
    }
  }

  public static getConsoleAccess() {
    return RankiDebugging.active.get("consoleBatch");
  }

  public static addDrivers = this.registry.addMany.bind(this.registry);
}
