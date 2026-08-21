import type { LogValue } from "../../ranki-logging.types.mjs";

export type ConsoleBatchLogDriverConfigureProps =
  Partial<ConsoleBatchLogDriverStaticConfig>;

export interface ConsoleBatchLogDriverConstructorParams {
  printer?: LogPrinters;
}

export interface ConsoleBatchLogDriverStaticConfig {
  printers: ConsoleBatchLoggerPrinterFuncRecord;
}

export type ConsoleBatchLoggerPrinterFunc = (
  values: LogValue[],
  elapsed: number,
) => // eslint-disable-next-line  @typescript-eslint/no-explicit-any
any;

export type ConsoleBatchLoggerPrinterFuncRecord = Record<
  string,
  ConsoleBatchLoggerPrinterFunc
>;

export type LogPrinters = "default" | "sanitizedYamlPrinter";
