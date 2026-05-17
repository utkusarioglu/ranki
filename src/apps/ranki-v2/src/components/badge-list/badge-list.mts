import { StoreController } from "_/controllers/store.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type ComponentDims,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import { assertNever } from "_error/assertions.mjs";
import {
  ReconciliationUtils,
  type ReconciliationActions,
} from "_utils/reconcilliation.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query, queryAll, state } from "lit/decorators.js";
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

  @state()
  private subtree = ReconciliationUtils.empty<R2BadgeListState>();

  private idCounter = 0;
  private state = new StoreController<HudTagListItem[]>(
    this,
    (s) => s.state?.hud.subtree.tags.list || [],
  );

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    const curr = this.state.curr || [];
    const prev = this.subtree;
    this.subtree = ReconciliationUtils.flat(
      prev,
      curr,
      () => this.idCounter++,
      (curr, prev) => {
        const isCurr = curr !== undefined;
        const isPrev = prev !== undefined;
        let action: ReconciliationActions;
        if (isCurr && isPrev) {
          if (curr.text === prev.text) {
            action = "retain";
          } else {
            action = "update";
          }
        } else if (isCurr && !isPrev) {
          action = "add";
        } else if (!isCurr && isPrev) {
          action = "remove";
        } else {
          assertNever({
            why: "Impossible reconciliation state",
            details: {
              curr,
              prev,
              isCurr,
              isPrev,
            },
          });
        }
        return action;
      },
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
    await TimingUtils.delay(500);
    this.animateStyle("position", { top, left }, { duration: 1e3 });
    this.bg.informStyle({
      width,
      height,
      top: 0,
      left: 0,
      context: {
        index: -1,
        length: 0,
      },
    });
    console.log("change", this.subtree.changes);
    this.informSubtreeStyles({ tops, lefts }, this.subtree.changes);
  }

  private onChildLeave(id: number) {
    this.subtree = ReconciliationUtils.leave(this.subtree, id);
  }

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--bg": "rgb(var(--scheme-turquoise-1))",
        })}"
      ></r2-hud-bg>
      ${repeat(
        Array.from({ length: this.subtree.list.length }, (_, i) => i),
        (i) => i,
        (i) => {
          return html`
            <r2-chip
              .index=${i}
              .list=${this.subtree.list.map((v) => v.props)}
              ?leave=${this.subtree.list[i].leave}
              style="--bg: rgb(var(--scheme-surface-2))"
              @r2-child-leave=${() => this.onChildLeave(i)}
              @r2-child-size=${this.onChildSize}
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}
