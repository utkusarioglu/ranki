import type { LogDriver } from "./logger/logger.types.mjs";
import type { O11yTracerConstructorParams } from "./tracer/tracer.types.mjs";

export class EmptyClass {}

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
  logger?: Record<string, unknown>;
  tracer?: O11yTracerConstructorParams;
}
