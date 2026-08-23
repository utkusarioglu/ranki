import type {
  LogDriver,
  RankiLogRuntimeProps,
} from "./ranki-logging.types.mjs";
import { logs } from "@opentelemetry/api-logs";
import { PlaceholderOtelLoggerProvider } from "./provider/placeholder-provider.mjs";
import { RankiLogDriverRegistry } from "../debug/ranki-debugging.mjs";

export class RankiLogging {
  private static readonly active = new Map<string, LogDriver>();
  private static readonly registry = RankiLogDriverRegistry;

  public static enable(props: RankiLogRuntimeProps) {
    Object.entries(props.drivers).forEach(([key, def]) => {
      const Driver = this.registry.get(key);
      const instance = new Driver(def);
      RankiLogging.active.set(key, instance);
    });
    logs.setGlobalLoggerProvider(
      new PlaceholderOtelLoggerProvider({
        drivers: Array.from(this.active.values()),
      }),
    );
  }

  public static getConsoleAccess() {
    return RankiLogging.active.get("consoleBatch");
  }

  public static addDrivers = this.registry.addMany.bind(this.registry);
}
