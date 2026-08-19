import { O11yDebugger } from "../debug/mock/debug.mock.mjs";
import { O11yLogger } from "../logger/mock/logger.mock.mjs";
import { O11yMeter } from "../meter/mock/meter.mock.mjs";
import { O11yTracer } from "../tracer/mock/tracer.mock.mjs";

export class O11y {
  public static readonly debug = O11yDebugger;
  public static readonly log = O11yLogger;
  public readonly log = new O11yLogger();
  public readonly meter = new O11yMeter();
  public readonly trace = new O11yTracer();
}
