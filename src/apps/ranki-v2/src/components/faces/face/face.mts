export class RankiFacesFace extends HTMLElement {
  connectedCallback() {
    this.style.setProperty("opacity", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
      });
    });
  }

  exit() {
    this.style.setProperty("opacity", "1");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "0");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }
}

export const facesFaceDefine = () =>
  customElements.define("ranki-faces-face", RankiFacesFace);
