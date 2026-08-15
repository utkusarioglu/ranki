import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { InformSetProps } from "../animator/types/animator.types.mjs";
import type { GeometryEvent } from "../events/types/geometry-events.types.mjs";
import type { ChildrenUpdateSizingReturn } from "./children/children.types.mjs";
import type { LayoutSizing } from "./children/layout/layout-utils.types.mjs";
import type { GeometrySetsConstructorParams } from "./sets.types.mjs";

import { GeometryChildren } from "./children/children.mjs";
import { GeometryWatchers } from "./watcher/watcher.mjs";
import { trace, type Tracer } from "@opentelemetry/api";

export class GeometrySets<Instance extends LitElement> {
  private readonly children: GeometryChildren<Instance> | undefined;
  private readonly watchers: GeometryWatchers<Instance> | undefined;
  private readonly tracer: Tracer;

  constructor(host: Instance, props: GeometrySetsConstructorParams<Instance>) {
    if (props.children) {
      this.children = new GeometryChildren(host, props.children);
    }
    if (props.watchers) {
      this.watchers = new GeometryWatchers(host, props.watchers);
    }
    this.tracer = trace.getTracer("GeometrySets");
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    return this.tracer.startActiveSpan("inform", async (span) => {
      try {
        switch (props.setName) {
          case "children":
            return this.children?.inform(props, sizing);
          default:
            return this.watchers?.inform(props, sizing);
        }
      } finally {
        span.end();
      }
    });
  }

  public async onEmit(
    target: R2C,
    detail: GeometryEvent,
  ): ChildrenUpdateSizingReturn {
    assertNotUndefined(this.children, {
      why: "Received emit when no children has been defined",
    });
    return this.children.onEmit(target, detail);
  }
}
