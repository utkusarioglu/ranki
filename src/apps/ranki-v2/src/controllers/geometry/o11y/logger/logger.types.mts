export type LogAttributes = Record<string, unknown>;

export interface LogDriver {
  log(value: LogValue): void;
}

export type LogValue = {
  elapsed: ReturnType<typeof performance.now>;
  epoch: ReturnType<typeof Date.now>;
} & Record<string, unknown>;

export interface O11yLogDynamicEntriesParams<T> {
  getParentContextValue: (key: string) => unknown;
  owner: T;
}

export type O11yLoggerConstructorParams<T> = {
  attributes?: O11yLoggerDynamicEntriesFunc<T>;
};

export type O11yLoggerDynamicEntriesFunc<T> = (
  p: O11yLogDynamicEntriesParams<T>,
) => Record<string, unknown>;

export interface O11yLoggerStaticConfig {
  drivers?: LogDriver[];
  enabled: boolean;
}
