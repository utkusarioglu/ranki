import { trace } from "@opentelemetry/api";
import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";
import type {
  ConsoleBatchLogDriverConstructorParams,
  FormatterCallback,
} from "./console-batch.types.mjs";

export class ConsoleBatchLogDriver implements LogDriver {
  private elapsed = Date.now() - 1000;
  private logs: LogValue[] = [];
  private printer: FormatterCallback = (v) => console.log(v);

  constructor(params?: ConsoleBatchLogDriverConstructorParams) {
    if (params?.printer) {
      this.printer = params.printer;
    }
  }

  private span() {
    const span = trace.getActiveSpan();
    const context = span?.spanContext();

    return {
      traceId: context?.traceId,
      spanId: context?.spanId,
      traceFlags: context?.traceFlags,
    };
  }

  log(v: LogValue) {
    this.logs.push({
      ...v,
      ...this.span(),
    });
  }

  dump() {
    this.printer(this.logs, this.elapsed);
  }

  new() {
    const lastElapsed = this.elapsed;
    this.elapsed = performance.now();
    this.query((v) => v.elapsed >= lastElapsed);
  }

  query(cb: (entry: LogValue) => boolean) {
    this.printer(this.logs.filter(cb), this.elapsed);
  }
}
