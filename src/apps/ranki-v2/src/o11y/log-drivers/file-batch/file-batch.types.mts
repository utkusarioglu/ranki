import type {
  LogFormatters,
  LogSanitizers,
  LogStringifiers,
} from "../utils/log-processor/log-processor.types.mjs";

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
