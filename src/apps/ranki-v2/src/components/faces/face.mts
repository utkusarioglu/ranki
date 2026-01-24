export class RankiFacesFace extends HTMLElement {
  // getLeft() {
  //   return this.getBoundingClientRect().left;
  // }

  // getRight() {
  //   return this.getBoundingClientRect().right;
  // }

  connectedCallback() {
    this.style.setProperty("opacity", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
      });
    });
  }

  exit() {
    this.classList.add("opacity", "1");
    requestAnimationFrame(() => {
      this.classList.add("opacity", "0");
      this.addEventListener("transitionend", () => this.remove(), {
        once: true,
      });
    });
  }
}

export const facesFaceDefine = () =>
  customElements.define("ranki-faces-face", RankiFacesFace);
