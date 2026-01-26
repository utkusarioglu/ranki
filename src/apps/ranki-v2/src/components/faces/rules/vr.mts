import styles from "./vr.css?inline";

// export const vrSheet = new CSSStyleSheet();
// vrSheet.replaceSync(styles);

export const vrStyles = styles;

export class RuleVertical extends HTMLElement {
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
      this.style.setProperty("opacity", "0");
      this.addEventListener("transitionend", () => this.remove(), {
        once: true,
      });
    });
  }

  render() {
    const vr = document.createElement("div");
    vr.classList.add("vr");
    this.classList.add("container");
    this.appendChild(vr);
  }
}

export const ruleVerticalDefine = () =>
  customElements.define("rule-vertical", RuleVertical);
