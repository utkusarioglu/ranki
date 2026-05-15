import { StoreController } from "_/controllers/store.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type AnimateableStyles,
  type ComponentDims,
  type R2Geometry,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query, queryAll, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

type R2BadgeListState = HudTagListItem & { leave: boolean; id: number };

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @queryAll("r2-chip")
  private chips!: NodeListOf<R2C>;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @state()
  private parts: R2BadgeListState[] = [];

  private idCounter = 0;
  private state = new StoreController<HudTagListItem[]>(
    this,
    (s) => s.state?.hud.subtree.tags.list || [],
  );

  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const curr = this.state.curr || [];
    const prev = this.parts;
    const updated: R2BadgeListState[] = [];
    let ci = 0;
    let pi = 0;
    while (pi < prev.length) {
      const p = prev[pi];
      const c = curr[ci];
      if (!c || p.text !== c.text) {
        p.leave = true;
        updated.push(p);
      } else if (p.text === c.text) {
        updated.push(p);
        ci++;
      }
      pi++;
    }
    while (ci < curr.length) {
      updated.push({
        ...curr[ci],
        id: this.idCounter++,
        leave: false,
      });
      ci++;
    }
    console.log("u", updated);
    this.parts = updated;
  }

  protected getSizeList(): R2C[] {
    return Array.from(this.chips);
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    const sizing = SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
      },
    );
    return { sizing };
  }

  public informStyle(pos: AnimateableStyles): void {
    const { sizing } = this.getGeometry();
    this.animateStyle("position", pos, { duration: 1e3 });
    this.bg.informStyle({ ...pos, width: sizing.width, height: sizing.height });
    this.getSizeList().forEach((e, i) =>
      e.informStyle({
        left: sizing.lefts[i],
        top: sizing.tops[i],
      }),
    );
  }

  private onChildLeave(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  render() {
    const list = this.parts;
    console.log("l", list);
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--border": "purple solid 1px",
        })}"
      ></r2-hud-bg>
      ${repeat(
        Array.from({ length: list.length }, (_, i) => i),
        (i) => i,
        (i) => {
          return html`
            <r2-chip
              .index=${i}
              .list=${this.state.curr}
              ?leave=${list[i].leave}
              style="--border: red solid 1px; --bg: #333;"
              @r2-child-leave=${() => this.onChildLeave(i)}
              @r2-child-size=${this.onChildSize}
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}
