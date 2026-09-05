import type { LitElement, ReactiveController } from "lit";

import { ReconciliationUtils } from "_controllers/reconciler/utils.mjs";
import { assertNever } from "_error/assertions.mjs";

import type {
  GetSourceCallback,
  ReconcilerEventsCb,
  ReconcilerTypes,
  SubtreeParams,
} from "./reconciler.types.mjs";

import {
  type R2ReconcilerEmit,
  type ReconcilableSubtree,
  type ReconcileSingle,
  type ReconciliationContainer,
} from "./utils.types.mjs";

export class ReconciliationController<
  Instance extends LitElement,
  S,
> implements ReactiveController {
  public curr: ReconcilableSubtree<S> = ReconciliationUtils.empty<S>();
  public epoch: number = 0;
  public prev: ReconcilableSubtree<S> | undefined;
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
          bl(this.host, "leave", { index, stagger });
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
    subtree: ReconcilableSubtree<S>,
    id: number,
  ): Promise<void> {
    this.leaving.push(id);
    if (this.willLeave) return;

    this.willLeave = true;
    await this.waitLayout();
    if (!this.leaving.length) return;

    const remove = [...this.leaving];
    this.leaving = [];
    const list: ReconciliationContainer<S>[] = [];
    const retain: number[] = [];
    subtree.list.forEach((e) => {
      if (!remove.includes(e.id)) {
        list.push(e);
      } else {
        retain.push(e.id);
      }
    });
    this.willLeave = false;

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

  private setCurr(value: ReconcilableSubtree<S>) {
    this.curr = value;
    this.host.requestUpdate();
  }

  private async waitLayout() {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }
}
