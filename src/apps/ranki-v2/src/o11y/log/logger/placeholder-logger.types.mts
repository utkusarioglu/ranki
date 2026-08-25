import type { Attributes } from "@opentelemetry/api";
import type { LoggerOptions } from "@opentelemetry/api-logs";

import type { LogToDriversFunc } from "../provider/placeholder-provider.types.mjs";

export interface PlaceholderOtelLoggerConstructorParams {
  attributes?: Attributes;
  callbacks: {
    logToDrivers: LogToDriversFunc;
  };
  name: string;
  options?: LoggerOptions;
}
