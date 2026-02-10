import { RPairItem } from "_components/challenge/components/face.mjs";

export class RPairDqm extends RPairItem<any> {
  public static readonly tag = "r-pair-dqm";

  getKey() {
    return this.getAttribute("dqm-source");
  }

  setKey(key: string) {
    this.setAttribute("dqm-source", key);
  }

  protected onStateChange(): void {}
}
