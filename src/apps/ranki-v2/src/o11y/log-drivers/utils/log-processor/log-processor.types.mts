import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";

export interface LogProcessorStaticConfig {
  sanitizers: LogProcessorSanitizerFuncRecord;
  formatters: LogProcessorFormatterFuncRecord;
  stringifiers: LogProcessorStringifierFuncRecord;
}

type FormatterFunc = (v: unknown) => unknown;

type StringifierFunc = (v: unknown) => unknown;

type LogProcessorFormatterFuncRecord = Record<string, FormatterFunc>;

type LogProcessorStringifierFuncRecord = Record<string, StringifierFunc>;

type LogProcessorSanitizerFuncRecord = Record<string, SanitizerFunc>;

export type LogProcessorConfigureProps = Partial<LogProcessorStaticConfig>;

export type NewLogValueCallback = (value: any) => void;

export interface LogProcessorConstructorParams {
  sanitizer: LogSanitizers | SanitizerFunc;
  formatter: LogFormatters | FormatterFunc;
  stringifier: LogStringifiers | StringifierFunc;
  callback: NewLogValueCallback;
}

export type LogSanitizers = "none" | "basicRepresentation";

export type LogFormatters = "none" | "objectSorter";

export type LogStringifiers = "none" | "jsonOneLine" | "jsonMultiLine" | "yaml";
