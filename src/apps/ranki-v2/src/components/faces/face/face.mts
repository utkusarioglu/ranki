import { RankiFacesElement } from "../RankiFacesElement.mts";

export class RankiFacesFace extends RankiFacesElement {
  releaseMaxHeight() {
    this.style.removeProperty("max-height");
  }
}

export const facesFaceDefine = () =>
  customElements.define("ranki-faces-face", RankiFacesFace);
