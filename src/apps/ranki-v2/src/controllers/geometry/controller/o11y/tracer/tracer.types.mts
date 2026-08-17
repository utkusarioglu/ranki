import type { Context, Span, SpanOptions } from "@opentelemetry/api";

export interface NameFormatterParams {
  getCtxValue: (key: string) => unknown;
  name: string;
}

export interface O11yTracerConstructorParams {
  nameFormat?: (p: NameFormatterParams) => string;
}

export type SpanCallback<T> = (s: SpanFuncParams) => T;

export type SpanDefinition = SpanDetailedDefinition | string;

export interface SpanDetailedDefinition {
  metadata?: Record<string, unknown>;
  name: string;
  spanOptions?: SpanOptions;
}

export interface SpanFuncParams {
  ctx: Context;
  span: Span;
  withCtx: WithContext;
}

export type WithContext = <T>(callback: () => T) => T;
