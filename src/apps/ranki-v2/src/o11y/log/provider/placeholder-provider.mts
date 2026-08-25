import { type Attributes, trace } from "@opentelemetry/api";
import {
  type Logger,
  type LoggerOptions,
  type LoggerProvider,
  type LogRecord,
} from "@opentelemetry/api-logs";

import type { LogDriver } from "../ranki-logging.types.mjs";
import type { MyLoggerProviderConstructorProps } from "./placeholder-provider.types.mjs";

import { PlaceholderOtelLogger } from "../logger/placeholder-logger.mjs";

export class PlaceholderOtelLoggerProvider implements LoggerProvider {
  private drivers: LogDriver[] = [];

  constructor(params: MyLoggerProviderConstructorProps) {
    this.drivers = params.drivers;
  }

  private static prepareTrace() {
    const spanContext = trace.getActiveSpan()?.spanContext();
    return {
      spanId: spanContext?.spanId,
      traceFlags: spanContext?.traceFlags,
      traceId: spanContext?.traceId,
    };
  }

  getLogger(
    name: string,
    // @ts-expect-error yet unused
    version?: string,
    options?: LoggerOptions,
    attributes?: Attributes,
  ): Logger {
    return new PlaceholderOtelLogger({
      attributes,
      callbacks: {
        logToDrivers: this.logToDrivers.bind(this),
      },
      name,
      options,
    });
  }

  private logToDrivers(log: LogRecord) {
    this.drivers.forEach((driver) => {
      driver.log({
        ...log,
        ...PlaceholderOtelLoggerProvider.prepareTrace(),
      });
    });
  }
}
