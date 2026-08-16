import { type Tracer, context, trace } from "@opentelemetry/api";
import type { EmptyClass } from "../o11y.types.mjs";
import type {
  NameFormatterParams,
  O11yTracerConstructorParams,
  SpanCallback,
  WithContext,
} from "./tracer.types.mjs";

export class O11yTracer<T extends EmptyClass> {
  private readonly owner: T;
  public readonly tracer: Tracer;
  private readonly nameFormatter = (n: NameFormatterParams) => n.name;

  constructor(owner: T, params?: O11yTracerConstructorParams) {
    this.owner = owner;
    this.tracer = trace.getTracer(this.owner.constructor.name);
    if (params?.nameFormat) {
      this.nameFormatter = params.nameFormat;
    }
  }

  span<T>(name: string, fn: SpanCallback<T>): T {
    const formattedName = this.nameFormatter({ name });
    return this.tracer.startActiveSpan(formattedName, (span) => {
      const ctx = context.active();
      try {
        const withCtx: WithContext = (cb) => context.with(ctx, cb);
        return fn({ span, ctx, withCtx });
      } finally {
        span.end();
      }
    });
  }
}
