import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("r2-hud")
export class R2Hud extends LitElement {
  static styles = css`
    :host {
      background-color: red;
      position: fixed;
      width: 200px;
      height: 200px;
    }
  `;

  render() {
    return html`hi`;
  }
}
