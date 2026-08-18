import type { MetricOptions } from "@opentelemetry/api";
import type { O11yTraceNameFormatterParams } from "../tracer/tracer.types.mjs";

export type O11yNameFormatterCallbackParams<T> = Omit<
  O11yTraceNameFormatterParams<T>,
  "getParentContextValue"
>;

export type O11yMeterNameFormatterCallback<T> = (
  p: O11yNameFormatterCallbackParams<T>,
) => string;

export type CounterDefinitions = Record<string, MetricOptions>;
export type HistogramDefinitions = Record<string, MetricOptions>;

export interface O11yMeterConstructorParams<T> {
  nameFormat?: O11yMeterNameFormatterCallback<T>;
  counters?: CounterDefinitions;
  histograms?: HistogramDefinitions;
}
