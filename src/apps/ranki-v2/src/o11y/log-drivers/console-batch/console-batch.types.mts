import type { LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";

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
export type LogFormatters = "none" | "jsonOneLine" | "jsonMultiLine" | "yaml";
