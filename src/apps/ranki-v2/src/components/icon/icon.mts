import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { iconToHTML, loadIcon } from "iconify-icon";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { R2C, type Dims, type Pos } from "_components/r2c/r2c.mjs";

@customElement("r2-icon")
export class R2Icon extends R2C {
  static styles = css`
    :host {
      display: inline-block;
      white-space: nowrap;
      width: 0;
      overflow: hidden;
      display: flex;
    }
  `;

  public setPosition(pos: Pos): void {}

  private setDims(dims: Dims) {
    this.animate(
      {
        width: dims.width + "px",
        height: dims.height + "px",
      },
      {
        duration: 4e2,
        fill: "both",
      },
    );
  }

  render() {
    const height = 24;
    const icon = loadIcon("mdi:home");
    icon.then(() => {
      const dims: Dims = { width: height, height };
      this.emitChildLoad(dims, {});
      this.setDims(dims);
    });

    return until(
      icon.then((i) =>
        unsafeHTML(
          iconToHTML(i.body, { height: height + "px", width: height + "px" }),
        ),
      ),
      html`L`,
    );
  }
}
