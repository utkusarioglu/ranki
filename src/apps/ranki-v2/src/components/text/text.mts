import { css, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";
import { R2C, type Dims } from "_components/r2c/r2c.mjs";

@customElement("r2-text")
export class R2Text extends R2C {
  static styles = css`
    :host {
      display: inline-block;
      white-space: nowrap;
      width: 0;
      overflow: hidden;
    }
  `;

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

  protected firstUpdated(_changedProperties: PropertyValues): void {}

  render() {
    const span = document.createElement("span");
    span.innerText = "a".repeat(Math.floor(Math.random() * 10) + 2);

    new Promise<void>(async (r) => {
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      r();
    }).then(() => {
      const rect = span.getBoundingClientRect();
      const dims: Dims = { width: rect.width, height: rect.height };
      this.setDims(dims);
      this.emitChildLoad(dims, {});
    });

    return span;
    // return until(
    //   icon.then((i) => unsafeHTML(iconToHTML(i.body, { height: "20px" }))),
    //   html`L`,
    // );
  }
}
