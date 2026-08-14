export type InstanceEntries = Record<string, boolean | number | string>;

export type LogAttributes = Record<string, unknown>;

export interface LogDriver {
  log(value: LogValue): void;
}
export type LogValue = unknown;
