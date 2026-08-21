import type {
  DebugLogDriver,
  O11yDebugLogAttributes,
} from "_controllers/geometry/o11y/debug/debug.types.mjs";
import { ConsoleBatchLogDriver } from "../log/log-drivers/console-batch/console-batch.mjs";
import type { ConsoleBatchLogDriverConstructorParams } from "../log/log-drivers/console-batch/console-batch.types.mjs";

export interface RankiDebuggingRuntimeProps {
  drivers: {
    consoleBatch: ConsoleBatchLogDriverConstructorParams;
  };
}

declare global {
  var o11yDebugger: DebugLogDriver;
}

export class RankiDebugging {
  private static readonly logDrivers: DebugLogDriver[] = [];
  private static console: DebugLogDriver | null = null;

  public static enable(props: RankiDebuggingRuntimeProps) {
    RankiDebugging.console = new ConsoleBatchLogDriver(
      props.drivers.consoleBatch,
    );
    RankiDebugging.logDrivers.push(RankiDebugging.console);

    globalThis.o11yDebugger = { log: RankiDebugging.logToDrivers };
  }

  private static logToDrivers(log: O11yDebugLogAttributes) {
    RankiDebugging.logDrivers.forEach((driver) => {
      driver.log(log);
    });
  }

  public static getConsoleAccess() {
    if (!RankiDebugging.console) {
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
    return RankiDebugging.console;
  }
}
