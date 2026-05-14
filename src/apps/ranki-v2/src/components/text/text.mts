import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import {
  R2C,
  R2CNew,
  type ComponentDims,
  type Dims,
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
  // static styles = css`
  //   :host {
  //     white-space: nowrap;
  //     width: 0;
  //     height: 0;
  //   }
  // `;
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

  protected getSizeList(): R2CNew[] {
    return Array.from(this.subtree);
  }

  updateGeometry(dims: ComponentDims[]): Dims | null {
    const last = dims.at(-1);
    if (!last) return null;
    this.setStyle(last.dims);
    return last.dims;
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
