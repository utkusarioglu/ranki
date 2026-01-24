export class HudAddressCrumb extends HTMLElement {
  getLeft() {
    return this.getBoundingClientRect().left;
  }

  getRight() {
    return this.getBoundingClientRect().right;
  }

  connectedCallback() {
    this.style.setProperty("opacity", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
      });
    });
  }

  exit() {
    this.style.setProperty("opacity", "0");
    requestAnimationFrame(() => {
      this.addEventListener("transitionend", () => this.remove(), {
        once: true,
      });
    });
  }
}

export const hudAddressCrumbDefine = () =>
  customElements.define("hud-address-crumb", HudAddressCrumb);
