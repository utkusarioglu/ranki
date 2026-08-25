import type { LogDriver } from "_/o11y/log/ranki-logging.types.mjs";
import type { AnyValueMap } from "@opentelemetry/api-logs";

export type O11yLogAttributes = AnyValueMap;

export interface O11yLogDynamicEntriesParams<T> {
  getParentContextValue: (key: string) => unknown;
  owner: T;
}

export type O11yLoggerConstructorParams<T> = {
  attributes?: O11yLoggerDynamicEntriesFunc<T>;
};

export type O11yLoggerDynamicEntriesFunc<T> = (
  p: O11yLogDynamicEntriesParams<T>,
) => O11yLogAttributes;

export interface O11yLoggerStaticConfig {
  drivers?: LogDriver[];
  enabled: boolean;
}
