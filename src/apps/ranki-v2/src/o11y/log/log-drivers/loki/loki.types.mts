export interface LokiLog {
  streams: LokiLogStream[];
}

export interface LokiLogDriverConstructorParams {
  endpoint?: string;
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
