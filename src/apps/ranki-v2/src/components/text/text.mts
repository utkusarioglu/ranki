import { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";

export interface RankiTextState {
  text: string;
  animation: { duration: number };
}

export class RankiText extends RankiWc<RankiTextState> {
  protected static name = "ranki-text";
  private active: HTMLSpanElement | null = null;
  private previous: HTMLSpanElement | null = null;

  private build() {
    if (this.initialized) return;
    this.initialized = true;
    this.setProperties({
      display: "grid",
      "transition-property": "width",
    });
  }

  private newText(props: KeyframeAnimationOptions) {
    const curr = this.getCurr();
    this.active = document.createElement("span");
    this.active.innerText = curr.text;
    this.active.style.gridArea = "1/1";
    this.active.style.width = "max-content";
    this.active
      .animate([{ opacity: 0 }, { opacity: 1 }], props)
      .finished.then(() => {});
    this.appendChild(this.active);
    return this.active.getBoundingClientRect().width;
  }

  private oldText(props: KeyframeAnimationOptions) {
    let startWidth = 0;
    this.previous = this.active;
    if (this.previous) {
      startWidth = this.previous.getBoundingClientRect().width;
      this.previous
        .animate([{ opacity: 1 }, { opacity: 0 }], props)
        .finished.then(() => {
          this.removeChild(this.previous!);
        });
    }
    return startWidth;
  }

  private animateWidth(
    props: KeyframeAnimationOptions,
    start: number,
    end: number,
  ) {
    this.animate(
      [{ width: start + "px" }, { width: end + "px" }],
      props,
    ).finished.then(() => {});
  }

  render() {
    this.build();
    const curr = this.getCurr();
    if (curr === this.getPrev()) return;
    const props: KeyframeAnimationOptions = {
      duration: curr.animation.duration,
      fill: "both",
    };

    const startWidth = this.oldText(props);
    const endWidth = this.newText(props);
    this.animateWidth(props, startWidth, endWidth);
  }
}
