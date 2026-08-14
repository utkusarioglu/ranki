import type { LogDriver } from "../logger/logger.types.mjs";

export interface GeometryControllerStaticConfig {
  debug?: {
    sequencer?: {
      stutter?: number;
    };
  };
  log?: {
    drivers?: LogDriver[];
  };
}
