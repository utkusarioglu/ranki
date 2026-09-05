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
import type { R2C } from "_components/r2c/r2c.mjs";

export class GeometrySets<Instance extends LitElement> {
  private children: GeometryChildren<Instance> | undefined;
  private watchers: GeometryWatchers<Instance> | undefined;
  private readonly props: GeometrySetsConstructorParams<Instance>;
  private readonly host: Instance;

  constructor(host: Instance, props: GeometrySetsConstructorParams<Instance>) {
    this.props = props;
    this.host = host;
  }

  public removeChild(elem: R2C) {
    assertNotUndefined(this.children, {
      why: "Removing a child element when none has been defined",
    });
    this.children.remove(elem);
  }

  public removeWatcher(elem: R2C) {
    assertNotUndefined(this.watchers, {
      why: "Removing a watcher element when none has been defined",
    });
    this.watchers.remove(elem);
  }

  public addChild(elem: R2C) {
    if (!this.children) {
      this.children = new GeometryChildren(this.host, this.props.children);
    }
    this.children.add(elem);
  }

  public addWatcher(elem: R2C) {
    if (!this.watchers) {
      this.watchers = new GeometryWatchers(this.host);
    }
    this.watchers.add(elem);
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
