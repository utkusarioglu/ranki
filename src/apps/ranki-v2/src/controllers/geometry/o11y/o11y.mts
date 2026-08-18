import type {
  EmptyClass,
  GeometryO11yStaticConfig,
  O11yConstructorConfig,
} from "./o11y.types.mjs";

import { O11yDebugger } from "./debug/debug.mjs";
import { O11yLogger } from "./logger/logger.mjs";
import { O11yTracer } from "./tracer/tracer.mjs";
import { O11yMetrics } from "./meter/meter.mjs";

export class O11y<T extends EmptyClass> {
  public static readonly debug = O11yDebugger;
  public static readonly log = O11yLogger;
  public readonly log: O11yLogger;
  public readonly trace: O11yTracer<T>;
  public readonly meter: O11yMetrics<T>;

  constructor(owner: T, extra?: O11yConstructorConfig<T>) {
    this.trace = new O11yTracer(owner, extra?.tracer);
    this.log = new O11yLogger({
      class: owner.constructor.name,
      ...extra?.logger,
    });
    this.meter = new O11yMetrics(owner);
  }

  public static configure(conf: GeometryO11yStaticConfig) {
    if (conf.log?.drivers) {
      conf.log.drivers.forEach((dr) => {
        O11yLogger.addDriver(dr);
      });
    }
    if (conf.debug?.sequencer?.stutter) {
      O11yDebugger.DEBUG_DELAY = conf.debug.sequencer.stutter;
    }
  }
}
