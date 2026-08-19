import type { LogDriver } from "./logger/logger.types.mjs";
import type { O11yMeterConstructorParams } from "./meter/meter.types.mjs";
import type { O11yTracerConstructorParams } from "./tracer/tracer.types.mjs";

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

export interface O11yConstructorConfig<T> {
  logger?: Record<string, unknown>;
  meter?: O11yMeterConstructorParams<T>;
  tracer?: O11yTracerConstructorParams<T>;
}

export class EmptyClass {}
