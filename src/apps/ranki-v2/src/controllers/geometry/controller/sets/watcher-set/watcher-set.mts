import { DebugUtils } from "_/debug/debug-utils.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import type { LitElement } from "lit";
import type { InformSetProps } from "../../animator/animator.types.mjs";
import type { GeometrySetDiffCb } from "../children/children.types.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type { GeometryWatcherProps } from "../watcher/watcher.types.mjs";

export class WatcherSet<Instance extends LitElement> {
  protected readonly host: Instance;
  protected readonly selector: GeometrySetSelectorCb<Instance>;
  protected diff?: GeometrySetDiffCb<Instance>;

  constructor(host: Instance, props: GeometryWatcherProps<Instance>) {
    this.host = host;
    this.selector = props.selector;
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

  protected getElements() {
    return this.selector(this.host);
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
}
