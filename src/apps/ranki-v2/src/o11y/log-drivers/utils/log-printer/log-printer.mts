import type { LogRecord } from "@opentelemetry/api-logs";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { ConsoleBatchLoggerPrinterFuncRecord } from "../../console-batch/console-batch.types.mjs";

interface LogPrinterConstructorParams {
  printer?: string;
}

type LogPrinterStaticConfig = ConsoleBatchLoggerPrinterFuncRecord;

export class LogPrinter {
  private static printers: LogPrinterStaticConfig = {
    default: (v) => console.log(v),
  };

  private printerName: string = "default";

  constructor(params?: LogPrinterConstructorParams) {
    if (params?.printer) this.printerName = params.printer;
  }

  static configure(printers: ConsoleBatchLoggerPrinterFuncRecord) {
    this.printers = { ...this.printers, ...printers };
  }

  print(values: LogRecord[], timestamp: number) {
    const printer = this.getPrinter();
    printer(values, timestamp);
  }

  private getPrinter() {
    const printer = LogPrinter.printers[this.printerName];
    assertNotUndefined(printer, {
      details: {
        printerName: this.printerName,
        printers: LogPrinter.printers.printers,
      },
      why: "undefined printer",
    });
    return printer;
  }
}
