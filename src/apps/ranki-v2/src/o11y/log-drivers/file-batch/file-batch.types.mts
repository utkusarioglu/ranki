import type {
  LogFormatters,
  LogSanitizers,
  LogStringifiers,
} from "../utils/log-processor/log-processor.types.mjs";

export interface FileBatchLogDriverConstructorParams {
  filePath: string;
  formatter?: LogFormatters;
  sanitizer?: LogSanitizers;
  scheduler?: {
    enabled?: boolean;
    interval?: number;
  };
  stringifier: LogStringifiers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FileBatchRawLogEntry = { type?: "RawLogEntry" } & any;
