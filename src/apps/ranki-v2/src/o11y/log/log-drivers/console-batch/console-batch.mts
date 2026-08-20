import { trace } from "@opentelemetry/api";
import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";
import type {
  ConsoleBatchLogDriverConfigureProps,
  ConsoleBatchLogDriverConstructorParams,
  ConsoleBatchLogDriverStaticConfig,
} from "./console-batch.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class ConsoleBatchLogDriver implements LogDriver {
  private elapsed = Date.now() - 1000;
  private logs: LogValue[] = [];
  private printerName: string = "default";
  private static config: ConsoleBatchLogDriverStaticConfig = {
    printers: {
      default: (v) => console.log(v),
    },
  };

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    if (params?.printer) this.printerName = params.printer;
  }

  public static configure(conf: ConsoleBatchLogDriverConfigureProps) {
    this.config.printers = { ...this.config.printers, ...conf.printers };
  }

  private span() {
    const span = trace.getActiveSpan();
    const context = span?.spanContext();

    return {
      traceId: context?.traceId,
      spanId: context?.spanId,
      traceFlags: context?.traceFlags,
    };
  }

  log(v: LogValue) {
    this.logs.push({
      ...v,
      ...this.span(),
    });
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
      why: "undefined printer",
      details: {
        printerName: this.printerName,
        printers: ConsoleBatchLogDriver.config.printers,
      },
    });
    return printer;
  }

  dump() {
    this.getPrinter()(this.logs, this.elapsed);
  }

  new() {
    const lastElapsed = this.elapsed;
    this.elapsed = performance.now();
    this.query((v) => v.elapsed >= lastElapsed);
  }

  query(cb: (entry: LogValue) => boolean) {
    this.getPrinter()(this.logs.filter(cb), this.elapsed);
  }
}
