import type { LitElement } from "lit";

import type { InformSetProps } from "../../animator/types/animator.types.mjs";
import type { LayoutSizing } from "../children/layout/layout-utils.types.mjs";

import { WatcherSet } from "../watcher-set/watcher-set.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";

export class GeometryWatchers<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly sets: WatcherSet<Instance>[] = [];

  constructor(host: Instance) {
    this.host = host;
  }

  public add(elem: R2C) {
    const w = new WatcherSet(this.host);
    w.addElement(elem);
    this.sets.push(w);
  }

  public remove(elem: R2C) {
    console.log("remove watcher", elem);
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    this.sets.forEach((s) => s.inform(props, sizing));
  }
}
