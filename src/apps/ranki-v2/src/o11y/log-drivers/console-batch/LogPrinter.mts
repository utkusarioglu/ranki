import type { LogRecord } from "@opentelemetry/api-logs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { ConsoleBatchLogDriverStaticConfig } from "./console-batch.types.mjs";

interface LogPrinterConstructorParams {
  printer?: string;
}

export class LogPrinter {
  private printerName: string = "default";

  constructor(params?: LogPrinterConstructorParams) {
    if (params?.printer) this.printerName = params.printer;
  }

  private static config: ConsoleBatchLogDriverStaticConfig = {
    printers: {
      default: (v) => console.log(v),
    },
  };

  static configure(conf: ConsoleBatchLogDriverStaticConfig) {
    this.config.printers = { ...this.config.printers, ...conf.printers };
  }

  print(values: LogRecord[], timestamp: number) {
    const printer = this.getPrinter();
    printer(values, timestamp);
  }

  private getPrinter() {
    const printer = LogPrinter.config.printers[this.printerName];
    assertNotUndefined(printer, {
      details: {
        printerName: this.printerName,
        printers: LogPrinter.config.printers,
      },
      why: "undefined printer",
    });
    return printer;
  }
}
