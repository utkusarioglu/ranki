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
  getSource: GetSourceCallback<S>;
};

export class ReconciliationController<S> implements ReactiveController {
  private host: any;
  private reconcilerName!: "flat";
  private itemReconcile!: ReconcileSingle<S>;
  private unsubscribe: () => void = () => {};

  private getSource!: GetSourceCallback<S>;
  public prev: ReconcileableSubtree<S> | undefined;
  public curr: ReconcileableSubtree<S> = ReconciliationUtils.empty<S>();

  constructor(host: ReactiveControllerHost, params: SubtreeParams<S>) {
    host.addController(this);
    this.host = host;
    this.reconcilerName = params.type;
    this.itemReconcile = params.reconcile;
    this.getSource = params.getSource;
    this.unsubscribe = () => {};
  }

  hostUpdate(): void {
    this.prev = this.curr;
    this.curr = ReconciliationUtils[this.reconcilerName](
      this.curr,
      this.getSource(this.host),
      this.itemReconcile,
    );

    console.log(this.curr);
  }

  hostDisconnected() {
    this.unsubscribe();
  }

  onLeave(id: number) {
    return () => {
      ReconciliationUtils.leave(this.curr, id, (s) => (this.curr = s));
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
