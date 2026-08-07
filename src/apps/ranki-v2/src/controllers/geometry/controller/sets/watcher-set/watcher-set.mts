import type { LitElement } from "lit";

import { DebugUtils } from "_/debug/debug-utils.mjs";
import {
  type ReconciliationDiff,
  ReconciliationUtils,
} from "_utils/reconciliation.utils.mjs";

import type { InformSetProps } from "../../animator/animator.types.mjs";
import type { GeometrySetDiffCb } from "../children/children.types.mjs";
import type { LayoutSizing } from "../children/layout/layout-utils.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type { GeometryWatcherProps } from "../watcher/watcher.types.mjs";

import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";

export class WatcherSet<Instance extends LitElement> {
  protected diff?: GeometrySetDiffCb<Instance>;
  protected readonly host: Instance;
  protected readonly selector: GeometrySetSelectorCb<Instance>;

  constructor(host: Instance, props: GeometryWatcherProps<Instance>) {
    this.host = host;
    this.selector = props.selector;
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    const diff = this.getDiff();
    await Promise.all(
      this.getElements().map((e, i, a) => {
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

  protected getElements() {
    return this.selector(this.host);
  }

  // FIX this will break the layout it assumes a single child
  private getDiff(): ReconciliationDiff {
    const diff = this.diff;
    if (!diff) {
      const elems = this.getElements();
      return ReconciliationUtils.noChanges(elems.length);
    }
    return diff(this.host);
  }
}
