import { css, html, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { appStore } from "_store/app.mjs";
import type { RankiState } from "_config/config.types.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";

@customElement("r2-app")
export class R2App extends R2C {
  static styles = css`
    :host {
      color: gray;
    }
  `;
  @property()
  config: RankiState | null = null;

  @query("r2-hud")
  private hud!: R2C;

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

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitChildrenDims([this.hud], (dims) => {
      console.log("then", this, dims);
      const width = dims.reduce((a, c) => Math.max(a, c.width), 0);
      const height = dims.reduce((a, c) => a + c.height, 0);

      console.log("final", { width, height });

      setTimeout(() => {
        console.log("timeout");
        this.setPosition({ left: 20, top: 0 });
        this.setChildrenPosition([this.hud], { left: 40, top: 0 });
      }, PROPAGATE_DELAY);
    });
  }

  disconnectedCallback() {
    this.unsubscribe?.();
    super.disconnectedCallback();
  }

  render() {
    return html`<r2-hud></r2-hud>`;
  }
}
