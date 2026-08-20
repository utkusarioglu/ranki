import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import { assertNotNull } from "_error/assertions.mjs";
import type { ConsoleBatchLogDriverConfigureProps } from "./log-drivers/console-batch/console-batch.types.mjs";

interface RankiLogsDrivers {
  consoleBatchLogDriver: ConsoleBatchLogDriver | null;
  lokiLogDriver: LokiLogDriver | null;
}

interface RankiLogsStaticConfig {
  // loki: LokiLogDriverConstructorParams;
  consoleBatch: ConsoleBatchLogDriverConfigureProps;
}

type RankiLogsStaticConfigProps = Partial<RankiLogsStaticConfig>;

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

  public static initialize() {
    this.drivers = {
      consoleBatchLogDriver: new ConsoleBatchLogDriver({
        printer: "sanitizedYamlPrinter",
      }),
      lokiLogDriver: new LokiLogDriver({
        loki: {
          endpoint: "/loki/api/v1/push",
        },
        scheduler: {
          enabled: true,
          interval: 5000,
        },
      }),
    };
  }

  // if the need emerges...
  // public static disable() {}

  public static getDrivers() {
    Object.entries(this.drivers).forEach(([name, driver]) => {
      assertNotNull(driver, {
        why: "log driver hasn't been initialized",
        details: {
          name,
        },
      });
    });
    return Object.values(this.drivers);
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
}
