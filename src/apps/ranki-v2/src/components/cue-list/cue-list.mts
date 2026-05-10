import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { R2C, type Pos } from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: 1em;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2C;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitChildrenDims([this.badgeList], (dims) => {
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
    this.setChildrenPosition([this.badgeList], { top: 0, left: pos.left + 20 });
  }

  render() {
    return html`
      <div>
        cue-list
        <r2-badge-list></r2-badge-list>
      </div>
    `;
  }
}
