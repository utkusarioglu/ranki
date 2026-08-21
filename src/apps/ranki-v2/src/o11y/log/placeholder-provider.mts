import {
  type AnyValueMap,
  type Logger,
  type LoggerOptions,
  type LoggerProvider,
} from "@opentelemetry/api-logs";
import { trace, type Attributes } from "@opentelemetry/api";
import type { LogDriver } from "./ranki-logging.types.mjs";
import { PlaceholderOtelLogger } from "./placeholder-logger.mjs";

interface MyLoggerProviderConstructorProps {
  drivers: LogDriver[];
}

export type LogToDriversFunc = (p: AnyValueMap) => void;

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

  private logToDrivers(v: AnyValueMap) {
    this.drivers.forEach((driver) => {
      driver.log({
        ...v,
        ...PlaceholderOtelLoggerProvider.prepareTrace(),
        // details: attributes,
        elapsed: performance.now(),
        epoch: Date.now(),
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
