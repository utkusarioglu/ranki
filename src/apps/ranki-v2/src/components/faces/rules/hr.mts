import styles from "./hr.css?inline";

export const hrSheet = new CSSStyleSheet();
hrSheet.replaceSync(styles);

export class RuleHorizontal extends HTMLElement {
  connectedCallback() {
    this.style.setProperty("opacity", "0");
    this.style.setProperty("max-height", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("max-height", "70px");
        this.style.setProperty("opacity", "1");
      });
    });
  }

  exit() {
    this.style.setProperty("opacity", "1");
    this.style.setProperty("max-height", "70px");
    this.style.setProperty("transform", "translateY(50px)");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "0");
        this.style.setProperty("max-height", "0px");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
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
