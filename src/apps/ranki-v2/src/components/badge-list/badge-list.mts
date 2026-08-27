import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";

import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import {
  reconciler,
  ReconciliationController,
} from "_controllers/reconciler/reconciler.mjs";
import { StoreController } from "_controllers/store/store.controller.mjs";
import { store } from "_controllers/store/store.decorator.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

import style from "./badge-list.css?inline";

type R2BadgeListState = HudTagListItem;

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static override styles = unsafeCSS(style);

  @query("r2-hud-bg")
  private accessor bg!: R2HudBg;

  @queryAll("r2-chip")
  private accessor chips!: NodeListOf<R2C>;

  @geometry({
    children: {
      diff: (r) => r.subtree.curr.diff,
      layout: () =>
        LayoutUtils.row({
          cross: {
            end: 2,
            start: 2,
          },
          main: {
            end: 10,
            gap: 4,
            start: 10,
          },
        }),
      selector: (h) => Array.from(h.chips),
    },
    collection: getAnimationCollection,
    role: "badge-list",
    watchers: {
      bg: {
        selector: (r) => [r.bg],
      },
    },
  })
  private readonly geo!: GeometryController<R2BadgeList>;

  @store((s) => s.state?.hud.subtree.tags.list || [])
  private readonly store!: StoreController<HudTagListItem[]>;

  @reconciler<R2BadgeList, R2BadgeListState>({
    on: (s, type, { index }) => {
      if (type === "leave") {
        s.chips[index]!.leave();
      }
    },
    reconcile: (c, p) => (c.text === p.text ? "retain" : "update"),
    source: (s) => s.store.curr || [],
    type: "flat",
  })
  private readonly subtree!: ReconciliationController<
    R2BadgeList,
    R2BadgeListState
  >;

  override render() {
    const base = this.subtree.curr.list;
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--bg": "rgb(var(--scheme-turquoise-1))",
          "--z-index": -2,
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
              @r2-geometry=${this.geo.onEmit()}
              @r2-reconciler=${this.subtree.onEmit(id)}
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}
