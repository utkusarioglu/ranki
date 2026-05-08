import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { appStore } from "_store/app.mjs";
import type { RankiState } from "_config/config.types.mjs";

@customElement("r2-app")
export class R2App extends LitElement {
  static styles = css`
    :host {
      color: gray;
    }
  `;
  @property()
  config: RankiState | null = null;

  private unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();

    this.unsubscribe = appStore.subscribe(
      (s) => s.state,
      (config) => {
        this.config = config;
      },
    );
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  render() {
    return html`
      <r2-hud />
      <pre>${JSON.stringify(this.config, null, 2)}</pre>
    `;
  }
}
