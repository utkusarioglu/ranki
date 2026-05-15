import { css, html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import {
  R2C,
  type ComponentDims,
  type R2Geometry,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { StoreController } from "_/controllers/store.mjs";
import { generatePaletteCss } from "_/design/color.mjs";
import theme from "./theme.css?inline";
import scheme from "./schemes.css?inline";
import type { RankiDesignState } from "_config/config.types.mjs";

@customElement("r2-app")
export class R2App extends R2C {
  static paletteSheet = new CSSStyleSheet();
  static styles = [
    css`
      :host {
        position: fixed;
        inset: 0;
        color: rgb(var(--scheme-blue-2));
        transition-property: color;
        transition-duration: 1s;
        overflow: hidden;
      }
    `,
    R2App.paletteSheet,
    css`
      ${unsafeCSS(theme)}
    `,
    css`
      ${unsafeCSS(scheme)}
    `,
  ];
  private state = new StoreController(this, (s) => s.state);

  @query("r2-hud")
  private hud!: R2C;

  private paletteName: string = "(none)";

  updateGeometry(dims: ComponentDims[]): R2Geometry {
    const sizing = SizingUtils.row(dims.map((d) => d.dims));
    setTimeout(() => {
      this.getSizeList().forEach((e) =>
        e.informStyle({
          top: 10,
          left: window.innerWidth / 2 - sizing.width / 2,
        }),
      );
    }, PROPAGATE_DELAY);
    return { sizing };
  }

  protected getSizeList(): R2C[] {
    return [this.hud];
  }

  private updatePalette(design: RankiDesignState) {
    const paletteName = design.palette;
    if (paletteName === this.paletteName) return;
    this.paletteName = paletteName;
    const collection = design.paletteCollection;
    const palette = collection.find((v) => v.name === paletteName)!;
    const paletteCss = generatePaletteCss(palette);
    R2App.paletteSheet.replaceSync(paletteCss);
  }

  render() {
    const val = this.state.curr;
    if (val) {
      this.updatePalette(val.design);
    }
    return html`
      <r2-indicator></r2-indicator>
      <r2-hud @r2-child-size=${this.onChildSize}></r2-hud>
      <r2-challenge></r2-challenge>
    `;
  }
}
