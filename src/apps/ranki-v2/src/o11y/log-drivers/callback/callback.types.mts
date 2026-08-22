import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";
import type {
  LogFormatters,
  LogSanitizers,
  LogStringifiers,
} from "../console-batch/console-batch.types.mjs";

export interface CallbackLogDriverStaticConfig {
  sanitizers: CallbackLoggerSanitizerFuncRecord;
  formatters: CallbackLoggerFormatterFuncRecord;
  stringifiers: CallbackLoggerStringifierFuncRecord;
}

type FormatterFunc = (v: unknown) => unknown;

type StringifierFunc = (v: unknown) => unknown;

type CallbackLoggerFormatterFuncRecord = Record<string, FormatterFunc>;

type CallbackLoggerStringifierFuncRecord = Record<string, StringifierFunc>;

type CallbackLoggerSanitizerFuncRecord = Record<string, SanitizerFunc>;

export type CallbackLogDriverConfigureProps =
  Partial<CallbackLogDriverStaticConfig>;

export type NewLogValueCallback = (value: any) => void;

export interface CallbackLogDriverConstructorParams {
  name: string;
  sanitizer?: LogSanitizers | SanitizerFunc;
  formatter?: LogFormatters | FormatterFunc;
  stringifier?: LogStringifiers | StringifierFunc;
  callback: NewLogValueCallback;
}
