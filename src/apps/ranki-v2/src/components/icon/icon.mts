import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import {
  R2C,
  type ComponentDims,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2IconSpan } from "./icon-span.mts";
import { repeat } from "lit/directives/repeat.js";
import { SizingUtils } from "_utils/Sizing.mjs";

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
  static override styles = css`
    :host {
      display: block;
      position: absolute;
      overflow: hidden;
      opacity: 0;
      width: 0;
      height: 0;
    }
  `;

  @property()
  private props!: R2IconProps;

  @queryAll("r2-icon-span")
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

  protected override getSubtreeList(): R2C[] {
    return Array.from(this.subtree);
  }

  private onChildLeave(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  protected override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    return SizingUtils.last(dims, {
      main: {
        start: 0,
        end: 0,
      },
    });
  }

  protected override async updateStyle(
    { top, left, height, width }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.setStyle({
      height: height,
      left: left,
      top: top,
    }).animateStyle(
      "width",
      {
        opacity: 1,
        width: width,
      },
      {
        duration: this.props.animation.duration,
        delay: 500,
      },
    );
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
          @r2-child-size=${this.onChildSize}
        ></r2-icon-span`,
    )}`;
  }
}
