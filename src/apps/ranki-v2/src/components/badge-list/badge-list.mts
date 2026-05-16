import { StoreController } from "_/controllers/store.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type ComponentDims,
  type InformStyle,
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
    const updated: R2BadgeListState[] = curr.map((v) => ({
      ...v,
      id: this.idCounter++,
      leave: false,
    }));

    if (prev.length > updated.length) {
      for (let i = updated.length; i < prev.length; i++) {
        updated.push({
          ...prev[i],
          leave: true,
        });
      }
    }
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

  public informStyle({ top, left, index, length }: InformStyle): void {
    const {
      sizing: { width, height, lefts, tops },
    } = this.getGeometry();
    this.animateStyle("position", { top, left }, { duration: 1e3 });
    this.bg.informStyle({
      width,
      height,
      top: 0,
      left: 0,
      index: -1,
      length: 0,
    });
    this.getSizeList().forEach((e, i, a) =>
      e.informStyle({
        index: i,
        length: a.length,
        left: lefts[i],
        top: tops[i],
      }),
    );
  }

  private onChildLeave(id: number) {
    this.parts.splice(id, 1);
    this.parts = [...this.parts];
  }

  render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--border": "purple solid 1px",
        })}"
      ></r2-hud-bg>
      ${repeat(
        Array.from({ length: this.parts.length }, (_, i) => i),
        (i) => i,
        (i) => {
          return html`
            <r2-chip
              .index=${i}
              .list=${this.parts}
              ?leave=${this.parts[i].leave}
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
