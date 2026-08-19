import { assertNever, assertNotUndefined } from "_error/assertions.mjs";
import {
  type Attributes,
  type Counter,
  type Histogram,
  type Meter,
  type MetricOptions,
  metrics,
} from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  O11yMeterConstructorParams,
  O11yMeterNameFormatterCallback,
} from "./meter.types.mjs";
import type { FormattedName, MeterType, RawName } from "./registry.types.mjs";

export class O11yMeterRegistry<T extends EmptyClass> {
  private readonly counters = new Map<string, Counter>();
  private readonly histograms = new Map<string, Histogram<Attributes>>();
  private readonly otel: Meter;
  private readonly owner: T;

  constructor(owner: T, params?: O11yMeterConstructorParams<T>) {
    this.owner = owner;
    this.otel = metrics.getMeter(owner.constructor.name);
    if (params?.nameFormat) {
      this.nameFormatter = params.nameFormat;
    }
    if (params?.histograms) {
      Object.entries(params.histograms).forEach(([key, opts]) => {
        this.registerMeter("histogram", key, opts);
      });
    }
    if (params?.counters) {
      Object.entries(params.counters).forEach(([key, opts]) => {
        this.registerMeter("counter", key, opts);
      });
    }
  }

  getMeter(type: "histogram", rawName: RawName): Histogram;
  getMeter(type: "counter", rawName: RawName): Counter;
  public getMeter(type: MeterType, rawName: RawName) {
    const name = this.getFormattedName(rawName);
    let curr: Counter | Histogram;
    switch (type) {
      case "counter":
        curr = this.counters.get(name) as Counter;
        break;
      case "histogram":
        curr = this.histograms.get(name) as Histogram;
        break;
      default:
        assertNever({
          details: { name, rawName, type },
          why: "Unrecognized meter type",
        });
    }
    assertNotUndefined(curr, {
      details: { name, rawName },
      why: "Undefined histogram",
    });
    return curr;
  }
  private getFormattedName(name: RawName): FormattedName {
    return this.nameFormatter({ name, owner: this.owner });
  }

  private readonly nameFormatter: O11yMeterNameFormatterCallback<T> = (n) =>
    n.name;

  private registerMeter(
    type: MeterType,
    rawName: string,
    options: MetricOptions,
  ) {
    const name = this.getFormattedName(rawName);
    switch (type) {
      case "counter":
        {
          const counter = this.otel.createCounter(name, options);
          this.counters.set(name, counter);
        }
        break;
      case "histogram":
        {
          const hist = this.otel.createHistogram(name, options);
          this.histograms.set(name, hist);
        }
        break;
      default:
        assertNever({
          details: { name, options, rawName, type },
          why: "Unrecognized meter type",
        });
    }
  }
}
