import { metrics, type Counter, type Meter } from "@opentelemetry/api";
import type { EmptyClass } from "../o11y.types.mjs";

export class O11yMetrics<T extends EmptyClass> {
  private readonly otelMetrics: Meter;
  private readonly keys = new Map<string, Counter>();

  constructor(owner: T) {
    this.otelMetrics = metrics.getMeter(owner.constructor.name);
  }

  up(name: string, value: number = 1) {
    let curr = this.keys.get(name);
    if (!curr) {
      curr = this.otelMetrics.createCounter(name);
      this.keys.set(name, curr);
    }
    curr.add(value);
    console.log(name, this.keys);
  }
}
