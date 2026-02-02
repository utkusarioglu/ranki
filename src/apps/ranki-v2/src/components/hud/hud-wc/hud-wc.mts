import { RankiWc } from "_components/ranki-wc/ranki-wc.mts";

export type SingletonContainer = [HTMLDivElement, boolean];

export class RankiHudWc<Props> extends RankiWc<Props> {
  // override connectedCallback(): void {
  //   super.connectedCallback();
  //   this.dispatchEvent(
  //     new CustomEvent("registered", {
  //       bubbles: true,
  //       composed: true,
  //       detail: {
  //         element: this,
  //       },
  //     }),
  //   );
  // }

  // // protected listenChildren() {
  // //   this.addEventListener("registered", (e) => {
  // //     e.stopPropagation();
  // //     this.twoRaf(() => {
  // //       // @ts-expect-error
  // //       const el = e.detail.element as RankiHudWc<{}>;
  // //       const left = this.getLeft();
  // //       const right = el.getRight();
  // //       const idx = el.getAttribute("data-index");
  // //       const curr = this.getCurr();

  // //       // @ts-expect-error
  // //       console.log(curr.length, idx);
  // //       // @ts-expect-error
  // //       if (curr.length - 1 === +idx) {
  // //         this.setProperties({ width: right - left + "px" });
  // //       }
  // //     });
  // //   });
  // // }

  protected createSingletonContainer(
    classes: string[] = [],
  ): SingletonContainer {
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
