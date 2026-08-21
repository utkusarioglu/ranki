import type {
  EmptyClass,
  O11yConstructorConfig,
  O11yInternalStaticConfig,
  O11yStaticConfig,
} from "./o11y.types.mjs";

import { O11yDebugger } from "./debug/debug.mjs";
import { O11yLogger } from "./logger/logger.mjs";
import { O11yLogger as O11yLoggerMock } from "./logger/mock/logger.mock.mjs";
import { O11yMeter } from "./meter/meter.mjs";
import { O11yMeter as O11yMeterMock } from "./meter/mock/meter.mock.mjs";
import { O11yTracer as O11yTracerMock } from "./tracer/mock/tracer.mock.mjs";
import { O11yTracer } from "./tracer/tracer.mjs";

export class O11y<T extends EmptyClass> {
  public static readonly debug = O11yDebugger;
  private static STATIC_CONFIG: O11yInternalStaticConfig = {
    debugEnabled: false,
    logEnabled: false,
    metricsEnabled: false,
    traceEnabled: false,
  };
  public readonly log: O11yLogger<T>;
  public readonly meter: O11yMeter<T>;
  public readonly trace: O11yTracer<T>;
  public readonly debug = O11yDebugger;

  constructor(owner: T, extra?: O11yConstructorConfig<T>) {
    this.trace = O11y.STATIC_CONFIG.traceEnabled
      ? new O11yTracer(owner, extra?.tracer)
      : (new O11yTracerMock() as O11yTracer<T>);

    this.log = O11y.STATIC_CONFIG.logEnabled
      ? (this.log = new O11yLogger(owner, extra?.logger))
      : (new O11yLoggerMock() as unknown as O11yLogger<T>);

    this.meter = O11y.STATIC_CONFIG.metricsEnabled
      ? new O11yMeter(owner, extra?.meter)
      : (new O11yMeterMock() as unknown as O11yMeter<T>);
  }

  public static configure(conf: O11yStaticConfig) {
    O11y.STATIC_CONFIG = {
      debugEnabled: conf.debug?.enabled || O11y.STATIC_CONFIG.debugEnabled,
      logEnabled: conf.log?.enabled || O11y.STATIC_CONFIG.logEnabled,
      metricsEnabled:
        conf.metrics?.enabled || O11y.STATIC_CONFIG.metricsEnabled,
      traceEnabled: conf.trace?.enabled || O11y.STATIC_CONFIG.traceEnabled,
    };
    // if (conf.log) O11yLogger.configure(conf.log);
    if (conf.debug) O11yDebugger.configure(conf.debug);
  }
}
