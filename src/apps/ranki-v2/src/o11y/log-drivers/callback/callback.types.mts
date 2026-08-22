import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";
import type {
  LogFormatters,
  LogSanitizers,
} from "../console-batch/console-batch.types.mjs";

export interface CallbackLogDriverStaticConfig {
  sanitizers: CallbackLoggerSanitizerFuncRecord;
  formatters: CallbackLoggerFormatterFuncRecord;
}

type FormatterFunc = (v: unknown) => unknown;

type CallbackLoggerFormatterFuncRecord = Record<string, FormatterFunc>;

type CallbackLoggerSanitizerFuncRecord = Record<string, SanitizerFunc>;

export type CallbackLogDriverConfigureProps =
  Partial<CallbackLogDriverStaticConfig>;

export type NewLogValueCallback = (value: any) => void;

export interface CallbackLogDriverConstructorParams {
  sanitizer?: LogSanitizers;
  formatter?: LogFormatters;
  callback: NewLogValueCallback;
}
