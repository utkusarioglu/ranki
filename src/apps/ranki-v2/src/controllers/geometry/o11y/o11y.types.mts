import type { O11yDebuggerStaticConfig } from "./debug/debug.types.mjs";
import type { O11yLoggerStaticConfig } from "./logger/logger.types.mjs";
import type { O11yMeterConstructorParams } from "./meter/meter.types.mjs";
import type { O11yTracerConstructorParams } from "./tracer/tracer.types.mjs";

interface WithEnabled {
  enabled: boolean;
}

export interface O11yStaticConfig {
  debug?: O11yDebuggerStaticConfig;
  log?: O11yLoggerStaticConfig;
  trace?: WithEnabled;
  metrics?: WithEnabled;
}

export interface O11yInternalStaticConfig {
  debugEnabled: boolean;
  logEnabled: boolean;
  traceEnabled: boolean;
  metricsEnabled: boolean;
}

export interface O11yConstructorConfig<T> {
  logger?: Record<string, unknown>;
  meter?: O11yMeterConstructorParams<T>;
  tracer?: O11yTracerConstructorParams<T>;
}

export class EmptyClass {}
