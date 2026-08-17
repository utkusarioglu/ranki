import { assertExists } from "_error/assertions.mjs";
import { type Context, context, trace, type Tracer } from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  NameFormatterParams,
  O11yTracerConstructorParams,
  SpanCallback,
  SpanDefinition,
  WithContext,
} from "./tracer.types.mjs";

import { ContextKeyRegistry } from "../key-registry/key-registry.mjs";

export class O11yTracer<T extends EmptyClass> {
  public readonly otelTracer: Tracer;
  private readonly owner: T;

  constructor(owner: T, params?: O11yTracerConstructorParams<T>) {
    this.owner = owner;
    this.otelTracer = trace.getTracer(this.owner.constructor.name);
    if (params?.nameFormat) {
      this.nameFormatter = params.nameFormat;
    }
  }

  private static getCtxValueFactory(ctx: Context) {
    return (key: string) => {
      const keySymbol = ContextKeyRegistry.getSymbol(key);
      const value = ctx.getValue(keySymbol);
      assertExists(value, {
        why: "key does not correspond to a context value",
      });
      return value;
    };
  }

  span<T>(definition: SpanDefinition, fn: SpanCallback<T>): T {
    const isString = typeof definition === "string";
    const name = isString ? definition : definition.name;
    const metadata = isString ? {} : definition.metadata;
    const spanOptions = isString ? {} : definition.spanOptions || {};

    const ctx = this.buildEnrichedContext(metadata);
    const withCtx: WithContext = (cb) => context.with(ctx, cb);
    const formattedName = this.nameFormatter({
      getCtxValue: O11yTracer.getCtxValueFactory(ctx),
      name,
      owner: this.owner,
    });

    return this.otelTracer.startActiveSpan(
      formattedName,
      spanOptions,
      ctx,
      (span) => {
        try {
          return fn({ ctx, span, withCtx });
        } finally {
          span.end();
        }
      },
    );
  }

  private buildEnrichedContext(metadata: Record<string, unknown> | undefined) {
    let ctx = context.active();
    if (metadata) {
      Object.entries(metadata).forEach(([k, v]) => {
        ctx = ctx.setValue(ContextKeyRegistry.registerKey(k), v);
      });
    } else {
      // eslint-disable-next-line no-self-assign
      ctx = ctx;
    }
    return ctx;
  }

  private readonly nameFormatter = (n: NameFormatterParams<T>) => n.name;
}
