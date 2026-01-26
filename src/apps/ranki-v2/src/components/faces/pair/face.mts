export class RankiFacesPair extends HTMLElement {
  connectedCallback() {
    // const h = this.getBoundingClientRect().height;
    this.style.setProperty("opacity", "0");
    this.style.setProperty("max-height", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
        this.style.setProperty("max-height", "550px");
        this.addEventListener(
          "transitionend",
          () => {
            this.style.removeProperty("max-height");
          },
          {
            once: true,
          },
        );
      });
    });
  }

  exit() {
    // const h = this.getBoundingClientRect().height;
    this.style.setProperty("opacity", "1");
    // this.style.setProperty("max-height", h + "px");
    this.style.setProperty("max-height", "550px");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "0");
        this.style.setProperty("max-height", "0");
        this.style.setProperty("transform", "translateY(100px)");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }
}

export const facesPairDefine = () =>
  customElements.define("ranki-faces-pair", RankiFacesPair);
