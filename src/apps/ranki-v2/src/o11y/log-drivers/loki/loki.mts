import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";
import { sanitize } from "../utils/sanitize.utils.mjs";
import type { LokiLogValue, LokiLogStream, LokiLog } from "./loki.types.mjs";
import type { LokiLogDriverConstructorParams } from "./loki.types.mjs";
import { DEFAULT_LOKI_ENDPOINT } from "./loki.constants.mjs";
import { Scheduler } from "../utils/scheduler.utils.mjs";

export class LokiLogDriver implements LogDriver {
  private endpoint: string = DEFAULT_LOKI_ENDPOINT;
  private readonly scheduler: Scheduler<LokiLogValue>;

  constructor(params: LokiLogDriverConstructorParams) {
    if (params?.endpoint) this.endpoint = params.endpoint;
    this.scheduler = new Scheduler(
      (v) => this.sender(v),
      params.scheduler?.interval,
    );
    if (params.scheduler?.enabled) this.scheduler.start();
  }

  private async sender(v: LokiLogValue[]) {
    const processed = this.processLog(v);
    await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processed),
    });
  }

  private processLogValue(log: LogValue): LokiLogValue {
    return [String(log.epoch * 1e6), JSON.stringify(sanitize(log))];
  }

  private processLogStream(values: LokiLogValue[]): LokiLogStream {
    return {
      stream: {
        service_name: "ranki",
      },
      values,
    };
  }

  public disable() {
    this.scheduler.stop();
  }

  private processLog(logs: LokiLogValue[]): LokiLog {
    return { streams: [this.processLogStream(logs)] };
  }

  log(value: LogValue): void {
    this.scheduler.enqueue(this.processLogValue(value));
  }
}
