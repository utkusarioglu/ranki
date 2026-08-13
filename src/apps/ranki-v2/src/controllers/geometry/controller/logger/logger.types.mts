export type LogAttributes = Record<string, any>;

export type LogValue = any;

export interface LogDriver {
  log(value: LogValue): void;
}
export type InstanceEntries = Record<string, string | number | boolean>;
