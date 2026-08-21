import type { LogValue } from "../../ranki-logging.types.mjs";

export type ConsoleBatchLogDriverConfigureProps =
  Partial<ConsoleBatchLogDriverStaticConfig>;

export interface ConsoleBatchLogDriverConstructorParams {
  printer?: LogPrinters;
  sanitizer?: LogSanitizers;
}

export interface ConsoleBatchLogDriverStaticConfig {
  printers: ConsoleBatchLoggerPrinterFuncRecord;
  sanitizers: ConsoleBatchLoggerSanitizerFuncRecord;
}

type ConsoleBatchLoggerSanitizerFuncRecord = Record<string, SanitizerFunc>;
type SanitizerFunc = (v: unknown[], seen?: WeakSet<object>) => LogValue[];

export type ConsoleBatchLoggerPrinterFunc = (
  values: LogValue[],
  elapsed: number,
) => // eslint-disable-next-line  @typescript-eslint/no-explicit-any
any;

export type ConsoleBatchLoggerPrinterFuncRecord = Record<
  string,
  ConsoleBatchLoggerPrinterFunc
>;

export type LogPrinters = "default" | "yamlRow" | "consoleLogRow";
export type LogSanitizers = "none" | "sortedStringified";
