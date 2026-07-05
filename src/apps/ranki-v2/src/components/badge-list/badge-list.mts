import { store, StoreController } from "_controllers/store/store.mjs";
import {
  reconciler,
  ReconciliationController,
} from "_controllers/reconciler/reconciler.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/sizing.utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import style from "./badge-list.css?inline";

type R2BadgeListState = HudTagListItem;

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static override styles = unsafeCSS(style);

  @queryAll("r2-chip")
  private chips!: NodeListOf<R2C>;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @store((s) => s.state?.hud.subtree.tags.list || [])
  // @ts-expect-error
  private readonly store!: StoreController<HudTagListItem[]>;

  @reconciler<R2BadgeListState>({
    type: "flat",
    reconcile: (c, p) => (c.text === p.text ? "retain" : "update"),
    source: (s) => s.store.curr || [],
    beforeLeave: (c, _, i) => {
      const chip = (c as R2BadgeList).chips[i];
      chip?.leave();
    },
  })
  private readonly subtree!: ReconciliationController<R2BadgeListState>;

  @geometry({
    role: "badge-list",
    targets: {
      bg: {
        selector: (r: R2BadgeList) => [r.bg],
      },
      chips: {
        selector: (r) => Array.from(r.chips),
        sizing: SizingUtils.row({
          main: {
            start: 10,
            gap: 4,
            end: 10,
          },
          cross: {
            start: 2,
            end: 2,
          },
        }),
        diff: (r) => r.subtree.curr.diff,
      },
    },
  })
  private readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

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
              style=${styleMap({
                "--bg": "rgb(var(--scheme-surface-2))",
                "z-index": base.length - i,
              })}
              .index=${i}
              .list=${list}
              ?leave=${leave}
              @r2-geometry=${this.geo.onEmit("chips")}
              @r2-reconciler=${this.subtree.onEmit(id)}
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}
