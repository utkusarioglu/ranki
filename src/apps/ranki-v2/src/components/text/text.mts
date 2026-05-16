import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import {
  R2C,
  type ComponentDims,
  type R2Geometry,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2TextSpan } from "./text-span.mts";
import { repeat } from "lit/directives/repeat.js";

export interface R2TextProps {
  animation: RankiPropAnimationBlock;
  text: string;
  color: string;
}

export type Parts = {
  id: number;
  props: R2TextProps;
  leave: boolean;
};

@customElement("r2-text")
export class R2Text extends R2C {
  static styles = css`
    :host {
      position: absolute;
      overflow: hidden;
      opacity: 0;
      width: 0;
      height: 0;
    }

    :host > span {
      white-space: nowrap;
    }
  `;
  @property({
    hasChanged: (n: R2TextProps, o: R2TextProps | undefined) => {
      return n.text !== o?.text;
    },
  })
  private props!: R2TextProps;

  @queryAll("r2-text-span")
  private subtree!: NodeListOf<R2TextSpan>;

  @state()
  private parts: Parts[] = [];

  private idCounter = 0;

  protected willUpdate(changed: PropertyValues): void {
    if (!changed.has("props")) return;
    const curr = this.parts.at(-1);
    if (curr && curr.props.text === this.props.text) return;
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

  private onChildLeave(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  protected getSizeList(): R2C[] {
    return Array.from(this.subtree);
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    const last = dims.at(-1);
    if (!last) return null;
    return { ...last.dims, lefts: [0], tops: [0] };
  }

  protected async updateStyle(
    { index, length, top, left, height, width }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.setStyle({
      height,
      top,
      left,
    }).animateStyle(
      "width",
      {
        opacity: 1,
        width,
      },
      {
        duration: 1000,
        delay: 500,
      },
    );
  }

  render() {
    return html`${repeat(
      this.parts,
      (v) => v.id,
      (p) =>
        html`<r2-text-span 
          .props=${p.props} 
          ?leave=${p.leave} 
          @r2-child-leave=${() => this.onChildLeave(p.id)}
          @r2-child-size=${this.onChildSize}
        ></r2-text-span`,
    )}`;
  }
}
