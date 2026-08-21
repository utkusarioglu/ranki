import type { Attributes } from "@opentelemetry/api";
import type { LoggerOptions, LogRecord } from "@opentelemetry/api-logs";
import type { LogToDriversFunc } from "../provider/placeholder-provider.types.mjs";
import type { PlaceholderOtelLoggerConstructorParams } from "./placeholder-logger.types.mjs";

export class PlaceholderOtelLogger {
  private logToDrivers: LogToDriversFunc;
  private name: string;
  private attributes: Attributes;
  // @ts-expect-error
  private options: LoggerOptions;

  constructor(p: PlaceholderOtelLoggerConstructorParams) {
    this.name = p.name;
    this.options = p.options || {};
    this.attributes = p.attributes || {};
    this.logToDrivers = p.callbacks.logToDrivers;
  }

  public emit(log: LogRecord) {
    this.logToDrivers({
      timestamp: Date.now() * 1e6,
      ...log,
      attributes: {
        logger: this.name,
        ...this.attributes,
        ...log.attributes,
      },
    });
  }

  // TODO
  public enabled() {
    return true;
  }
}
