import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import style from "./chip.css?inline";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";
import {
  LayoutUtils,
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static override styles = unsafeCSS(style);

  @query("r2-icon")
  private icon!: R2C;

  @query("r2-text")
  private text!: R2C;

  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @property()
  private index!: number;

  @property()
  private list!: HudTagListItem[];

  @geometry<R2Chip>({
    role: "chip",
    recipe: getAnimationRecipe,
    events: {
      hover: true,
    },
    on: (s, action) => {
      if (action === "leave-end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
    children: {
      selector: (s) => [s.icon, s.text],
      layout: () =>
        LayoutUtils.row({
          main: {
            start: 10,
            gap: 5,
            end: 10,
          },
          cross: {
            start: 5,
            end: 5,
          },
        }),
    },
    watchers: {
      bg: {
        selector: (s) => [s.bg],
      },
    },
  })
  private readonly geo!: GeometryController<R2Chip>;

  public override leave() {
    this.geo.events.emit({
      type: "intent",
      intent: "leave",
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    const item = this.list[this.index];

    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon
        .props=${{
          icon: "mdi:home",
          color: "rgb(var(--scheme-orange-2))",
          width: 24,
          height: 24,
          animation: {
            enabled: true,
            duration: 1000,
          },
        }}
        style="position: absolute;"
        @r2-geometry=${this.geo.onEmit()}
      ></r2-icon>
      <r2-text
        .props=${item}
        style="position: absolute;"
        @r2-geometry=${this.geo.onEmit()}
      ></r2-text>
    `;
  }
}
