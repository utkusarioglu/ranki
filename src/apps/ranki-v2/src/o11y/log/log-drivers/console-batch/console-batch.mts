import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";

import { assertNotUndefined } from "_error/assertions.mjs";
import { trace } from "@opentelemetry/api";

import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
  ConsoleBatchLogDriverStaticConfig,
} from "./console-batch.types.mjs";

export class ConsoleBatchLogDriver implements LogDriver {
  private static config: ConsoleBatchLogDriverStaticConfig = {
    printers: {
      default: (v) => console.log(v),
    },
  };
  private elapsed = Date.now() - 1000;
  private logs: LogValue[] = [];
  private printerName: string = "default";

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    if (params?.printer) this.printerName = params.printer;
  }

  public static configure(conf: ConsoleBatchLogDriverConfigureProps) {
    this.config.printers = { ...this.config.printers, ...conf.printers };
  }

  dump() {
    this.getPrinter()(this.logs, this.elapsed);
  }

  log(v: LogValue) {
    this.logs.push({
      ...v,
      ...this.span(),
    });
  }

  new() {
    const lastElapsed = this.elapsed;
    this.elapsed = performance.now();
    this.query((v) => v.elapsed >= lastElapsed);
  }

  query(cb: (entry: LogValue) => boolean) {
    this.getPrinter()(this.logs.filter(cb), this.elapsed);
  }

  private getPrinter() {
    const printer = ConsoleBatchLogDriver.config.printers[this.printerName];
    console.log(
      "p",
      printer,
      this.printerName,
      ConsoleBatchLogDriver.config.printers,
    );
    assertNotUndefined(printer, {
      details: {
        printerName: this.printerName,
        printers: ConsoleBatchLogDriver.config.printers,
      },
      why: "undefined printer",
    });
    return printer;
  }

  private span() {
    const span = trace.getActiveSpan();
    const context = span?.spanContext();

    return {
      spanId: context?.spanId,
      traceFlags: context?.traceFlags,
      traceId: context?.traceId,
    };
  }
}
