import { RPairItem } from "_components/challenge/components/face.mjs";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";

type T = {
  animation: {
    enabled: boolean;
  };
  data: any;
};

export class RPairDqm extends RPairItem<T> {
  public static readonly tag = "r-pair-dqm";

  getKey() {
    return this.getAttribute("dqm-source");
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return this.getKey() === s.state.data.getKey() ? "advance" : "remove";
  }

  setKey(key: string) {
    this.setAttribute("dqm-source", key);
  }

  protected onStateChange(): void {}
}
