import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { R2C } from "_components/r2c/r2c.mjs";
import { type UpdateStyle } from "_/controllers/geometry.types.mjs";
import { type R2Sizing } from "_/controllers/geometry.types.mjs";
import { type ComponentDims } from "_/controllers/geometry.types.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2TextSpan } from "./text-span.mts";
import { repeat } from "lit/directives/repeat.js";
import { SizingUtils } from "_utils/Sizing.mjs";

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
  static override styles = css`
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

  protected override willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
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

  protected override getSubtreeList(): R2C[] {
    return Array.from(this.subtree);
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
    return new Promise<void>((resolve) => {
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
        resolve,
      );
    });
  }

  override render() {
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
