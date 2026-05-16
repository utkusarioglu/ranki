import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import {
  R2C,
  type ComponentDims,
  type R2Geometry,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2IconSpan } from "./icon-span.mts";
import { repeat } from "lit/directives/repeat.js";

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
  static styles = css`
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

  protected willUpdate(changed: PropertyValues): void {
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

  protected getSizeList(): R2C[] {
    return Array.from(this.subtree);
  }

  private onChildLeave(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    const last = dims.at(-1);
    if (!last) return null;
    return { ...last.dims, lefts: [0], tops: [0] };
  }

  protected async updateStyle(
    { index, length, top, left, height, width, lefts, tops }: UpdateStyle,
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

  render() {
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
