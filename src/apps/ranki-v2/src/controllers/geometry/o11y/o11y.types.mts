import type { O11yDevtoolsStaticConfig } from "./devtools/devtools.types.mjs";
import type {
  O11yLoggerConstructorParams,
  O11yLoggerStaticConfig,
} from "./logger/logger.types.mjs";
import type { O11yMeterConstructorParams } from "./meter/meter.types.mjs";
import type { O11yTracerConstructorParams } from "./tracer/tracer.types.mjs";

export interface O11yConstructorConfig<T> {
  logger?: O11yLoggerConstructorParams<T>;
  meter?: O11yMeterConstructorParams<T>;
  tracer?: O11yTracerConstructorParams<T>;
}

export interface O11yInternalStaticConfig {
  devtoolsEnabled: boolean;
  logEnabled: boolean;
  metricsEnabled: boolean;
  traceEnabled: boolean;
}

export interface O11yStaticConfig {
  devtools?: O11yDevtoolsStaticConfig;
  log?: O11yLoggerStaticConfig;
  metrics?: WithEnabled;
  trace?: WithEnabled;
}

interface WithEnabled {
  enabled: boolean;
}

export class EmptyClass {}
