import { type Span, type Tracer } from "@opentelemetry/api";

import { assertNotNull, assertNull } from "_error/assertions.mjs";

export class TracerSession {
  private otelTracer: Tracer;
  private session: Span | null = null;
  private static sessionId = 0;
  private sessionIndex = 0;

  constructor(tracer: Tracer) {
    this.otelTracer = tracer;
  }

  public getCallbacks(formattedName: string) {
    return {
      start: this.start(formattedName),
      join: this.join.bind(this),
      end: this.end.bind(this),
    };
  }

  private getSessionLink() {
    return {
      "session.id": TracerSession.sessionId,
      "session.index": this.sessionIndex++,
    };
  }

  public start(formattedName: string) {
    return () => {
      assertNull(this.session, {
        why: "Cannot start a session while another exists",
      });
      this.otelTracer.startActiveSpan(`${formattedName}:session`, (span) => {
        this.session = span;
        span.addEvent("session.link", this.getSessionLink());
      });
    };
  }

  public join(curr: Span) {
    assertNotNull(this.session, {
      why: "Attempted to end a session that doesn't exist",
    });
    this.session.addLink({ context: curr.spanContext() });
    curr.addLink({ context: this.session.spanContext() });
    curr.addEvent("session.link", this.getSessionLink());
  }

  public end() {
    assertNotNull(this.session, {
      why: "Attempted to end a session where none exists",
    });
    this.session.end();
    this.session = null;
    TracerSession.sessionId++;
    this.sessionIndex = 0;
  }
}
