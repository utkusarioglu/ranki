import type {
  LogFormatters,
  LogSanitizers,
  LogStringifiers,
} from "../console-batch/console-batch.types.mjs";

export type FileBatchRawLogEntry = any;

export interface FileBatchLogDriverConstructorParams {
  filePath: string;
  stringifier: LogStringifiers;
  sanitizer?: LogSanitizers;
  formatter?: LogFormatters;
  scheduler?: {
    enabled?: boolean;
    interval?: number;
  };
}
