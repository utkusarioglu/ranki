import type { Attributes } from "@opentelemetry/api";
import type { LoggerOptions, AnyValueMap } from "@opentelemetry/api-logs";
import type { LogToDriversFunc } from "./placeholder-provider.mjs";

interface PlaceholderOtelLoggerConstructorParams {
  name: string;
  options?: LoggerOptions;
  attributes?: Attributes;
  callbacks: {
    logToDrivers: LogToDriversFunc;
  };
}

export class PlaceholderOtelLogger {
  private logToDrivers: LogToDriversFunc;
  private name: string;
  // @ts-expect-error
  private attributes: Attributes;
  // @ts-expect-error
  private options: LoggerOptions;

  constructor(p: PlaceholderOtelLoggerConstructorParams) {
    this.name = p.name;
    this.options = p.options || {};
    this.attributes = p.attributes || {};
    this.logToDrivers = p.callbacks.logToDrivers;
  }

  public emit(v: AnyValueMap) {
    this.logToDrivers({
      logger: this.name,
      ...v,
    });
  }

  public enabled() {
    return true;
  }
}
