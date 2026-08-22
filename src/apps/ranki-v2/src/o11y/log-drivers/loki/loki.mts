import type { LokiLogValue } from "./loki.types.mjs";
import type { LokiLogDriverConstructorParams } from "./loki.types.mjs";

import { Scheduler } from "../utils/scheduler/scheduler.mjs";
import { DEFAULT_LOKI_ENDPOINT } from "./loki.constants.mjs";
import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import { LokiLogProcessor } from "./processor.mjs";
import { LogProcessor } from "../utils/log-processor/log-processor.mjs";
import type { LogRecord } from "@opentelemetry/api-logs";

export class LokiLogDriver implements LogDriver {
  private endpoint: string = DEFAULT_LOKI_ENDPOINT;
  private readonly scheduler: Scheduler<LokiLogValue>;
  private readonly pipe: LogProcessor;

  constructor(params?: LokiLogDriverConstructorParams) {
    this.pipe = new LogProcessor({
      name: "loki",
      sanitizer: "basicRepresentation",
      formatter: (v) => LokiLogProcessor.processLogValue(v as LogRecord),
      callback: (v) => this.scheduler.enqueue(v),
    });
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
    this.pipe.log(value);
  }

  private async sender(v: LokiLogValue[]) {
    const processed = LokiLogProcessor.processLog(v);
    await fetch(this.endpoint, {
      body: JSON.stringify(processed),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  }
}
