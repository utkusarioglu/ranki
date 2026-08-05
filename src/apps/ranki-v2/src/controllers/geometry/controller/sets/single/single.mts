import type { LitElement } from "lit";
import type { GeometryWatcherProps } from "../watcher/watcher.types.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import type { InformSetProps } from "../../animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { DebugUtils } from "_/debug/debug-utils.mjs";

export class WatcherSet<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly props: GeometryWatcherProps<Instance>;

  constructor(host: Instance, props: GeometryWatcherProps<Instance>) {
    this.host = host;
    this.props = props;
  }

  // FIX this will break the layout it assumes a single child
  private getDiff(length: number): ReconciliationDiff {
    return ReconciliationUtils.noChanges(length);
  }

  private getElements() {
    const set = this.props;
    const selector = set.selector;
    const selected = selector(this.host);
    return selected;
  }

  public async inform(props: InformSetProps, sizing: LayoutSizing | null) {
    await Promise.all(
      this.getElements().map((e, i, a) => {
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
}
