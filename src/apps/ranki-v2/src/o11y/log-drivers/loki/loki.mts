import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";
import { sanitize } from "../utils/sanitize.utils.mjs";
import type { LokiLogValue, LokiLogStream, LokiLog } from "./loki.types.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import type { LokiLogDriverConstructorParams } from "./loki.types.mjs";
import {
  DEFAULT_LOKI_ENDPOINT,
  DEFAULT_SEND_INTERVAL,
} from "./loki.constants.mjs";

export class LokiLogDriver implements LogDriver {
  private logs: LogValue[] = [];
  private endpoint: string = DEFAULT_LOKI_ENDPOINT;
  private interval: number = DEFAULT_SEND_INTERVAL;

  constructor(params: LokiLogDriverConstructorParams) {
    if (params?.loki?.endpoint) this.endpoint = params.loki.endpoint;
    this.initSender();
  }

  private processLogValue(log: LogValue): LokiLogValue {
    return [String(log.epoch * 1e6), JSON.stringify(sanitize(log))];
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
    fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processed),
    }).catch((e) => {
      this.logs = [...logs, ...this.logs];
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
    }, this.interval);
  }

  log(value: LogValue): void {
    this.logs.push(value);
  }
}
