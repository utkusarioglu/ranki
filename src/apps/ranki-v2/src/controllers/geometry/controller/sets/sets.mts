import type { LitElement } from "lit";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { InformSetProps } from "../animator/types/animator.types.mjs";
import type { LayoutSizing } from "./children/layout/layout-utils.types.mjs";
import type {
  GeometrySetOnEmitProps,
  GeometrySetsConstructorParams,
} from "./sets.types.mjs";

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
    if (props.setName === "children") {
      return this.children?.inform(props, sizing);
    }
    return this.watchers?.inform(props, sizing);
  }

  public onEmit(e: GeometrySetOnEmitProps) {
    assertNotUndefined(this.children, {
      why: "Received emit when no children has been defined",
    });
    return this.children.onEmit(e);
  }
}
