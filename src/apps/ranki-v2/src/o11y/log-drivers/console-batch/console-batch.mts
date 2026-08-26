import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";

import { assertNever } from "_error/assertions.mjs";
import { type TimeInput, trace } from "@opentelemetry/api";

import type { ConsoleBatchLogDriverConstructorParams } from "./console-batch.types.mjs";

import { LogPrinter } from "../utils/log-printer/log-printer.mjs";
import { LogProcessor } from "../utils/log-processor/log-processor.mjs";

export class ConsoleBatchLogDriver implements LogDriver {
  private logs: LogValue[] = [];
  private readonly pipe: LogProcessor;
  private readonly printer: LogPrinter;
  private timestamp: number = (Date.now() - 1) * 1e6;

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    this.pipe = new LogProcessor({
      callback: (v) => this.logs.push(v),
      formatter: "none",
      sanitizer: params?.sanitizer || "none",
      stringifier: "none",
    });
    this.printer = new LogPrinter({ printer: params?.printer });
  }

  log(v: LogValue) {
    this.pipe.log({ ...v, ...this.getSpanContext() });
  }

  new() {
    const lastElapsed = this.timestamp || 0;
    this.timestamp = Date.now() * 1e6;
    this.query((v) => this.convertTime(v.timestamp || 0) >= lastElapsed);
  }

  query(cb?: (entry: LogValue) => boolean) {
    const filtered = cb ? this.logs.filter(cb) : this.logs;
    this.printer.print(filtered, this.timestamp);
  }

  // TODO there are more time formats to consider in the otel `TimeInput` type
  private convertTime(input: TimeInput) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (typeof input) {
      case "number":
        return input;
      default:
        assertNever({ details: { input }, why: "unknown time input type" });
    }
  }

  private getSpanContext() {
    const span = trace.getActiveSpan();
    const context = span?.spanContext();

    return {
      spanId: context?.spanId,
      traceFlags: context?.traceFlags,
      traceId: context?.traceId,
    };
  }
}
