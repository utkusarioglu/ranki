import { StoreController } from "_/controllers/store.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type ComponentDims,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import { ReconciliationUtils } from "_utils/reconcilliation.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query, queryAll, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

type R2BadgeListState = HudTagListItem & { leave: boolean; id: number };

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static override styles = css`
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

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const curr = this.state.curr || [];
    const prev = this.parts;
    this.parts = ReconciliationUtils.flat<R2BadgeListState, HudTagListItem>(
      curr,
      prev,
      () => this.idCounter++,
    );
  }

  protected override getSubtreeList(): R2C[] {
    return Array.from(this.chips);
  }

  override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    return SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
      },
    );
  }

  protected override async updateStyle(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.animateStyle("position", { top, left }, { duration: 1e3 });
    this.bg.informStyle({
      width,
      height,
      top: 0,
      left: 0,
      ordinal: {
        index: -1,
        changeIndex: -1,
        length: 0,
      },
    });
    this.informSubtreeStyles({ tops, lefts });
  }

  private onChildLeave(id: number) {
    this.parts.splice(id, 1);
    this.parts = [...this.parts];
  }

  override render() {
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
