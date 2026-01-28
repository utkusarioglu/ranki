import { RankiWc } from "../../ranki-wc/ranki-wc.mts";

export class RankiHudWc<Props> extends RankiWc<Props> {
  protected createSingletonContainer(
    classes: string[] = [],
  ): [HTMLDivElement, boolean] {
    let c = this.getContainer();
    if (c) {
      return [c, true];
    }
    c = document.createElement("div");
    c.classList.add("container", ...classes);

    this.shadowRoot!.appendChild(c);
    return [c, false];
  }

  protected getContainer() {
    return this.shadowRoot!.querySelector(
      `div.container`,
    ) as HTMLDivElement | null;
  }
}
