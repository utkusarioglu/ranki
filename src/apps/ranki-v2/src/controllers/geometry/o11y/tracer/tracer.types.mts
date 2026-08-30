import type { Context, Span, SpanOptions } from "@opentelemetry/api";

export type CallWithContextMetadata = <F>(
  a: SpanMetadata | WithContextFunc<F>,
  b?: undefined | WithContextFunc<F>,
) => F;

export interface O11yTraceNameFormatterParams<T> {
  getParentContextValue: (key: string) => unknown;
  name: string;
  owner: T;
}

export interface O11yTracerConstructorParams<T> {
  nameFormat?: O11yTraceNameFormatterCallback<T>;
}

export type SpanCallback<T> = (s: SpanFuncParams) => T;
export type SpanDefinition = SpanDetailedDefinition | string;
export interface SpanDetailedDefinition {
  metadata?: SpanMetadata;
  name: string;
  spanOptions?: SpanOptions;
}

export type WithLinkFunc = <T>(cb: SpanCallback<T>) => T;
export interface SpanFuncParams {
  ctx: Context;
  span: Span;
  withCtx: CallWithContextMetadata;
  withLink: WithLinkFunc;
  session: {
    start: () => void;
    join: (span: Span) => void;
    end: () => void;
  };
}

export type SpanMetadata = Record<string, unknown>;

export type WithContextFunc<F> = () => F;

export type WithContextParams<F> =
  | WithContextParamsBare<F>
  | WithContextParamsRich<F>;

export type WithContextParamsBare<F> = [WithContextFunc<F>];

export type WithContextParamsRich<F> = [SpanMetadata, WithContextFunc<F>];

type O11yTraceNameFormatterCallback<T> = (
  p: O11yTraceNameFormatterParams<T>,
) => string;
