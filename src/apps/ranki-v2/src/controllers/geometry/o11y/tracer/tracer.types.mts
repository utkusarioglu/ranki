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

export interface SpanFuncParams {
  ctx: Context;
  session: {
    end: () => void;
    join: (span: Span) => void;
    start: () => void;
  };
  span: Span;
  withCtx: CallWithContextMetadata;
  withLink: WithLinkFunc;
}
export type SpanMetadata = Record<string, unknown>;

export type WithContextFunc<F> = () => F;

export type WithContextParams<F> =
  | WithContextParamsBare<F>
  | WithContextParamsRich<F>;

export type WithContextParamsBare<F> = [WithContextFunc<F>];

export type WithContextParamsRich<F> = [SpanMetadata, WithContextFunc<F>];

export type WithLinkFunc = <T>(cb: SpanCallback<T>) => T;

type O11yTraceNameFormatterCallback<T> = (
  p: O11yTraceNameFormatterParams<T>,
) => string;
