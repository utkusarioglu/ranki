export class RankiFacesElement extends HTMLElement {
  connectedCallback() {
    this.addEventListener(
      "transitionend",
      () => {
        console.log("removed");
        this.style.removeProperty("max-height");
      },
      { once: true },
    );
    this.style.setProperty("opacity", "0");
    this.style.setProperty("max-height", "0");
    const height = window.innerHeight;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("max-height", height + "px");
        this.style.setProperty("opacity", "1");
      });
    });
  }

  exit() {
    const h = this.getBoundingClientRect().height;
    this.style.setProperty("opacity", "1");
    this.style.setProperty("max-height", h + "px");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "0");
        this.style.setProperty("max-height", "0");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }
}
