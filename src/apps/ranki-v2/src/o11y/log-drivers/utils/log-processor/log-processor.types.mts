import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";

export type LogFormatters = "none" | "objectSorter";

export type LogProcessorConfigureProps = Partial<LogProcessorStaticConfig>;

export interface LogProcessorConstructorParams {
  callback: NewLogValueCallback;
  formatter: FormatterFunc | LogFormatters;
  sanitizer: LogSanitizers | SanitizerFunc;
  stringifier: LogStringifiers | StringifierFunc;
}

export interface LogProcessorStaticConfig {
  formatters: LogProcessorFormatterFuncRecord;
  sanitizers: LogProcessorSanitizerFuncRecord;
  stringifiers: LogProcessorStringifierFuncRecord;
}

export type LogSanitizers = "basicRepresentation" | "none";

export type LogStringifiers = "jsonMultiLine" | "jsonOneLine" | "none" | "yaml";

export type NewLogValueCallback = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
) => void;

type FormatterFunc = (v: unknown) => unknown;

type LogProcessorFormatterFuncRecord = Record<string, FormatterFunc>;

type LogProcessorSanitizerFuncRecord = Record<string, SanitizerFunc>;

type LogProcessorStringifierFuncRecord = Record<string, StringifierFunc>;

type StringifierFunc = (v: unknown) => unknown;
