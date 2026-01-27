import { RankiFacesElement } from "../RankiFacesElement.mts";

export class RankiFacesFace extends RankiFacesElement {}

export const facesFaceDefine = () =>
  customElements.define("ranki-faces-face", RankiFacesFace);
