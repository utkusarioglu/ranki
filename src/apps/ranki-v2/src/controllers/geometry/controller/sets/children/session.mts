import { O11y } from "_controllers/geometry/o11y/o11y.mjs";
import { assertFalse, assertTrue } from "_error/assertions.mjs";
import { type Span } from "@opentelemetry/api";

import type {
  GeometryUpdateSession,
  GeometryUpdateSessionWithSpanContext,
} from "./children.types.mjs";

export class UpdateSession {
  private static counter = 0;
  private active = false;
  private readonly o11y = new O11y(this, {
    tracer: {
      nameFormat: ({ getParentContextValue, name }) =>
        [
          getParentContextValue("geometry.session.tag"),
          name,
          UpdateSession.counter,
        ].join(":"),
    },
  });
  private span!: Span | undefined;
  private values: GeometryUpdateSession = {
    id: 0,
    index: -1,
    start: 0,
  };

  end() {
    this.active = false;
    this.span?.end();
    this.span = undefined;
  }

  getValues() {
    return this.values;
  }

  isActive() {
    return this.active;
  }

  join(): GeometryUpdateSessionWithSpanContext {
    assertTrue(this.active, {
      details: {
        active: this.active,
        values: this.getValues(),
      },
      why: "Cannot join if there is no active session",
    });
    ++this.values.index;
    return {
      ...this.getValues(),
      context: this.span!.spanContext(),
    };
  }

  start(): GeometryUpdateSessionWithSpanContext {
    assertFalse(this.active, {
      details: {
        active: this.active,
        values: this.values,
      },
      why: "There is already an active session",
    });
    return this.o11y.trace.span("session", ({ span }) => {
      this.span = span;
      this.active = true;
      this.values = {
        id: UpdateSession.counter++,
        index: 0,
        start: Date.now(),
      };
      return {
        ...this.getValues(),
        context: span.spanContext(),
      };
    });
  }
}
