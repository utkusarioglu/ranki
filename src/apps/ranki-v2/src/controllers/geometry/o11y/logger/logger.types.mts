export type InstanceEntries = Record<string, unknown>;

export type LogAttributes = Record<string, unknown>;

export interface LogDriver {
  log(value: LogValue): void;
}

export type LogValue = {
  elapsed: ReturnType<typeof performance.now>;
  epoch: ReturnType<typeof Date.now>;
} & Record<string, unknown>;
