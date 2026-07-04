import {
  ReconciliationUtils,
  type ReconcileableSubtree,
  type ReconcileSingle,
} from "_utils/reconciliation.utils.mjs";
import type {
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
  ReactiveElement,
} from "lit";

type GetSourceCallback<S> = (instance: any) => S[];

type ReconcilerTypes = "flat" | "last";

export type BeforeLeaveCb = (
  host: LitElement,
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
  private host: ReactiveControllerHost;
  private reconcilerName!: ReconcilerTypes;
  private itemReconcile!: ReconcileSingle<S>;
  private beforeLeave: BeforeLeaveCb | undefined;

  private getSource!: GetSourceCallback<S>;
  public prev: ReconcileableSubtree<S> | undefined;
  public curr: ReconcileableSubtree<S> = ReconciliationUtils.empty<S>();
  public epoch: number = 0;

  constructor(host: ReactiveControllerHost, params: SubtreeParams<S>) {
    host.addController(this);
    this.host = host;
    this.reconcilerName = params.type;
    this.itemReconcile = params.reconcile;
    this.getSource = params.source;
    this.beforeLeave = params.beforeLeave;
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
          bl(this.host as LitElement, st, i);
        }
      });
    }
    this.host.requestUpdate();
  }

  private setCurr(value: ReconcileableSubtree<S>) {
    this.curr = value;
    this.host.requestUpdate();
  }

  onLeave(id: number) {
    return (e: CustomEvent) => {
      e.stopPropagation();
      this.prev = this.curr;
      ReconciliationUtils.leave(this.prev, id, this.setCurr.bind(this));
    };
  }
}

export function reconciler<S>(params: SubtreeParams<S>) {
  return (proto: ReactiveElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance: ReactiveElement) => {
      (instance as any)[key] = new ReconciliationController(instance, params);
    });
  };
}
