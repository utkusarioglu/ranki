import type { LitElement } from "lit";
import type { GeometryWatcherRecord } from "./watcher.types.mjs";
import type { InformSetProps } from "../../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { GeometrySetName } from "../sets.types.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import { DebugUtils } from "_/debug/debug-utils.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class GeometryWatchers<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly props: GeometryWatcherRecord<Instance>;

  constructor(host: Instance, props: GeometryWatcherRecord<Instance>) {
    this.host = host;
    this.props = props;
  }

  private getElements(setName: GeometrySetName) {
    const set = this.getSet(setName);
    const selector = set.selector;
    const selected = selector(this.host);
    return selected;
  }

  private getSet(setName: GeometrySetName) {
    const set = this.props[setName];
    assertNotUndefined(set, {
      why: "Watcher attempting to call undefined set",
    });
    return set;
  }

  private async informSingle(
    setName: GeometrySetName,
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ) {
    await Promise.all(
      this.getElements(setName).map((e, i, a) => {
        const diff = this.getDiff(a.length);
        const informed = GeometrySetsUtils.prepareSetElementStyle(
          i,
          a,
          diff,
          props,
          sizing,
        );
        DebugUtils.informSet({ e, host: this.host, informed, props });
        return e.informStyle(informed);
      }),
    );
  }

  // FIX this will break the layout it assumes a single child
  private getDiff(length: number): ReconciliationDiff {
    return ReconciliationUtils.noChanges(length);
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    await Promise.all(
      Object.keys(this.props).map((name) =>
        this.informSingle(name, props, sizing),
      ),
    );
  }
}
