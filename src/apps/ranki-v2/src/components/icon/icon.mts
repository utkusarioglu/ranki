import { css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { until } from "lit/directives/until.js";
import { iconToHTML, loadIcon } from "iconify-icon";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { R2C, type Dims } from "_components/r2c/r2c.mjs";

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

  render() {
    const height = 24;
    const icon = loadIcon("mdi:home");
    icon.then(() => {
      const dims: Dims = { width: height, height };
      this.setStyle({ height });
      this.animateStyle({ width: dims.width }, { duration: 1000 });
      this.emitChildLoad(dims, {});
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
