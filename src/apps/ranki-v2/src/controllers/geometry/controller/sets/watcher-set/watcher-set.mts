import type { LitElement } from "lit";

import {
  type ReconciliationDiff,
  ReconciliationUtils,
} from "_utils/reconciliation.utils.mjs";

import type { InformSetProps } from "../../animator/types/animator.types.mjs";
import type { GeometrySetDiffCb } from "../children/children.types.mjs";
import type { LayoutSizing } from "../children/layout/layout-utils.types.mjs";
import type { GeometrySetSelectorCb } from "../sets.types.mjs";
import type { GeometryWatcherProps } from "../watcher/watcher.types.mjs";

import { O11y } from "../../../o11y/o11y.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";

export class WatcherSet<Instance extends LitElement> {
  protected diff?: GeometrySetDiffCb<Instance>;
  protected readonly host: Instance;
  protected readonly o11y: O11y<this>;
  protected readonly selector: GeometrySetSelectorCb<Instance>;

  constructor(host: Instance, props: GeometryWatcherProps<Instance>) {
    this.host = host;
    this.selector = props.selector;
    this.o11y = new O11y(this, {
      // logger: {
      //   attributes: () => ({
      //     host: this.host,
      //   }),
      // },
    });
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
        O11y.devtools.log("WatcherSet.informSet", { e, informed, props });
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
