import type { SanitizerFunc } from "_/o11y/sanitizers/sanitizer.types.mjs";
import type { LogSanitizers } from "../console-batch/console-batch.types.mjs";

type FileBatchLoggerSanitizerFuncRecord = Record<string, SanitizerFunc>;

export type FileBatchRawLogEntry = any;

export type FileBatchLogDriverConfigureProps =
  Partial<FileBatchLogDriverStaticConfig>;

export interface FileBatchLogDriverStaticConfig {
  sanitizers: FileBatchLoggerSanitizerFuncRecord;
}

export interface FileBatchLogDriverConstructorParams {
  filePath: string;
  sanitizer?: LogSanitizers;
  scheduler?: {
    enabled?: boolean;
    interval?: number;
  };
}
