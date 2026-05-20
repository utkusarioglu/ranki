import {
  ReconciliationUtils,
  type ReconcileableSubtree,
  type ReconcileSingle,
} from "_utils/reconciliation.mjs";
import type {
  ReactiveController,
  ReactiveControllerHost,
  ReactiveElement,
} from "lit";

type GetSourceCallback<S> = (instance: any) => S[];

type SubtreeParams<S> = {
  type: "flat";
  reconcile: ReconcileSingle<S>;
  source: GetSourceCallback<S>;
};

export class ReconciliationController<S> implements ReactiveController {
  private host: ReactiveControllerHost;
  private reconcilerName!: "flat";
  private itemReconcile!: ReconcileSingle<S>;

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
  }

  hostUpdate(): void {
    this.prev = this.curr;
    this.curr = ReconciliationUtils[this.reconcilerName](
      this.curr,
      this.getSource(this.host),
      this.itemReconcile,
    );
    this.epoch = Date.now();
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
