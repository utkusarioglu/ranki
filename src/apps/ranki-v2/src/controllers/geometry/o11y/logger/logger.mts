import { trace } from "@opentelemetry/api";

import type {
  InstanceEntries,
  LogAttributes,
  LogDriver,
} from "./logger.types.mjs";

export class O11yLogger {
  private static drivers: LogDriver[] = [];
  private instanceEntries: InstanceEntries;

  constructor(ins: InstanceEntries) {
    this.instanceEntries = ins;
  }

  static addDriver(driver: LogDriver) {
    O11yLogger.drivers.push(driver);
  }

  static debug(log: string, attributes?: LogAttributes) {
    O11yLogger.log("DEBUG", log, attributes);
  }

  static info(log: string, attributes?: LogAttributes) {
    O11yLogger.log("INFO", log, attributes);
  }

  private static log(
    severity: string,
    log: string,
    attributes?: LogAttributes,
  ) {
    if (O11yLogger.drivers.length === 0) return;
    O11yLogger.drivers.forEach((driver) => {
      driver.log({
        details: attributes,
        elapsed: performance.now(),
        epoch: Date.now(),
        log,
        severity,
        ...O11yLogger.prepareTrace(),
      });
    });
  }

  private static prepareTrace() {
    const spanContext = trace.getActiveSpan()?.spanContext();
    return {
      spanId: spanContext?.spanId,
      traceFlags: spanContext?.traceFlags,
      traceId: spanContext?.traceId,
    };
  }

  debug(log: string, attributes?: LogAttributes) {
    O11yLogger.debug(log, { ...this.instanceEntries, ...attributes });
  }

  info(log: string, attributes?: LogAttributes) {
    O11yLogger.info(log, { ...this.instanceEntries, ...attributes });
  }
}
