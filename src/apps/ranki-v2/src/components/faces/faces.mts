import type { RenderRoots } from "@dqm/package-dqm-v2";
import type { CardFaceArray } from "../../config/collect/collect.types.mts";
import styles from "./faces.component.css?inline";
import { renderDqm } from "../../dqm/render-dqm.mts";
import type { RankiDqmConfig } from "../../config/config.types.mts";
import { hrSheet, RuleHorizontal } from "./rules/hr.mts";
import { RuleVertical, vrSheet } from "./rules/vr.mts";

const NAME = "ranki-faces";
type Props = { faces: CardFaceArray; dqm: RankiDqmConfig };

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class RankiFaces extends HTMLElement {
  private curr!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet, hrSheet, vrSheet];
  }

  set props(props: Props) {
    this.curr = props;
    this.render();
  }

  private container() {
    let c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    c = document.createElement("div");
    c.classList.add("container");

    this.shadowRoot!.appendChild(c);
    return c;
  }

  private build() {
    const container = this.container();
    this.subtree(container);
  }

  private hr(index: number) {
    let hr = this.shadowRoot!.querySelector(
      `rule-horizontal[data-index="${index}"`,
    );
    if (hr) {
      return hr;
    }
    hr = document.createElement("rule-horizontal");
    hr.setAttribute("data-index", index.toString());
    (hr as RuleHorizontal).render();
    return hr;
  }

  private vr(index: number) {
    let vr = this.shadowRoot!.querySelector(
      `rule-vertical[data-index="${index}"`,
    );
    if (vr) {
      return vr;
    }
    vr = document.createElement("rule-vertical");
    vr.setAttribute("data-index", index.toString());
    (vr as RuleVertical).render();
    return vr;
  }

  private face(faceName: string, index: number) {
    const d = this.shadowRoot!.querySelector(
      `ranki-faces-face.${faceName}`,
    ) as HTMLDivElement;
    if (d) {
      return d;
    }
    const face = document.createElement("ranki-faces-face") as HTMLDivElement;
    face.classList.add(faceName);
    face.setAttribute("data-index", index.toString());
    face.classList.add(faceName);
    return face;
  }

  private subtree(faceContainer: HTMLDivElement) {
    const faces: RenderRoots = Object.fromEntries(
      this.curr.faces
        .map((faceName, i) => {
          switch (faceName) {
            case "ranki:hr":
              faceContainer.appendChild(this.hr(i));
              // createHr(faceContainer, i);
              break;
            case "ranki:vr":
              faceContainer.appendChild(this.vr(i));
              //   createVr(faceContainer, i);
              break;
            default:
              const faceEl = this.face(faceName, i);
              faceContainer.appendChild(faceEl);
              return [faceName, faceEl];
          }
        })
        .filter((v) => v !== undefined),
    );

    renderDqm(this.curr.dqm, faces);
  }

  render() {
    this.build();
  }
}

export const rankiFacesDefine = () => customElements.define(NAME, RankiFaces);

export function rankiFaces(props: Props, attach: HTMLElement) {
  let el: RankiFaces | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as RankiFaces;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
