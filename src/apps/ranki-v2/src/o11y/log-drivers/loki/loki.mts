import type { LokiLog, LokiLogStream, LokiLogValue } from "./loki.types.mjs";
import type { LokiLogDriverConstructorParams } from "./loki.types.mjs";

import { Scheduler } from "../utils/scheduler.utils.mjs";
import { DEFAULT_LOKI_ENDPOINT } from "./loki.constants.mjs";
import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";

export class LokiLogDriver implements LogDriver {
  private endpoint: string = DEFAULT_LOKI_ENDPOINT;
  private readonly scheduler: Scheduler<LokiLogValue>;

  constructor(params?: LokiLogDriverConstructorParams) {
    if (params?.endpoint) this.endpoint = params.endpoint;
    this.scheduler = new Scheduler(
      (v) => this.sender(v),
      params?.scheduler?.interval,
    );
    if (params?.scheduler?.enabled) this.scheduler.start();
  }

  public disable() {
    this.scheduler.stop();
  }

  log(value: LogValue): void {
    this.scheduler.enqueue(this.processLogValue(value));
  }

  private processLog(logs: LokiLogValue[]): LokiLog {
    return { streams: [this.processLogStream(logs)] };
  }

  private processLogStream(values: LokiLogValue[]): LokiLogStream {
    return {
      stream: {
        service_name: "ranki",
      },
      values,
    };
  }

  private processLogValue(log: LogValue): LokiLogValue {
    return [String(log.timestamp), JSON.stringify(log)];
  }

  private async sender(v: LokiLogValue[]) {
    const processed = this.processLog(v);
    await fetch(this.endpoint, {
      body: JSON.stringify(processed),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }
}
