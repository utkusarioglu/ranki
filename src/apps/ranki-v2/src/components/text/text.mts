import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import {
  R2C,
  type AnimateableStyles,
  type ComponentDims,
  type InformStyle,
  type R2Geometry,
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

  // public informStyle(pos: AnimateableStyles): void {
  //   this.setStyle({ height: pos.height }).animateStyle(
  //     { width: pos.width },
  //     { duration: 1000 },
  //   );
  // }

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
    return { sizing: { ...last.dims, lefts: [0], tops: [0] } };
  }

  public informStyle(pos: InformStyle): void {
    const { sizing } = this.getGeometry();
    this.setStyle({
      height: sizing.height,
      top: pos.top,
      left: pos.left,
    }).animateStyle(
      "width",
      {
        opacity: 1,
        width: sizing.width,
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
