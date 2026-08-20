import type { LogValue } from "_controllers/geometry/o11y/logger/logger.types.mjs";

export type ConsoleBatchLoggerPrinterFunc = (
  values: LogValue[],
  elapsed: number,
) => any;

export type LogPrinters = "default" | "sanitizedYamlPrinter";

export type ConsoleBatchLoggerPrinterFuncRecord = Record<
  string,
  ConsoleBatchLoggerPrinterFunc
>;

export interface ConsoleBatchLogDriverConstructorParams {
  printer?: LogPrinters;
}

export interface ConsoleBatchLogDriverStaticConfig {
  printers: ConsoleBatchLoggerPrinterFuncRecord;
}

export type ConsoleBatchLogDriverConfigureProps =
  Partial<ConsoleBatchLogDriverStaticConfig>;
