import type {
  RankiLogRuntimeProps,
  RankiLogsStaticConfigProps,
} from "./ranki-logging.types.mjs";
import { logs } from "@opentelemetry/api-logs";
import { PlaceholderOtelLoggerProvider } from "./placeholder-provider.mjs";
import { ConsoleBatchLogDriver } from "./log-drivers/console-batch/console-batch.mjs";
import { LokiLogDriver } from "./log-drivers/loki/loki.mjs";

export class RankiLogging {
  private static console: ConsoleBatchLogDriver;

  public static configure(config: RankiLogsStaticConfigProps) {
    if (config.consoleBatch) {
      ConsoleBatchLogDriver.configure(config.consoleBatch);
    }
  }

  public static enable(props: RankiLogRuntimeProps) {
    this.console = new ConsoleBatchLogDriver(props.drivers.consoleBatch);
    const loki = new LokiLogDriver(props.drivers.loki);
    logs.setGlobalLoggerProvider(
      new PlaceholderOtelLoggerProvider({
        drivers: [this.console, loki],
      }),
    );
  }

  public static getConsoleDriver() {
    if (!this.console) {
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
    return this.console;
  }
}
