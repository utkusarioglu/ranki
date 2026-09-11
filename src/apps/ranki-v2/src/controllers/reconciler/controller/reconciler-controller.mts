import type { LitElement, ReactiveController } from "lit";

import { ReconciliationShapes } from "_controllers/reconciler/utils/shapes.mjs";
import { assertNever } from "_error/assertions.mjs";

import type {
  GetSourceCallback,
  ReconcilerControllerParams,
  ReconcilerEventsCb,
  ReconcilerTypes,
} from "./reconciler-controller.types.mjs";

import { LayoutEngines } from "../engine/layout-engine.mjs";
import { ReconciliationEvents } from "../events/reconciliation-events.mjs";
import { type ReconcileSingle } from "../events/reconciliation-events.types.mjs";
import {
  type ReconcilableSubtree,
  type ReconciliationContainer,
} from "../utils/shapes.types.mjs";

export class ReconciliationController<
  Instance extends LitElement,
  S,
> implements ReactiveController {
  public curr: ReconcilableSubtree<S> = ReconciliationShapes.emptyState<S>();
  public epoch: number = 0;
  public prev: ReconcilableSubtree<S> | undefined;
  private readonly events: ReconciliationEvents<Instance>;
  private getSource!: GetSourceCallback<Instance, S>;

  private host: Instance;
  private itemReconcile!: ReconcileSingle<S>;
  private leaving: number[] = [];
  private on: ReconcilerEventsCb<Instance> | undefined;

  private reconcilerName!: ReconcilerTypes;
  private willLeave = false;

  constructor(host: Instance, params: ReconcilerControllerParams<Instance, S>) {
    host.addController(this);
    this.host = host;
    this.reconcilerName = params.type;
    this.itemReconcile = params.reconcile;
    this.getSource = params.source;
    this.on = params.on;
    this.events = new ReconciliationEvents(this.host);
  }

  public static emit(host: LitElement, type: "leave") {
    ReconciliationEvents.emit(host, type);
  }

  child(id: number) {
    return this.events.onEmit(({ detail }) => {
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
    });
  }

  emit(type: "leave") {
    ReconciliationEvents.emit(this.host, type);
  }

  hostUpdate(): void {
    this.prev = this.curr;
    this.curr = LayoutEngines[this.reconcilerName](
      this.curr,
      this.getSource(this.host),
      this.itemReconcile,
    );
    this.epoch = Date.now();

    const on = this.on;
    if (on) {
      this.curr.list.forEach((p, index) => {
        if (p.leave) {
          const stagger = this.curr.diff.stagger.indices[index];
          on(this.host, "leave", { index, stagger });
        }
      });
    }
    this.host.requestUpdate();
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
    console.log("set curr", value);
    this.curr = value;
    this.host.requestUpdate();
  }

  private async waitLayout() {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }
}
