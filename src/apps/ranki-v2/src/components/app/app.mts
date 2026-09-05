import type { RankiDesignState } from "_config/config.types.mjs";

import { generatePaletteCss } from "_/design/color.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { AppStoreController } from "_controllers/store/store.controller.mjs";
import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import appStyle from "./app.css?inline";
import scheme from "./schemes.css?inline";
import theme from "./theme.css?inline";

@customElement("r2-app")
export class R2App extends R2C {
  static paletteSheet = new CSSStyleSheet();
  static override styles = [
    unsafeCSS(appStyle),
    R2App.paletteSheet,
    unsafeCSS(theme),
    unsafeCSS(scheme),
  ];
  private paletteName: string = "(none)";
  private state = new AppStoreController(this, (s) => s.state);

  override render() {
    const val = this.state.curr;
    if (val) {
      this.updatePalette(val.design);
    }
    return html`
      <r2-indicator></r2-indicator>
      <r2-challenge></r2-challenge>
      <r2-hud></r2-hud>
    `;
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
}
