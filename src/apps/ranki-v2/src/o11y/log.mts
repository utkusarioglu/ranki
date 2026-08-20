import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";
import { assertNotNull } from "_error/assertions.mjs";
import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
} from "./log-drivers/console-batch/console-batch.types.mjs";
import type { LokiLogDriverConstructorParams } from "./log-drivers/loki/loki.types.mjs";

interface RankiLogsDrivers {
  consoleBatchLogDriver: ConsoleBatchLogDriver | null;
  lokiLogDriver: LokiLogDriver | null;
}

interface RankiLogsStaticConfig {
  consoleBatch: ConsoleBatchLogDriverConfigureProps;
}

export interface RankiLogRuntimeProps {
  drivers: {
    loki: LokiLogDriverConstructorParams;
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
  };
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

  public static enable(props: RankiLogRuntimeProps) {
    this.drivers = {
      consoleBatchLogDriver: new ConsoleBatchLogDriver(
        props.drivers.consoleBatch,
      ),
      lokiLogDriver: new LokiLogDriver(props.drivers.loki),
    };
  }

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
