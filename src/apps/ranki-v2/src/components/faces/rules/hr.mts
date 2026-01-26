import { RankiFacesElement } from "../face/RankiFacesElement.mts";
import styles from "./hr.css?inline";

export const hrSheet = new CSSStyleSheet();
hrSheet.replaceSync(styles);

export class RuleHorizontal extends RankiFacesElement {
  render() {
    const hr = document.createElement("div");
    hr.classList.add("hr");
    this.classList.add("container");
    this.appendChild(hr);
  }
}

export const ruleHorizontalDefine = () =>
  customElements.define("rule-horizontal", RuleHorizontal);
