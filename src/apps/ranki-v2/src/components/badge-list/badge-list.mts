import { store, StoreController } from "_/controllers/store.mjs";
import { subtree, SubtreeController } from "_/controllers/subtree.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type AnimationPack,
  type ComponentDims,
  type InformContext,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
// import { ReconciliationUtils } from "_utils/reconciliation.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, html } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

type R2BadgeListState = HudTagListItem;

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

  @store((s) => s.state?.hud.subtree.tags.list || [])
  private store!: StoreController<HudTagListItem[]>;

  @subtree<R2BadgeListState>({
    type: "flat",
    reconcile: (c, p) => (c.text === p.text ? "retain" : "update"),
    getSource: (s) => s.store.curr || [],
  })
  private subtree!: SubtreeController<R2BadgeListState>;

  protected override getSubtreeList(): R2C[] {
    return Array.from(this.chips);
  }

  override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    return SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 4,
          end: 10,
        },
        cross: {
          start: 2,
          end: 2,
        },
      },
    );
  }

  protected override async updateStyle(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    const animationPack: AnimationPack = {
      expand: this.animateExpansion.bind(this),
      contract: this.animateContraction.bind(this),
      none: () => Promise.resolve(),
    };
    return animationPack[curr.main.action](curr, prev, context);
  }

  private async animateContraction(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    _prev: UpdateStyle | null,
  ): Promise<void> {
    await TimingUtils.delay(0)
      .then(() =>
        this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
      )
      .then(() =>
        TimingUtils.delay(0).then(() => {
          this.animateStyle("position", { top, left }, { duration: 1e3 });
          return this.bg.informStyle({ width, height, top: 0, left: 0 });
        }),
      );
  }

  private async animateExpansion({
    top,
    left,
    width,
    height,
    lefts,
    tops,
  }: UpdateStyle): Promise<void> {
    await Promise.all([
      TimingUtils.delay(0).then(async () => {
        this.animateStyle("position", { top, left }, { duration: 1e3 });
        await this.bg.informStyle({ width, height, top: 0, left: 0 });
      }),
      TimingUtils.delay(1000).then(() =>
        this.informSubtreeStyles({ tops, lefts }, this.subtree.curr.changes),
      ),
    ]);
  }

  override render() {
    const base = this.subtree.curr.list;
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--bg": "rgb(var(--scheme-turquoise-1))",
        })}"
      ></r2-hud-bg>
      ${repeat(
        Array.from({ length: base.length }, (_, i) => i),
        (i) => i,
        (i) => {
          const list = base.map((v) => v.props);
          const leave = base[i].leave;
          const id = base[i].id;
          return html`
            <r2-chip
              style="--bg: rgb(var(--scheme-surface-2))"
              .index=${i}
              .list=${list}
              @r2-child-size=${this.onChildSize}
              ?leave=${leave}
              @r2-child-leave=${this.subtree.onLeave(id)}
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}
