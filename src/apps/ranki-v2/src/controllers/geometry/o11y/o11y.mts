import type {
  EmptyClass,
  O11yStaticConfig,
  O11yConstructorConfig,
  O11yInternalStaticConfig,
} from "./o11y.types.mjs";

import { O11yDebugger } from "./debug/debug.mjs";
import { O11yLogger } from "./logger/logger.mjs";
import { O11yLogger as O11yLoggerMock } from "./logger/mock/logger.mock.mjs";
import { O11yMeter } from "./meter/meter.mjs";
import { O11yMeter as O11yMeterMock } from "./meter/mock/meter.mock.mjs";
import { O11yTracer } from "./tracer/tracer.mjs";
import { O11yTracer as O11yTracerMock } from "./tracer/mock/tracer.mock.mjs";

export class O11y<T extends EmptyClass> {
  public static readonly debug = O11yDebugger;
  public static readonly log = O11yLogger;
  public readonly log: O11yLogger;
  public readonly meter: O11yMeter<T>;
  public readonly trace: O11yTracer<T>;
  private static STATIC_CONFIG: O11yInternalStaticConfig = {
    metricsEnabled: false,
    logEnabled: false,
    traceEnabled: false,
    debugEnabled: false,
  };

  constructor(owner: T, extra?: O11yConstructorConfig<T>) {
    this.trace = O11y.STATIC_CONFIG.traceEnabled
      ? new O11yTracer(owner, extra?.tracer)
      : (new O11yTracerMock() as O11yTracer<T>);

    this.log = O11y.STATIC_CONFIG.logEnabled
      ? (this.log = new O11yLogger({
          class: owner.constructor.name,
          ...extra?.logger,
        }))
      : (new O11yLoggerMock() as unknown as O11yLogger);

    this.meter = O11y.STATIC_CONFIG.metricsEnabled
      ? new O11yMeter(owner, extra?.meter)
      : (new O11yMeterMock() as unknown as O11yMeter<T>);
  }

  public static configure(conf: O11yStaticConfig) {
    O11y.STATIC_CONFIG = {
      metricsEnabled:
        conf.metrics?.enabled || O11y.STATIC_CONFIG.metricsEnabled,
      logEnabled: conf.log?.enabled || O11y.STATIC_CONFIG.logEnabled,
      traceEnabled: conf.trace?.enabled || O11y.STATIC_CONFIG.traceEnabled,
      debugEnabled: conf.debug?.enabled || O11y.STATIC_CONFIG.debugEnabled,
    };
    if (conf.log) O11yLogger.configure(conf.log);
    if (conf.debug) O11yDebugger.configure(conf.debug);
  }
}
