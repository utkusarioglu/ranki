import type { RenderRoots } from "@dqm/package-dqm-v2";
import type { CardFaceArray } from "../../config/collect/collect.types.mts";
import styles from "./faces.component.css?inline";
import { renderDqm } from "../../dqm/render-dqm.mts";
import type { RankiDqmConfig } from "../../config/config.types.mts";
import { hrSheet, RuleHorizontal } from "./rules/hr.mts";
import { RuleVertical, vrSheet } from "./rules/vr.mts";
import type { RankiFacesFace } from "./face/face.mts";
import { DqmAppError } from "../../../../../packages/dqm-v2/src/errors/dqm-app-error/dqm-app-error.mts";
import {
  assertNotUndefined,
  assertNever,
  assertNotNull,
} from "../../error/assertions.mts";
import type { RankiFacesPair } from "./pair/face.mts";

type RenderedFaces = Record<string, RankiFacesFace>;

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
    // this.subtree(container);
    this.pairs(container);
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

  // private face(container: HTMLElement, faceName: string, index: number) {
  //   const d = this.shadowRoot!.querySelector(
  //     `ranki-faces-face.${faceName}`,
  //   ) as HTMLDivElement;
  //   if (d) {
  //     return d;
  //   }
  //   const face = document.createElement("ranki-faces-face") as HTMLDivElement;
  //   face.classList.add(faceName);
  //   face.setAttribute("data-index", index.toString());
  //   face.classList.add(faceName);
  //   container.appendChild(face);
  //   return face;
  // }

  private renderDqm(): RenderedFaces {
    const faceEntries: [string, RankiFacesFace][] = [];
    const theaterEntries: [string, () => HTMLDivElement][] = [];
    this.curr.dqm.inputs.forEach((n) => {
      const face = document.createElement("ranki-faces-face");
      faceEntries.push([n.theater, face as RankiFacesFace]);
      theaterEntries.push([n.theater, () => face as HTMLDivElement]);
    });
    renderDqm(this.curr.dqm, { theaters: Object.fromEntries(theaterEntries) });
    return Object.fromEntries(faceEntries);
  }

  private pairs(container: HTMLDivElement) {
    // TODO
    const pairs = Array.from(container.children);
    const newFaces = this.renderDqm();
    console.log(newFaces["A"].getAttribute("dqm-key"));

    if (!pairs.length) {
      this.newPair(container, newFaces);
      return;
    }

    const last = pairs.at(-1)!;
    const matches: boolean[] = [];
    this.curr.faces.forEach((f, i) => {
      const prev = last.children[i];
      if (!prev) {
        return matches.push(false);
      }
      switch (f) {
        case "ranki:hr":
        case "ranki:vr":
          matches.push(prev.getAttribute("data-index") === i.toString());
          break;
        default:
          const prevKey = prev.getAttribute("dqm-key");
          assertNotUndefined(prevKey, { why: "dqm-key attribute is required" });
          const prevTheater = prev.getAttribute("dqm-theater")!;
          assertNotNull(prevTheater, {
            why: "dqm-theater attribute is required",
            details: {
              prevTheater,
            },
          });
          const curr = newFaces[prevTheater];
          const newKey = curr.getAttribute("dqm-key");
          assertNotUndefined(newKey, { why: "dqm-key attribute is required" });
          matches.push(prevKey === newKey);
      }
    });
    const noMatch = matches.every((v) => !v);
    if (noMatch) {
      return this.newPair(container, newFaces);
    }
    console.log("m", matches, last, newFaces);
  }

  private newPair(container: HTMLDivElement, newFaces: RenderedFaces) {
    const pair = document.createElement("ranki-faces-pair") as RankiFacesPair;
    container.appendChild(pair);
    this.curr.faces.forEach((f, i) => {
      switch (f) {
        case "ranki:hr":
          this.hr(pair, i);
          break;
        case "ranki:vr":
          this.vr(pair, i);
          break;
        default:
          pair.appendChild(newFaces[f]);
      }
    });
  }

  // private subtree(faceContainer: HTMLDivElement) {
  //   type FaceTypes = RankiFacesFace | RuleHorizontal | RuleVertical;
  //   const cn = faceContainer.childNodes.length;
  //   const sn = this.curr.faces.length;
  //   const rm: FaceTypes[] = [];
  //   const roots: RenderRoots = { theaters: {} };

  //   for (let i = 0; i < Math.max(cn, sn); i++) {
  //     const faceName = this.curr.faces[i];
  //     if (faceName) {
  //       switch (faceName) {
  //         case "ranki:hr":
  //           this.hr(faceContainer, i);
  //           break;
  //         case "ranki:vr":
  //           this.vr(faceContainer, i);
  //           break;
  //         default:
  //           const faceEl = this.face(faceContainer, faceName, i);
  //           if (faceEl) {
  //             roots.theaters[faceName] = () => {
  //               console.log("face", faceName);
  //               return faceEl;
  //             };
  //           }
  //       }
  //     } else {
  //       rm.push(faceContainer.childNodes[i] as FaceTypes);
  //     }
  //   }
  //   rm.length &&
  //     rm.forEach((r) => {
  //       r.exit();
  //     });

  //   console.log(this.curr.dqm);
  //   renderDqm(this.curr.dqm, roots);
  // }

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
