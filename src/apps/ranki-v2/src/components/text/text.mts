import { css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  R2C,
  type AnimateableStyles,
  type Dims,
} from "_components/r2c/r2c.mjs";
import { createRef, ref } from "lit/directives/ref.js";

interface TextInternalProps {
  text: string;
  color?: string;
  remove: boolean;
}

@customElement("r2-text")
export class R2Text extends R2C {
  static styles = css`
    :host {
      position: var(--position);
      display: inline-block;
      white-space: nowrap;
      width: 0;
      overflow: hidden;
    }

    :host > span {
      grid-area: 1/1;
    }
  `;
  @property()
  private t: string = "-";
  private spans: TextInternalProps[] = [];
  private ref = createRef<HTMLSpanElement>();

  public informStyle(pos: AnimateableStyles): void {
    console.log("inform", pos);
    this.setStyle({ height: pos.height }).animateStyle(
      { width: pos.width },
      { duration: 1000 },
    );
  }

  async updated() {
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const rect = this.ref.value!.getBoundingClientRect();
    console.log("r", rect);
    const dims: Dims = { width: rect.width, height: rect.height };
    this.emitChildLoad(dims, {});
  }

  render() {
    if (!this.spans.length || this.t !== this.spans.at(-1)!.text) {
      this.spans.push({
        text: this.t,
        remove: false,
      });
    }
    this.spans.forEach((s, i, a) => {
      i < a.length - 2 && (s.remove = true);
    });

    console.log(this.spans);
    return html`${this.spans.map(
      ({ text }, i, a) =>
        html`<span ${i === a.length - 1 ? ref(this.ref) : ""}>${text}</span>`,
    )}`;
  }
}
