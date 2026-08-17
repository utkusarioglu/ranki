import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";
import { safeStringify } from "./stringify.mjs";
import type { LokiLogValue, LokiLogStream, LokiLog } from "./loki.types.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

export class LokiLogDriver implements LogDriver {
  private logs: LogValue[] = [];

  constructor() {
    this.initSender();
  }

  private processLogValue(log: LogValue): LokiLogValue {
    return [String(log.epoch * 1e6), safeStringify(log)];
  }

  private processLogStream(logs: LogValue[]): LokiLogStream {
    return {
      stream: {
        service_name: "ranki",
      },
      values: logs.map((log) => this.processLogValue(log)),
    };
  }

  private processLog(logs: LogValue[]): LokiLog {
    return { streams: [this.processLogStream(logs)] };
  }

  private sendBatch() {
    if (!this.logs.length) return;
    const logs = [...this.logs];
    this.logs = [];
    const processed = this.processLog(logs);
    const lokiEndpoint = "/loki/api/v1/push";
    fetch(lokiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processed),
    }).catch((e) => {
      throw new RankiAppError({
        code: "LOG_TRANSPORT_FAIL",
        why: "Log send operation to backend failed",
        cause: e,
        details: {
          processed,
          logs,
        },
      });
    });
  }

  private initSender() {
    setInterval(() => {
      this.sendBatch();
    }, 5e3);
  }

  log(value: LogValue): void {
    this.logs.push(value);
  }
}
