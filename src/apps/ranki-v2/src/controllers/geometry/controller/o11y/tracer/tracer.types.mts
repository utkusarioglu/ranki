import type { Context, Span } from "@opentelemetry/api";

export interface O11yTracerConstructorParams {
  nameFormat?: (p: NameFormatterParams) => string;
}

export type WithContext = <T>(callback: () => T) => T;

export interface NameFormatterParams {
  name: string;
  // context: Context;
}

export type SpanCallback<T> = (s: SpanFuncParams) => T;

export interface SpanFuncParams {
  span: Span;
  ctx: Context;
  withCtx: WithContext;
}
