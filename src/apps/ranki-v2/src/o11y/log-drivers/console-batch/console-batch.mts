import { assertNever, assertNotUndefined } from "_error/assertions.mjs";
import { trace, type TimeInput } from "@opentelemetry/api";

import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
  ConsoleBatchLogDriverStaticConfig,
} from "./console-batch.types.mjs";
import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import { CallbackLogDriver } from "../callback/callback.mjs";

export class ConsoleBatchLogDriver implements LogDriver {
  private readonly pipe: CallbackLogDriver;
  private static config: ConsoleBatchLogDriverStaticConfig = {
    printers: {
      default: (v) => console.log(v),
    },
    sanitizers: {
      none: (v) => v as LogValue[],
    },
  };
  private timestamp: number = (Date.now() - 1) * 1e6;
  private logs: LogValue[] = [];
  private printerName: string = "default";

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    this.pipe = new CallbackLogDriver({
      stringifier: "none",
      formatter: "none",
      sanitizer: params?.sanitizer || "none",
      callback: (v) => this.logs.push(v),
    });
    if (params?.printer) this.printerName = params.printer;
  }

  public static configure(conf: ConsoleBatchLogDriverConfigureProps) {
    this.config.printers = { ...this.config.printers, ...conf.printers };
    this.config.sanitizers = { ...this.config.sanitizers, ...conf.sanitizers };
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
    const print = this.getPrinter();
    print(filtered, this.timestamp);
  }

  private getPrinter() {
    const printer = ConsoleBatchLogDriver.config.printers[this.printerName];
    assertNotUndefined(printer, {
      details: {
        printerName: this.printerName,
        printers: ConsoleBatchLogDriver.config.printers,
      },
      why: "undefined printer",
    });
    return printer;
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
