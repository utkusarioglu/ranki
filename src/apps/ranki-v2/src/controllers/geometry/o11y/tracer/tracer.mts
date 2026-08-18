import { assertExists } from "_error/assertions.mjs";
import { type Context, context, trace, type Tracer } from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  CallWithContextMetadata,
  O11yTraceNameFormatterParams,
  O11yTracerConstructorParams,
  SpanCallback,
  SpanDefinition,
  SpanMetadata,
  WithContextFunc,
} from "./tracer.types.mjs";

import { ContextKeyRegistry } from "../key-registry/key-registry.mjs";
import { isPromiseLike } from "../utils/type.utils.mjs";

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

  private parseSpanDefinition(def: SpanDefinition) {
    const isString = typeof def === "string";
    const name = isString ? def : def.name;
    const metadata = isString ? {} : def.metadata;
    const spanOptions = isString ? {} : def.spanOptions || {};
    return { name, metadata, spanOptions };
  }

  async span<T>(def: SpanDefinition, fn: SpanCallback<Promise<T>>): Promise<T>;
  span<T>(def: SpanDefinition, fn: SpanCallback<T>): T;

  span<T>(def: SpanDefinition, fn: SpanCallback<T>): Promise<T> | T {
    const { name, metadata, spanOptions } = this.parseSpanDefinition(def);
    const parentCtx = context.active();
    const enrichedParentCtx = this.enrichContext(parentCtx, metadata);
    const formattedName = this.nameFormatter({
      getParentContextValue: O11yTracer.getCtxValueFactory(enrichedParentCtx),
      name,
      owner: this.owner,
    });

    return this.otelTracer.startActiveSpan(
      formattedName,
      spanOptions,
      enrichedParentCtx,
      (span) => {
        const currentCtx = context.active();
        const withCtx = this.childContextFactory(currentCtx);
        try {
          const exec = fn({ span, ctx: currentCtx, withCtx });
          if (isPromiseLike(exec)) {
            return Promise.resolve(exec).finally(() => span.end());
          } else {
            span.end();
            return exec;
          }
        } catch (err) {
          span.end();
          throw err;
        }
      },
    );
  }

  private childContextFactory(ctx: Context) {
    const withCtx: CallWithContextMetadata = <F,>(
      a: SpanMetadata | WithContextFunc<F>,
      b?: WithContextFunc<F>,
    ) => {
      const f = typeof b === "function" ? b : (a as WithContextFunc<F>);
      const meta =
        typeof b === "function" ? (a as unknown as SpanMetadata) : undefined;
      const enriched = this.enrichContext(ctx, meta);
      return context.with(enriched, f);
    };
    return withCtx;
  }

  private enrichContext(
    rawContext: Context,
    metadata: Record<string, unknown> | undefined,
  ) {
    let ctx = rawContext;
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

  private readonly nameFormatter = (n: O11yTraceNameFormatterParams<T>) =>
    n.name;
}
