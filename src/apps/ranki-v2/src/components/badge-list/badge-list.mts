import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { R2C, type Pos } from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, queryAll } from "lit/decorators.js";

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: 1em;
      white-space: nowrap;
    }
  `;
  @queryAll("r2-chip")
  private chips!: NodeListOf<R2C>;

  // connectedCallback(): void {
  //   super.connectedCallback();
  // }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitChildrenDims(Array.from(this.chips), (dims) => {
      console.log("then", this, dims);
      const width = dims.reduce((a, c) => Math.max(a, c.width), 0);
      const height = dims.reduce((a, c) => a + c.height, 0);
      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public setPosition(pos: Pos): void {
    super.setPosition(pos);
    this.setChildrenPosition(Array.from(this.chips), {
      top: 0,
      left: pos.left + 20,
    });
  }

  render() {
    return html`
      <div>
        badge-list
        <r2-chip style="--bg: red;"></r2-chip>
        <r2-chip style="--bg: blue; --top: 3em"></r2-chip>
      </div>
    `;
  }
}
