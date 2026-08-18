import type { Context, Span, SpanOptions } from "@opentelemetry/api";

export interface O11yTraceNameFormatterParams<T> {
  owner: T;
  getParentContextValue: (key: string) => unknown;
  name: string;
}

type O11yTraceNameFormatterCallback<T> = (
  p: O11yTraceNameFormatterParams<T>,
) => string;

export interface O11yTracerConstructorParams<T> {
  nameFormat?: O11yTraceNameFormatterCallback<T>;
}

export type WithContextFunc<F> = () => F;
export type WithContextParamsRich<F> = [SpanMetadata, WithContextFunc<F>];
export type WithContextParamsBare<F> = [WithContextFunc<F>];
export type WithContextParams<F> =
  | WithContextParamsRich<F>
  | WithContextParamsBare<F>;

export type CallWithContextMetadata = <F>(
  a: SpanMetadata | WithContextFunc<F>,
  b?: WithContextFunc<F> | undefined,
) => F;

export type SpanCallback<T> = (s: SpanFuncParams) => T;

export type SpanDefinition = SpanDetailedDefinition | string;

export type SpanMetadata = Record<string, unknown>;

export interface SpanDetailedDefinition {
  metadata?: SpanMetadata;
  name: string;
  spanOptions?: SpanOptions;
}

export interface SpanFuncParams {
  ctx: Context;
  span: Span;
  withCtx: CallWithContextMetadata;
}
