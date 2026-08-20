import { assertNotNull } from "_error/assertions.mjs";

import type {
  RankiLogRuntimeProps,
  RankiLogsDrivers,
  RankiLogsStaticConfigProps,
} from "./log.types.mjs";

import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";

export class RankiLogging {
  private static drivers: RankiLogsDrivers = {
    consoleBatchLogDriver: null,
    lokiLogDriver: null,
  };

  public static configure(config: RankiLogsStaticConfigProps) {
    if (config.consoleBatch) {
      ConsoleBatchLogDriver.configure(config.consoleBatch);
    }
  }

  public static enable(props: RankiLogRuntimeProps) {
    this.drivers = {
      consoleBatchLogDriver: new ConsoleBatchLogDriver(
        props.drivers.consoleBatch,
      ),
      lokiLogDriver: new LokiLogDriver(props.drivers.loki),
    };
  }

  public static getConsoleDriver() {
    if (!this.drivers.consoleBatchLogDriver) {
      return new Proxy(
        {},
        {
          get() {
            return () => {
              console.warn("console batch log driver hasn't been enabled");
            };
          },
        },
      );
    }
    return this.drivers.consoleBatchLogDriver;
  }

  public static getDrivers() {
    Object.entries(this.drivers).forEach(([name, driver]) => {
      assertNotNull(driver, {
        details: {
          name,
        },
        why: "log driver hasn't been initialized",
      });
    });
    return Object.values(this.drivers);
  }
}
