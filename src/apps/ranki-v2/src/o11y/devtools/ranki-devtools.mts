import type {
  DevtoolsLogDriver,
  O11yDevtoolsLogAttributes,
} from "_controllers/geometry/o11y/devtools/devtools.types.mjs";

import type {
  RankiO11yDevtoolsRuntimeProps,
  RankiO11yDevtoolsStaticConfiguration,
} from "./ranki-devtools.types.mjs";

import { RankiLogDriverRegistry } from "../driver-registry/driver-registry.mjs";

declare global {
  var o11yDevtools: DevtoolsLogDriver;
}

export class RankiO11yDevtools {
  private static readonly active = new Map<string, DevtoolsLogDriver>();
  private static readonly registry = RankiLogDriverRegistry;

  public static configure(conf: RankiO11yDevtoolsStaticConfiguration) {
    this.registry.addMany(conf.drivers);
  }

  public static enable(props: RankiO11yDevtoolsRuntimeProps) {
    Object.entries(props.drivers).forEach(([key, def]) => {
      const Driver = this.registry.get(key);
      const instance = new Driver(def);
      RankiO11yDevtools.active.set(key, instance);
    });

    globalThis.o11yDevtools = {
      log: RankiO11yDevtools.logToDrivers.bind(this),
    };
  }

  public static getConsoleAccess() {
    return RankiO11yDevtools.active.get("consoleBatch");
  }

  private static logToDrivers(log: O11yDevtoolsLogAttributes) {
    for (const [, driver] of this.active) {
      driver.log(log);
    }
  }
}
