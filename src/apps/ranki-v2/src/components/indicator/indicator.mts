import { StoreController } from "_/controllers/store.mjs";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

@customElement("r2-indicator")
export class R2Indicator extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      z-index: -1;
    }
  `;

  private state = new StoreController(this, (s) => s.state?.indicator);

  render() {
    if (!this.state.value) return;
    const animation = this.state.value.animation;
    const active = this.state.value.cues
      .map((v) => v.indicator)
      .filter((v) => v);
    if (!(active && active.length)) return;
    const library = this.state.value.indicatorCollection;

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
