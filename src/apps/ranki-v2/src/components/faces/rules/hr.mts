import styles from "./hr.css?inline";

export const hrSheet = new CSSStyleSheet();
hrSheet.replaceSync(styles);

export class RuleHorizontal extends HTMLElement {
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
    const hr = document.createElement("div");
    hr.classList.add("hr");
    this.classList.add("container");
    this.appendChild(hr);
  }
}

export const ruleHorizontalDefine = () =>
  customElements.define("rule-horizontal", RuleHorizontal);
