import type { RankiFacesFace } from "../face/face.mts";
import type { RuleHorizontal } from "../rules/hr.mts";

export type PairChildren = RankiFacesFace | RuleHorizontal;

export class RankiFacesPair extends HTMLElement {
  connectedCallback() {
    this.style.setProperty("opacity", "0");
    this.style.setProperty("transform", "translateY(50px)");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
        this.style.setProperty("transform", "translateY(0)");
        // this.style.setProperty("max-height", "550px");
        this.addEventListener(
          "transitionend",
          () => {
            // this.style.removeProperty("max-height");
            // this.style.removeProperty("transform");
          },
          {
            once: true,
          },
        );
      });
    });
  }

  getContainer(): HTMLDivElement {
    return this.querySelector(".container")!;
  }

  getChildren(): HTMLElement[] {
    return Array.from(this.getContainer().children) as PairChildren[];
  }

  exit() {
    // const h = this.getBoundingClientRect().height;
    this.style.setProperty("opacity", "1");
    this.style.setProperty("transform", "translateY(0)");
    // this.style.setProperty("max-height", h + "px");
    // this.style.setProperty("max-height", "550px");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "0");
        // this.style.setProperty("max-height", "0");
        this.style.setProperty("transform", "translateY(-50px)");
        this.addEventListener("transitionend", () => this.exit(), {
          once: true,
        });
      });
    });
  }
}

export const facesPairDefine = () =>
  customElements.define("ranki-faces-pair", RankiFacesPair);
