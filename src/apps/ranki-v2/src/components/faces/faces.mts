import type { RenderRoots } from "@dqm/package-dqm-v2";
import type { CardFaceArray } from "../../config/collect/collect.types.mts";
import styles from "./faces.component.css?inline";
import { renderDqm } from "../../dqm/render-dqm.mts";
import type { RankiDqmConfig } from "../../config/config.types.mts";
import { hrSheet, RuleHorizontal } from "./rules/hr.mts";
import { RuleVertical, vrSheet } from "./rules/vr.mts";
import type { RankiFacesFace } from "./face/face.mts";

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

  private hr(container: HTMLElement, index: number) {
    let hr = this.shadowRoot!.querySelector(
      `rule-horizontal[data-index="${index}"`,
    );
    if (hr) {
      return;
    }
    hr = document.createElement("rule-horizontal");
    hr.setAttribute("data-index", index.toString());
    (hr as RuleHorizontal).render();
    container.appendChild(hr);
  }

  private vr(container: HTMLElement, index: number) {
    let vr = this.shadowRoot!.querySelector(
      `rule-vertical[data-index="${index}"`,
    );
    if (vr) {
      return;
    }
    vr = document.createElement("rule-vertical");
    vr.setAttribute("data-index", index.toString());
    (vr as RuleVertical).render();
    container.appendChild(vr);
  }

  private face(container: HTMLElement, faceName: string, index: number) {
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
    container.appendChild(face);
    return face;
  }

  private subtree(faceContainer: HTMLDivElement) {
    type FaceTypes = RankiFacesFace | RuleHorizontal | RuleVertical;
    const cn = faceContainer.childNodes.length;
    const sn = this.curr.faces.length;
    const rm: FaceTypes[] = [];
    const roots: RenderRoots = { theaters: {} };

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const faceName = this.curr.faces[i];
      if (faceName) {
        switch (faceName) {
          case "ranki:hr":
            this.hr(faceContainer, i);
            break;
          case "ranki:vr":
            this.vr(faceContainer, i);
            break;
          default:
            const faceEl = this.face(faceContainer, faceName, i);
            if (faceEl) {
              roots.theaters[faceName] = () => {
                console.log("face", faceName);
                return faceEl;
              };
            }
        }
      } else {
        rm.push(faceContainer.childNodes[i] as FaceTypes);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.exit();
      });

    renderDqm(this.curr.dqm, roots);
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
