import type { LokiLogValue } from "./loki.types.mjs";
import type { LokiLogDriverConstructorParams } from "./loki.types.mjs";

import { DEFAULT_LOKI_ENDPOINT } from "./loki.constants.mjs";
import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import { LokiLogProcessor } from "./processor.mjs";
import type { LogRecord } from "@opentelemetry/api-logs";
import { CallbackBatchLogDriver } from "../callback-batch/callback-batch.mjs";

export class LokiLogDriver implements LogDriver {
  private readonly back: CallbackBatchLogDriver;
  private endpoint: string = DEFAULT_LOKI_ENDPOINT;

  constructor(params?: LokiLogDriverConstructorParams) {
    this.back = new CallbackBatchLogDriver(this.sender.bind(this), {
      processor: {
        sanitizer: "basicRepresentation",
        stringifier: "none",
        formatter: (v) => LokiLogProcessor.processLogValue(v as LogRecord),
      },
      scheduler: {
        enabled: true,
        interval: 1e4,
        ...params?.scheduler,
      },
    });
    if (params?.endpoint) this.endpoint = params.endpoint;
  }

  public disable() {
    this.back.setSchedulerState({ enabled: false });
  }

  log(value: LogValue): void {
    this.back.log(value);
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
