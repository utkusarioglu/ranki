import { css, html, type PropertyValues } from "lit";
import { customElement, property, queryAll, state } from "lit/decorators.js";
import { R2C, type AnimateableStyles } from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
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
      white-space: nowrap;
      width: 0;
      height: 0;
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

  public informStyle(pos: AnimateableStyles): void {
    // this.setStyle({ height: pos.height }).animateStyle(
    //   { width: pos.width },
    //   { duration: 1000 },
    // );
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.registerSizeWatch();
  }

  private registerSizeWatch() {
    this.watchDims(
      () => this.subtree,
      (dims) => {
        console.log("f", dims);
        const last = dims.at(-1);
        if (!last) return;
        this.setStyle(last);
        // this.setStyle({ height: last.height }).animateStyle(
        //   { width: last.width },
        //   { duration: this.props.animation.duration },
        // );

        setTimeout(() => {
          this.emitChildLoad(last, {});
        }, PROPAGATE_DELAY);
      },
    );
  }

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

  private partLeft(id: number) {
    this.parts = this.parts.filter((v) => v.id !== id);
  }

  render() {
    console.log("r");
    return html`${repeat(
      this.parts,
      (v) => v.id,
      (p) =>
        html`<r2-text-span 
          .props=${p.props} 
          ?leave=${p.leave} 
          @r2-text-span-left=${() => this.partLeft(p.id)}
        ></r2-text-span`,
    )}`;
  }
}
