export class HudCuesCue extends HTMLElement {
  getLeft() {
    return this.getBoundingClientRect().left;
  }

  getRight() {
    return this.getBoundingClientRect().right;
  }

  connectedCallback() {
    // this.classList.add("entering");
    this.style.setProperty("opacity", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
        // this.classList.remove("entering");
      });
    });
  }

  exit() {
    // this.classList.add("exiting");
    this.style.setProperty("opacity", "1");
    requestAnimationFrame(() => {
      this.style.setProperty("opacity", "0");
      this.addEventListener("transitionend", () => this.remove(), {
        once: true,
      });
    });
  }
}

export const hudCuesCueDefine = () =>
  customElements.define("hud-cues-cue", HudCuesCue);
