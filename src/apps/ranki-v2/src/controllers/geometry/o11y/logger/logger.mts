import { context } from "@opentelemetry/api";

import type { EmptyClass } from "../o11y.types.mjs";
import type {
  O11yLoggerConstructorParams,
  O11yLoggerDynamicEntriesFunc,
} from "./logger.types.mjs";
import type { O11yLogAttributes } from "./logger.types.mjs";
import { logs, type Logger } from "@opentelemetry/api-logs";

import { O11yTracer } from "../tracer/tracer.mjs";

export class O11yLogger<T extends EmptyClass> {
  private commonAttributes: O11yLoggerDynamicEntriesFunc<T> | undefined;
  private owner: T;
  private otel: Logger;

  constructor(owner: T, params?: O11yLoggerConstructorParams<T>) {
    this.owner = owner;
    this.otel = logs.getLogger(owner.constructor.name);
    this.commonAttributes = params?.attributes;
  }

  static debug(log: string, attributes?: O11yLogAttributes) {
    console.log("no static logger", log, attributes);
    // O11yLogger.log("DEBUG", log, attributes);
  }

  static info(log: string, attributes?: O11yLogAttributes) {
    console.log("no static logger", log, attributes);
    // O11yLogger.log("INFO", log, attributes);
  }

  debug(log: string, attributes?: O11yLogAttributes) {
    O11yLogger.debug(log, { ...this.getEntries(), ...attributes });
  }

  info(log: string, attributes?: O11yLogAttributes) {
    this.otel.emit({
      severityText: "INFO",
      severityNumber: 1,
      body: log,
      attributes: attributes,
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
