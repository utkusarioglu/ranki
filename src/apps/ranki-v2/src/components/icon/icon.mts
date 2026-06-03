import { html, unsafeCSS, type PropertyValues } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { R2C } from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2IconSpan } from "./icon-span.mts";
import { repeat } from "lit/directives/repeat.js";
import { SizingUtils } from "_utils/Sizing.mjs";
import { geometry, GeometryController } from "_/controllers/geometry.mjs";
import style from "./icon.css?inline";

export interface R2IconProps {
  animation: RankiPropAnimationBlock;
  icon: string;
  color: string;
  width: number;
  height: number;
}

export type Parts = {
  id: number;
  props: R2IconProps;
  leave: boolean;
};

@customElement("r2-icon")
export class R2Icon extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  private props!: R2IconProps;

  @geometry({
    role: "icon",
    targets: {
      "icon-span": {
        selector: (s) => Array.from(s.subtree),
        sizing: SizingUtils.last(),
      },
    },
  })
  public readonly geo!: GeometryController;

  @queryAll("r2-icon-span")
  // @ts-expect-error
  private subtree!: NodeListOf<R2IconSpan>;

  private parts: Parts[] = [];

  private idCounter = 0;

  protected override willUpdate(changed: PropertyValues): void {
    if (!changed.has("props")) return;
    const curr = this.parts.at(-1);
    if (curr && curr.props.icon === this.props.icon) return;
    const updated = this.parts.map((p) => ({ ...p, leave: true }));
    this.parts = [
      ...updated,
      {
        id: this.idCounter++,
        props: { ...this.props },
        leave: false,
      },
    ];
  }

  override informStyle = this.geo.informStyle.bind(this.geo);

  private onChildLeave(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  override render() {
    return html`${repeat(
      this.parts,
      (v) => v.id,
      (p) =>
        html`<r2-icon-span 
          .props=${p.props} 
          ?leave=${p.leave} 
          @r2-child-leave=${() => this.onChildLeave(p.id)}
          @r2-child-size=${this.geo.onChildSize("icon-span")}
        ></r2-icon-span`,
    )}`;
  }
}
