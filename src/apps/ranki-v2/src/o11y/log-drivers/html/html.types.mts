import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";
import type { LogSanitizers } from "../console-batch/console-batch.types.mjs";

export interface HtmlLogDriverStaticConfig {
  sanitizers: HtmlLoggerSanitizerFuncRecord;
}

type HtmlLoggerSanitizerFuncRecord = Record<string, SanitizerFunc>;

export type HtmlLogDriverConfigureProps = Partial<HtmlLogDriverStaticConfig>;

export interface HtmlLogDriverConstructorParams {
  sanitizer?: LogSanitizers;
}
