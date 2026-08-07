import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { LitElement } from "lit";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { InformSetProps } from "../animator/animator.types.mjs";
import type { R2CNewChildSizeEvent } from "../events/geometry-events.types.mjs";
import type { ChildrenUpdateSizingReturn } from "./children/children.types.mjs";
import type { GeometrySetsConstructorParams } from "./sets.types.mjs";

import { GeometryChildren } from "./children/children.mjs";
import { GeometryWatchers } from "./watcher/watcher.mjs";

export class GeometrySets<Instance extends LitElement> {
  private readonly children: GeometryChildren<Instance> | undefined;
  private readonly watchers: GeometryWatchers<Instance> | undefined;

  constructor(host: Instance, props: GeometrySetsConstructorParams<Instance>) {
    if (props.children) {
      this.children = new GeometryChildren(host, props.children);
    }
    if (props.watchers) {
      this.watchers = new GeometryWatchers(host, props.watchers);
    }
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    await Promise.all([
      this.children?.inform(props, sizing),
      this.watchers?.inform(props, sizing),
    ]);
  }

  public async onEmit(
    target: R2C,
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    assertNotUndefined(this.children, {
      why: "Received emit when no children has been defined",
    });
    return this.children.onEmit(target, detail);
  }
}
