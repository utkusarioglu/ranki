import type { LogSanitizers } from "../console-batch/console-batch.types.mjs";

export interface LokiLog {
  streams: LokiLogStream[];
}

export interface LokiLogDriverConstructorParams {
  endpoint?: string;
  sanitizer: LogSanitizers;
  scheduler?: {
    enabled?: boolean;
    interval?: number;
  };
}

export interface LokiLogStream {
  stream: {
    service_name: string;
  };
  values: LokiLogValue[];
}

export type LokiLogValue = [string, string];
