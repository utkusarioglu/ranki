import type { LitElement } from "lit";

import { assertNotUndefined } from "_error/assertions.mjs";

import type { InformSetProps } from "../../animator/types/animator.types.mjs";
import type { LayoutSizing } from "../children/layout/layout-utils.types.mjs";
import type { GeometrySetName } from "../sets.types.mjs";
import type { GeometryWatcherRecord } from "./watcher.types.mjs";

import { WatcherSet } from "../watcher-set/watcher-set.mjs";

export class GeometryWatchers<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly sets: Record<GeometrySetName, WatcherSet<Instance>> = {};

  constructor(host: Instance, props: GeometryWatcherRecord<Instance>) {
    this.host = host;
    this.sets = Object.fromEntries(
      Object.entries(props).map(([setName, setProps]) => [
        setName,
        new WatcherSet(this.host, setProps),
      ]),
    );
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    this.getSet(props.setName).inform(props, sizing);
  }

  private getSet(setName: GeometrySetName) {
    const set = this.sets[setName];
    assertNotUndefined(set, {
      why: "Watcher attempting to call undefined set",
    });
    return set;
  }
}
