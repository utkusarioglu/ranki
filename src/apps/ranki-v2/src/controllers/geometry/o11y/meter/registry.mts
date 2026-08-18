import {
  type Counter,
  type Histogram,
  type Attributes,
  type Meter,
  metrics,
  type MetricOptions,
} from "@opentelemetry/api";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { EmptyClass } from "../o11y.types.mjs";
import type {
  O11yMeterConstructorParams,
  O11yMeterNameFormatterCallback,
} from "./meter.types.mjs";

export class O11yMeterRegistry<T extends EmptyClass> {
  private readonly counters = new Map<string, Counter>();
  private readonly histograms = new Map<string, Histogram<Attributes>>();
  private readonly owner: T;
  private readonly otel: Meter;

  constructor(owner: T, params?: O11yMeterConstructorParams<T>) {
    this.owner = owner;
    this.otel = metrics.getMeter(owner.constructor.name);
    if (params?.nameFormat) {
      this.nameFormatter = params.nameFormat;
    }
    if (params?.histograms) {
      Object.entries(params.histograms).forEach(([key, opts]) => {
        this.registerHistogram(key, opts);
      });
    }
    if (params?.counters) {
      Object.entries(params.counters).forEach(([key, opts]) => {
        this.registerCounter(key, opts);
      });
    }
  }

  public getHistogram(name: string) {
    const formattedName = this.getFormattedName(name);
    const curr = this.histograms.get(formattedName);
    assertNotUndefined(curr, {
      why: "Undefined histogram",
      details: { name, formattedName },
    });
    return curr;
  }

  private readonly nameFormatter: O11yMeterNameFormatterCallback<T> = (n) =>
    n.name;

  private registerHistogram(rawName: string, options: MetricOptions) {
    const name = this.getFormattedName(rawName);
    const hist = this.otel.createHistogram(name, options);
    this.histograms.set(name, hist);
  }

  private registerCounter(rawName: string, options: MetricOptions) {
    const name = this.getFormattedName(rawName);
    const counter = this.otel.createCounter(name, options);
    this.counters.set(name, counter);
  }

  private getFormattedName(name: string): string {
    return this.nameFormatter({ name, owner: this.owner });
  }

  public getCounter(rawName: string) {
    const formattedName = this.getFormattedName(rawName);
    const curr = this.counters.get(formattedName);
    assertNotUndefined(curr, {
      why: "Undefined counter",
      details: { name, formattedName },
    });
    return curr;
  }
}
