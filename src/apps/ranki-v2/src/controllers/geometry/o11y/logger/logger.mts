import { context, trace } from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  LogAttributes,
  LogDriver,
  O11yLoggerConstructorParams,
  O11yLoggerDynamicEntriesFunc,
  O11yLoggerStaticConfig,
} from "./logger.types.mjs";

import { O11yTracer } from "../tracer/tracer.mjs";

export class O11yLogger<T extends EmptyClass> {
  private static drivers: LogDriver[] = [];
  private commonAttributes: O11yLoggerDynamicEntriesFunc<T> | undefined;
  private owner: T;

  constructor(owner: T, params?: O11yLoggerConstructorParams<T>) {
    this.owner = owner;
    this.commonAttributes = params?.attributes;
  }

  static addDriver(driver: LogDriver) {
    O11yLogger.drivers.push(driver);
  }

  public static configure(conf: O11yLoggerStaticConfig) {
    if (conf.drivers) {
      conf.drivers.forEach((dr) => {
        O11yLogger.addDriver(dr);
      });
    }
  }

  // static debug(f: Function, context?: ClassMethodDecoratorContext): void;
  // static debug(log: string, attributes?: LogAttributes): void;
  static debug(
    // first: string | Function,
    // second?: LogAttributes | ClassMethodDecoratorContext,
    first: string,
    second?: LogAttributes,
  ) {
    // if (typeof second === "object" && second?.kind === "method") {
    //   // decorator invocation
    //   const method = first as Function;
    //   const context = second;

    //   return function (this: { o11y: O11y<any> }, ...args: unknown[]) {
    //     this.o11y.log.debug(`method ${String(context.name)} called`, {
    //       arguments: args,
    //     });

    //     return method.apply(this, args);
    //   };
    // }

    O11yLogger.log("DEBUG", first as string, second as LogAttributes);
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
    O11yLogger.debug(log, { ...this.getEntries(), ...attributes });
  }

  info(log: string, attributes?: LogAttributes) {
    O11yLogger.info(log, { ...this.getEntries(), ...attributes });
  }

  private getEntries() {
    const ctx = context.active();
    const getParentContextValue = O11yTracer.getCtxValueFactory(ctx);
    return this.commonAttributes
      ? this.commonAttributes({
          getParentContextValue,
          owner: this.owner,
        })
      : {};
  }
}
