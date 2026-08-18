import type { EmptyClass } from "../o11y.types.mjs";
import type { O11yMeterConstructorParams } from "./meter.types.mjs";
import { O11yMeterRegistry } from "./registry.mjs";

export class O11yMeter<T extends EmptyClass> {
  private readonly registry: O11yMeterRegistry<T>;

  constructor(owner: T, params?: O11yMeterConstructorParams<T>) {
    this.registry = new O11yMeterRegistry(owner, params);
  }

  count(name: string, value: number = 1) {
    this.registry.getCounter(name).add(value);
  }

  record(name: string, value: number) {
    this.registry.getHistogram(name).record(value);
  }
}
