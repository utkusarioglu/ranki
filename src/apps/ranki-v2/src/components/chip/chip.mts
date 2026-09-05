// import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";

import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import { ReconciliationUtils } from "_controllers/reconciler/reconciler.mjs";
import { getAnimationCollection } from "_store/store.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import style from "./chip.css?inline";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    children: {
      layout: () =>
        LayoutUtils.row({
          cross: {
            end: 5,
            start: 5,
          },
          main: {
            end: 10,
            gap: 5,
            start: 10,
          },
        }),
    },
    collection: getAnimationCollection,
    events: {
      hover: true,
    },
    on: (s, action) => {
      if (action === "lifecycle.leave/end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
    role: "chip",
  })
  private readonly geo!: GeometryController<R2Chip>;

  @property()
  private accessor index!: number;

  @property()
  private accessor list!: HudTagListItem[];

  public override leave() {
    this.geo.events.emit({
      lifecycle: "leave",
      type: "lifecycle",
    });
  }

  override render() {
    const item = this.list[this.index];

    return html`
      <r2-hud-bg
        style="--z-index: -1;"
        @r2-geometry=${this.geo.watcher()}
      ></r2-hud-bg>

      <r2-icon
        .props=${{
          animation: {
            duration: 1000,
            enabled: true,
          },
          color: "rgb(var(--scheme-orange-2))",
          height: 24,
          icon: "mdi:home",
          width: 24,
        }}
        style="position: absolute;"
        @r2-geometry=${this.geo.child()}
      ></r2-icon>
      <r2-text
        .props=${item}
        style="position: absolute;"
        @r2-geometry=${this.geo.child()}
      ></r2-text>
    `;
  }
}
