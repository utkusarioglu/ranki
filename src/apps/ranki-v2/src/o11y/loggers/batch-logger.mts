import { trace } from "@opentelemetry/api";
import type {
  LogDriver,
  LogValue,
} from "_controllers/geometry/o11y/logger/logger.types.mjs";

export class BatchLogger implements LogDriver {
  private elapsed = 0;
  private logs: LogValue[] = [];

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
    console.log(this.logs);
  }

  new() {
    const lastElapsed = this.elapsed;
    this.elapsed = performance.now();
    this.query((v) => v.elapsed >= lastElapsed);
  }

  query(cb: (entry: LogValue) => boolean) {
    console.log(this.logs.filter(cb));
  }
}
