import { assertNever } from "_error/assertions.mjs";
import { trace, type TimeInput } from "@opentelemetry/api";

import type { ConsoleBatchLogDriverConstructorParams } from "./console-batch.types.mjs";
import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import { PipeProcessor } from "../utils/pipe/pipe.mjs";
import { LogPrinter } from "./LogPrinter.mjs";
export class ConsoleBatchLogDriver implements LogDriver {
  private readonly pipe: PipeProcessor;
  private readonly printer: LogPrinter;
  private timestamp: number = (Date.now() - 1) * 1e6;
  private logs: LogValue[] = [];

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    this.pipe = new PipeProcessor({
      name: "console",
      stringifier: "none",
      formatter: "none",
      sanitizer: params?.sanitizer || "none",
      callback: (v) => this.logs.push(v),
    });
    this.printer = new LogPrinter({ printer: params?.printer });
  }

  log(v: LogValue) {
    this.pipe.log({ ...v, ...this.getSpanContext() });
  }

  // TODO
  private timeInputToTime(input: TimeInput) {
    switch (typeof input) {
      case "number":
        return input;
      default:
        assertNever({ why: "unknown time input type", details: { input } });
    }
  }

  new() {
    const lastElapsed = this.timestamp || 0;
    this.timestamp = Date.now() * 1e6;
    this.query((v) => this.timeInputToTime(v.timestamp || 0) >= lastElapsed);
  }

  query(cb?: (entry: LogValue) => boolean) {
    const filtered = cb ? this.logs.filter(cb) : this.logs;
    this.printer.print(filtered, this.timestamp);
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
