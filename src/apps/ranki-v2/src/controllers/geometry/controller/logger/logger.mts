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

  info(log: string, attributes?: LogAttributes) {
    if (Logger.drivers.length === 0) return;
    Logger.drivers.forEach((driver) => {
      driver.log({
        details: {
          ...this.instanceEntries,
          ...attributes,
        },
        elapsed: performance.now(),
        epoch: Date.now(),
        log,
        severity: "INFO",
      });
    });
  }
}
