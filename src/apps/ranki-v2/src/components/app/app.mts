import { css, html, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { appStore } from "_store/app.mjs";
import type { RankiState } from "_config/config.types.mjs";
import { R2C, SizingUtils } from "_components/r2c/r2c.mjs";
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
    this.waitForDimensions([this.hud], (dims) => {
      const { width, height } = SizingUtils.column(dims);

      console.log("final", this, dims, { width, height });

      setTimeout(() => {
        console.log("timeout");
        this.animateStyle({ left: 20 }, { duration: 1000 });
        [this.hud].forEach((e) => e.informStyle({ left: 40 }));
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
