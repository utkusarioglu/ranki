import { trace, type Tracer } from "@opentelemetry/api";
import { Logger } from "../logger/logger.mjs";
import { Debug } from "../debug/debug.mjs";
import type { LogDriver } from "../logger/logger.types.mjs";

class EmptyClass {
  // prototype: { name: string };
}

class O11yTracer<T extends EmptyClass> {
  private readonly owner: T;
  public readonly tracer: Tracer;

  constructor(owner: T) {
    this.owner = owner;
    this.tracer = trace.getTracer(this.owner.constructor.name);
  }
}

export interface GeometryO11yStaticConfig {
  debug?: {
    sequencer?: {
      stutter?: number;
    };
  };
  log?: {
    drivers?: LogDriver[];
  };
}

export interface O11yConstructorConfig {
  logger: Record<string, unknown>;
}

export class O11y<T extends EmptyClass> {
  private readonly owner: T;
  public readonly trace: O11yTracer<T>;
  public readonly log: Logger;
  public static readonly log = Logger;
  public static readonly debug = Debug;

  constructor(owner: T, extra?: O11yConstructorConfig) {
    this.owner = owner;
    this.trace = new O11yTracer(owner);
    this.log = new Logger({
      class: owner.constructor.name,
      ...extra?.logger,
    });
  }

  public static configure(conf: GeometryO11yStaticConfig) {
    if (conf.log?.drivers) {
      conf.log.drivers.forEach((dr) => {
        Logger.addDriver(dr);
      });
    }
    if (conf.debug?.sequencer?.stutter) {
      Debug.DEBUG_DELAY = conf.debug.sequencer.stutter;
    }
  }
}
