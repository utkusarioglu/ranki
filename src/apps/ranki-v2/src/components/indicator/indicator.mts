import { StoreController } from "_/controllers/store/store.mjs";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("r2-indicator")
export class R2Indicator extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: -1;
    }
  `;

  private state = new StoreController(this, (s) => s.state?.indicator);

  override render() {
    if (!this.state.curr) return;
    const animation = this.state.curr.animation;
    const active = this.state.curr.cues
      .map((v) => v.indicator)
      .filter((v) => v);
    if (!(active && active.length)) return;
    const library = this.state.curr.indicatorCollection;

    return html`${repeat(
      active,
      (n) => n,
      (name) => {
        const entry = library.find((l) => l.name === name);
        if (!entry) return null;
        return html`
          <r2-indicator-pattern
            .name=${entry.name}
            .pattern=${entry.style}
            .animation=${animation}
          ></r2-indicator-pattern>
        `;
      },
    )}`;
  }
}
