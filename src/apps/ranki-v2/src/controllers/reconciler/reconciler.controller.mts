import type { LitElement, ReactiveController } from "lit";

import { assertNever } from "_error/assertions.mjs";
import {
  type R2ReconcilerEmit,
  type ReconcileableSubtree,
  type ReconcileSingle,
  ReconciliationUtils,
} from "_utils/reconciliation.utils.mjs";

export type ReconcilerEventsCb<Instance> = (
  host: Instance,
  event: "leave",
  detail: {
    index: number;
    stagger: number;
  },
) => void;

export type SubtreeParams<Instance, S> = {
  on?: ReconcilerEventsCb<Instance>;
  reconcile: ReconcileSingle<S>;
  source: GetSourceCallback<Instance, S>;
  type: ReconcilerTypes;
};

type GetSourceCallback<Instance, S> = (instance: Instance) => S[];

type ReconcilerTypes = "flat" | "last";

export class ReconciliationController<
  Instance extends LitElement,
  S,
> implements ReactiveController {
  public curr: ReconcileableSubtree<S> = ReconciliationUtils.empty<S>();
  public epoch: number = 0;
  public prev: ReconcileableSubtree<S> | undefined;
  private beforeLeave: ReconcilerEventsCb<Instance> | undefined;

  private getSource!: GetSourceCallback<Instance, S>;
  private host: Instance;
  private itemReconcile!: ReconcileSingle<S>;
  private leaving: number[] = [];

  private reconcilerName!: ReconcilerTypes;
  private willLeave = false;

  constructor(host: Instance, params: SubtreeParams<Instance, S>) {
    host.addController(this);
    this.host = host;
    this.reconcilerName = params.type;
    this.itemReconcile = params.reconcile;
    this.getSource = params.source;
    this.beforeLeave = params.on;
  }

  emit(type: "leave") {
    if (type !== "leave") {
      assertNever({ details: { type }, why: "Unrecognized emit type" });
    }
    ReconciliationUtils.emitLeave(this.host);
  }

  hostUpdate(): void {
    this.prev = this.curr;
    this.curr = ReconciliationUtils[this.reconcilerName](
      this.curr,
      this.getSource(this.host),
      this.itemReconcile,
    );
    this.epoch = Date.now();

    const bl = this.beforeLeave;
    if (bl) {
      this.curr.list.forEach((p, index) => {
        if (p.leave) {
          const stagger = this.curr.diff.stagger.indices[index];
          bl(this.host, "leave", { index, stagger: stagger });
        }
      });
    }
    this.host.requestUpdate();
  }

  onEmit(id: number) {
    return (e: CustomEvent<R2ReconcilerEmit>) => {
      e.stopPropagation();
      const detail = e.detail;
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (detail.type) {
        case "leave":
          this.prev = this.curr;
          this.leave(this.prev, id);
          break;
        default:
          assertNever({
            details: { type: detail.type },
            why: "Unrecognized Reconciler emit type",
          });
      }
    };
  }

  private async leave(
    subtree: ReconcileableSubtree<S>,
    id: number,
  ): Promise<void> {
    this.leaving.push(id);
    if (!this.willLeave) {
      this.willLeave = true;
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      if (!this.leaving.length) {
        return;
      }
      const remove = [...this.leaving];
      const list = subtree.list.filter((i) => !remove.includes(i.id));
      this.leaving = [];
      this.willLeave = false;
      // !FIX: this should be gone. `retain` can be created from the `subtree.list.filter` call. the call below is buggy
      const retain = Array.from(
        { length: subtree.list.length - remove.length },
        (_, i) => i,
      );

      this.setCurr({
        diff: {
          add: [],
          remove,
          retain,
          stagger: {
            first: id,
            indices: subtree.diff.stagger.indices,
          },
          update: [],
        },
        epoch: Date.now(),
        list,
      });
    }
  }

  private setCurr(value: ReconcileableSubtree<S>) {
    this.curr = value;
    this.host.requestUpdate();
  }
}
