import {
  type Logger,
  type LoggerOptions,
  type LoggerProvider,
  type LogRecord,
} from "@opentelemetry/api-logs";
import { trace, type Attributes } from "@opentelemetry/api";
import type { LogDriver } from "./ranki-logging.types.mjs";
import { PlaceholderOtelLogger } from "./placeholder-logger.mjs";

interface MyLoggerProviderConstructorProps {
  drivers: LogDriver[];
}

export type LogToDriversFunc = (p: LogRecord) => void;

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

  private logToDrivers(log: LogRecord) {
    this.drivers.forEach((driver) => {
      driver.log({
        ...log,
        ...PlaceholderOtelLoggerProvider.prepareTrace(),
      });
    });
  }

  getLogger(
    name: string,
    // @ts-expect-error yet unused
    version?: string,
    options?: LoggerOptions,
    attributes?: Attributes,
  ): Logger {
    return new PlaceholderOtelLogger({
      name,
      options,
      attributes,
      callbacks: {
        logToDrivers: this.logToDrivers.bind(this),
      },
    });
  }
}
