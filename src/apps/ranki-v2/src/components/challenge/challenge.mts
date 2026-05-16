import { StoreController } from "_/controllers/store.mjs";
import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import yaml from "yaml";

@customElement("r2-challenge")
export class R2Challenge extends LitElement {
  static override styles = css`
    :host {
      overflow-x: hidden;
      overflow-y: scroll;
      height: 100%;
      width: 100%;
      display: block;

      &::-webkit-scrollbar {
        display: none !important;
        scrollbar-width: none !important; /* Firefox */
        -ms-overflow-style: none !important; /* IE 10+ / old Edge */
      }
    }
  `;
  private state = new StoreController(this, (s) => s.state);
  override render() {
    return html`<div class="scroller">
      <pre><code>${yaml.stringify(
        JSON.parse(JSON.stringify(this.state.curr || [])),
      )}</code></pre>
    </div>`;
  }
}
