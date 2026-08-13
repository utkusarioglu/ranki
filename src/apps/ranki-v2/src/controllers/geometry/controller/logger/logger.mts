import type {
  LogDriver,
  InstanceEntries,
  LogAttributes,
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

  info(log: string, attributes?: LogAttributes) {
    if (Logger.drivers.length === 0) return;
    Logger.drivers.forEach((driver) => {
      driver.log({
        severity: "INFO",
        epoch: Date.now(),
        elapsed: performance.now(),
        log,
        details: {
          ...this.instanceEntries,
          ...attributes,
        },
      });
    });
  }
}
