import type { LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import type { LokiLogValue, LokiLog, LokiLogStream } from "./loki.types.mjs";

export class LokiLogProcessor {
  public static processLog(logs: LokiLogValue[]): LokiLog {
    return { streams: [this.processLogStream(logs)] };
  }

  private static processLogStream(values: LokiLogValue[]): LokiLogStream {
    return {
      stream: {
        service_name: "ranki",
      },
      values,
    };
  }

  public static processLogValue(log: LogValue): LokiLogValue {
    return [String(log.timestamp), JSON.stringify(log)];
  }
}
