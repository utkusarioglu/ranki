import type { AnimationTypes } from "_components/animation/animation.mjs";
import { Wc } from "_components/wc/wc.mjs";

export interface RankiTextSpanState {
  text: string;
  duration: number;
}

export class RankiTextSpan extends Wc<RankiTextSpanState> {
  protected static name = "ranki-text-span";
  protected animations: AnimationTypes = {
    exit: () =>
      this.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1e3 })
        .finished,
  };

  protected onStateChange(curr: RankiTextSpanState) {
    this.innerText = curr.text;
  }
}
