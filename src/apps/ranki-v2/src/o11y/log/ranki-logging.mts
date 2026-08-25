import { logs } from "@opentelemetry/api-logs";

import type {
  LogDriver,
  RankiLoggingStaticConfiguration,
  RankiLogRuntimeProps,
} from "./ranki-logging.types.mjs";

import { RankiLogDriverRegistry } from "../driver-registry/driver-registry.mjs";
import { PlaceholderOtelLoggerProvider } from "./provider/placeholder-provider.mjs";

export class RankiLogging {
  private static readonly active = new Map<string, LogDriver>();
  private static logger: null | PlaceholderOtelLoggerProvider = null;
  private static readonly registry = RankiLogDriverRegistry;

  public static configure(conf: RankiLoggingStaticConfiguration) {
    this.registry.addMany(conf.drivers);
  }

  public static enable(props: RankiLogRuntimeProps) {
    Object.entries(props.drivers).forEach(([key, def]) => {
      const Driver = this.registry.get(key);
      const instance = new Driver(def);
      RankiLogging.active.set(key, instance);
    });
    if (!this.logger) {
      logs.setGlobalLoggerProvider(
        new PlaceholderOtelLoggerProvider({
          drivers: Array.from(this.active.values()),
        }),
      );
    }
  }

  public static getConsoleAccess() {
    return RankiLogging.active.get("consoleBatch");
  }
}
