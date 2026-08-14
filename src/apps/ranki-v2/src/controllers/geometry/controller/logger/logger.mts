import type {
  InstanceEntries,
  LogAttributes,
  LogDriver,
} from "./logger.types.mjs";

export class Logger {
  private static drivers: LogDriver[] = [];
  private instanceEntries: InstanceEntries;

  constructor(ins: InstanceEntries) {
    this.instanceEntries = ins;
  }

  static addDriver(driver: LogDriver) {
    Logger.drivers.push(driver);
  }

  static debug(log: string, attributes?: LogAttributes) {
    Logger.log("DEBUG", log, attributes);
  }

  static info(log: string, attributes?: LogAttributes) {
    Logger.log("INFO", log, attributes);
  }

  private static log(
    severity: string,
    log: string,
    attributes?: LogAttributes,
  ) {
    if (Logger.drivers.length === 0) return;
    Logger.drivers.forEach((driver) => {
      driver.log({
        details: attributes,
        elapsed: performance.now(),
        epoch: Date.now(),
        log,
        severity,
      });
    });
  }

  debug(log: string, attributes?: LogAttributes) {
    Logger.debug(log, { ...this.instanceEntries, ...attributes });
  }

  info(log: string, attributes?: LogAttributes) {
    Logger.info(log, { ...this.instanceEntries, ...attributes });
  }
}
