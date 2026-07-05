import { assertNever } from "_error/assertions.mjs";
import {
  ReconciliationUtils,
  type R2ReconcilerEmit,
  type ReconcileableSubtree,
  type ReconcileSingle,
} from "_utils/reconciliation.utils.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import type { LitElement, ReactiveController, ReactiveElement } from "lit";

type HostType = LitElement;

type GetSourceCallback<S> = (instance: any) => S[];

type ReconcilerTypes = "flat" | "last";

export type BeforeLeaveCb = (
  host: HostType,
  stagger: number,
  index: number,
) => void;

type SubtreeParams<S> = {
  type: ReconcilerTypes;
  reconcile: ReconcileSingle<S>;
  beforeLeave?: BeforeLeaveCb;
  source: GetSourceCallback<S>;
};

export class ReconciliationController<S> implements ReactiveController {
  private host: HostType;
  private reconcilerName!: ReconcilerTypes;
  private itemReconcile!: ReconcileSingle<S>;
  private beforeLeave: BeforeLeaveCb | undefined;

  private getSource!: GetSourceCallback<S>;
  public prev: ReconcileableSubtree<S> | undefined;
  public curr: ReconcileableSubtree<S> = ReconciliationUtils.empty<S>();
  public epoch: number = 0;

  private leaving: number[] = [];
  private willLeave = false;

  constructor(host: HostType, params: SubtreeParams<S>) {
    host.addController(this);
    this.host = host;
    this.reconcilerName = params.type;
    this.itemReconcile = params.reconcile;
    this.getSource = params.source;
    this.beforeLeave = params.beforeLeave;
  }

  emit(type: "leave") {
    switch (type) {
      case "leave":
        ReconciliationUtils.emitLeave(this.host);
        break;
      default:
        assertNever({ why: "Unrecognized emit type", details: { type } });
    }
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
      this.curr.list.forEach((p, i) => {
        if (p.leave) {
          const st = this.curr.diff.stagger.indices[i];
          bl(this.host as HostType, st, i);
        }
      });
    }
    this.host.requestUpdate();
  }

  private setCurr(value: ReconcileableSubtree<S>) {
    this.curr = value;
    this.host.requestUpdate();
  }

  onEmit(id: number) {
    return (e: CustomEvent<R2ReconcilerEmit>) => {
      e.stopPropagation();
      const detail = e.detail;
      switch (detail.type) {
        case "leave":
          this.prev = this.curr;
          this.leave(this.prev, id);
          break;
        default:
          assertNever({
            why: "Unrecognized Reconciler emit type",
            details: { type: detail.type },
          });
      }
      // ReconciliationUtils.leave(this.prev, id, this.setCurr.bind(this));
    };
  }

  private async leave(
    subtree: ReconcileableSubtree<S>,
    id: number,
  ): Promise<void> {
    this.leaving.push(id);
    if (!this.willLeave) {
      this.willLeave = true;
      await TimingUtils.waitLayout();
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
        list,
        diff: {
          add: [],
          remove,
          retain,
          update: [],
          stagger: {
            first: id,
            indices: subtree.diff.stagger.indices,
          },
        },
        epoch: Date.now(),
      });
    }
  }
}

export function reconciler<S>(params: SubtreeParams<S>) {
  return (proto: ReactiveElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new ReconciliationController(
        instance as HostType,
        params,
      );
    });
  };
}
