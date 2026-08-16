import { O11yLogger } from "./logger/logger.mjs";
import { O11yDebugger } from "./debug/debug.mjs";
import { O11yTracer } from "./tracer/tracer.mjs";
import type {
  EmptyClass,
  O11yConstructorConfig,
  GeometryO11yStaticConfig,
} from "./o11y.types.mjs";

export class O11y<T extends EmptyClass> {
  public readonly trace: O11yTracer<T>;
  public readonly log: O11yLogger;
  public static readonly log = O11yLogger;
  public static readonly debug = O11yDebugger;

  constructor(owner: T, extra?: O11yConstructorConfig) {
    this.trace = new O11yTracer(owner, extra?.tracer);
    this.log = new O11yLogger({
      class: owner.constructor.name,
      ...extra?.logger,
    });
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
