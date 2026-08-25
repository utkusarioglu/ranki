import { context } from "@opentelemetry/api";
import { type Logger, logs } from "@opentelemetry/api-logs";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  O11yLoggerConstructorParams,
  O11yLoggerDynamicEntriesFunc,
} from "./logger.types.mjs";
import type { O11yLogAttributes } from "./logger.types.mjs";

import { O11yTracer } from "../tracer/tracer.mjs";

export class O11yLogger<T extends EmptyClass> {
  private static readonly staticLogger = logs.getLogger("STATIC");
  private commonAttributes: O11yLoggerDynamicEntriesFunc<T> | undefined;
  private otel: Logger;
  private owner: T;

  constructor(owner: T, params?: O11yLoggerConstructorParams<T>) {
    this.owner = owner;
    this.otel = logs.getLogger(owner.constructor.name);
    this.commonAttributes = params?.attributes;
  }

  static debug(log: string, attributes?: O11yLogAttributes) {
    O11yLogger.staticLogger.emit({
      attributes,
      body: log,
      severityNumber: 0,
      severityText: "DEBUG",
    });
  }

  static info(log: string, attributes?: O11yLogAttributes) {
    O11yLogger.staticLogger.emit({
      attributes,
      body: log,
      severityNumber: 1,
      severityText: "INFO",
    });
  }

  debug(log: string, attributes?: O11yLogAttributes) {
    O11yLogger.debug(log, { ...this.getEntries(), ...attributes });
  }

  info(log: string, attributes?: O11yLogAttributes) {
    this.otel.emit({
      attributes: attributes,
      body: log,
      severityNumber: 1,
      severityText: "INFO",
    });
    O11yLogger.info(log, { ...this.getEntries(), ...attributes });
  }

  private getEntries(): O11yLogAttributes {
    const ctx = context.active();
    const getParentContextValue = O11yTracer.getCtxValueFactory(ctx);
    return this.commonAttributes
      ? this.commonAttributes({
          getParentContextValue,
          owner: this.owner,
        })
      : {};
  }
}
