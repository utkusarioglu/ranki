import {
  type Context,
  context,
  type Span,
  trace,
  type Tracer,
} from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  CallWithContextMetadata,
  O11yTraceNameFormatterParams,
  O11yTracerConstructorParams,
  SpanCallback,
  SpanDefinition,
  SpanMetadata,
  WithContextFunc,
  WithLinkFunc,
} from "./tracer.types.mjs";

import { ContextKeyRegistry } from "../key-registry/key-registry.mjs";
import { isPromiseLike } from "../utils/type.utils.mjs";
import { TracerSession } from "./tracer-session.mjs";

export class O11yTracer<T extends EmptyClass> {
  public readonly otelTracer: Tracer;
  private readonly owner: T;
  private readonly session: TracerSession;

  constructor(owner: T, params?: O11yTracerConstructorParams<T>) {
    this.owner = owner;
    this.otelTracer = trace.getTracer(this.owner.constructor.name);
    this.session = new TracerSession(this.otelTracer);
    if (params?.nameFormat) {
      this.nameFormatter = params.nameFormat;
    }
  }

  public static getCtxValueFactory(ctx: Context) {
    return (key: string) => {
      const keySymbol = ContextKeyRegistry.getSymbol(key);
      if (!keySymbol) {
        return `[undefined-ctx-symbol:${key}]`;
      }
      const value = ctx.getValue(keySymbol);
      if (!value) {
        return `[undefined-ctx-key:${key}]`;
      }
      return value;
    };
  }

  private withLinkFactory(formattedName: string, span: Span): WithLinkFunc {
    const withLink: WithLinkFunc = (cb) => {
      return this.span(`${formattedName}.linked`, (child) => {
        child.span.addLink({ context: span.spanContext() });
        span.addLink({ context: child.span.spanContext() });
        return cb(child);
      });
    };
    return withLink;
  }

  async span<T>(def: SpanDefinition, fn: SpanCallback<Promise<T>>): Promise<T>;
  span<T>(def: SpanDefinition, fn: SpanCallback<T>): T;
  span<T>(def: SpanDefinition, fn: SpanCallback<T>): Promise<T> | T {
    const { metadata, name, spanOptions } = this.parseSpanDefinition(def);
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
        const withLink = this.withLinkFactory(formattedName, span);
        const session = this.session.getCallbacks(formattedName);
        try {
          const exec = fn({
            ctx: currentCtx,
            span,
            withCtx,
            withLink,
            session,
          });
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

  private parseSpanDefinition(def: SpanDefinition) {
    const isString = typeof def === "string";
    const name = isString ? def : def.name;
    const metadata = isString ? {} : def.metadata;
    const spanOptions = isString ? {} : def.spanOptions || {};
    return { metadata, name, spanOptions };
  }
}
