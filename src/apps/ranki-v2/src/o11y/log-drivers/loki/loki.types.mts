export type LokiLogValue = [string, string];

export interface LokiLogStream {
  stream: {
    service_name: string;
  };
  values: LokiLogValue[];
}

export interface LokiLog {
  streams: LokiLogStream[];
}

export interface LokiLogDriverConstructorParams {
  endpoint?: string;
  scheduler?: {
    interval?: number;
    enabled?: boolean;
  };
}
