import type { LogValue } from "_/o11y/log/ranki-logging.types.mjs";

import type { LokiLog, LokiLogStream, LokiLogValue } from "./loki.types.mjs";

export class LokiLogProcessor {
  public static processLog(logs: LokiLogValue[]): LokiLog {
    return { streams: [this.processLogStream(logs)] };
  }

  public static processLogValue(log: LogValue): LokiLogValue {
    return [String(log.timestamp), JSON.stringify(log)];
  }

  private static processLogStream(values: LokiLogValue[]): LokiLogStream {
    return {
      stream: {
        service_name: "ranki",
      },
      values,
    };
  }
}
