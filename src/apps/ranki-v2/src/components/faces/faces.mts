import type { CardFaceArray } from "../../config/collect/collect.types.mts";
import styles from "./faces.component.css?inline";
import { renderDqm } from "../../dqm/render-dqm.mts";
import type { RankiDqmConfig } from "../../config/config.types.mts";
import { hrSheet, RuleHorizontal } from "./rules/hr.mts";
import { RuleVertical, vrSheet } from "./rules/vr.mts";
import type { RankiFacesFace } from "./face/face.mts";
import { assertNotUndefined, assertNotNull } from "../../error/assertions.mts";
import type { PairChildren, RankiFacesPair } from "./pair/pair.mts";

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

  private build() {
    this.pairs();
  }

  private hr(container: HTMLElement, index: number) {
    const hr = document.createElement("rule-horizontal");
    hr.setAttribute("data-index", index.toString());
    (hr as RuleHorizontal).render();
    container.appendChild(hr);
  }

  private vr(container: HTMLElement, index: number) {
    const vr = document.createElement("rule-vertical");
    vr.setAttribute("data-index", index.toString());
    (vr as RuleVertical).render();
    container.appendChild(vr);
  }

  private renderDqm(): RenderedFaces {
    const faceEntries: [string, RankiFacesFace][] = [];
    const theaterEntries: [string, () => HTMLDivElement][] = [];
    this.curr.dqm.inputs.forEach((n) => {
      const face = document.createElement("ranki-faces-face");
      face.setAttribute("dqm-source", n.dqm);
      faceEntries.push([n.theater, face as RankiFacesFace]);
      theaterEntries.push([n.theater, () => face as HTMLDivElement]);
    });
    renderDqm(this.curr.dqm, { theaters: Object.fromEntries(theaterEntries) });
    return Object.fromEntries(faceEntries);
  }

  private pairs() {
    // TODO
    const pairs = Array.from(this.shadowRoot!.children) as RankiFacesPair[];
    const newFaces = this.renderDqm();

    if (!pairs.length) {
      this.populatePair(this.newPair(), newFaces);
      return;
    }

    pairs.slice(0, -1).forEach((v) => v.exit());
    const last = pairs.at(-1)!;
    const matches: boolean[] = [];
    this.curr.faces.forEach((f, i) => {
      const prev = last.getChildren()[i];
      if (!prev) {
        return matches.push(false);
      }
      switch (f) {
        case "ranki:hr":
        case "ranki:vr":
          matches.push(false);
          break;
        default:
          // const prevKey = prev.getAttribute("dqm-key");
          const prevKey = prev.getAttribute("dqm-source");
          assertNotUndefined(prevKey, { why: "dqm-key attribute is required" });
          const prevTheater = prev.getAttribute("dqm-theater")!;
          assertNotNull(prevTheater, {
            why: "dqm-theater attribute is required",
            details: {
              prevTheater,
            },
          });
          const curr = newFaces[prevTheater];
          // const newKey = curr.getAttribute("dqm-key");
          const newKey = curr.getAttribute("dqm-source");
          assertNotUndefined(newKey, { why: "dqm-key attribute is required" });
          matches.push(prevKey === newKey);
      }
    });
    let failIndex = matches.indexOf(false);
    if (failIndex === 0) {
      last.exit();
      // pairs.forEach((p) => p.exit());
      return this.populatePair(this.newPair(), newFaces);
    }

    const ml = matches.length;
    const ch = last.getChildren();
    if (ml < ch.length) {
      for (let i = ml; i < ch.length; i++) {
        (ch[i] as PairChildren).exit();
      }
    } else {
      const fl = this.curr.faces.length;
      this.populatePair(last, newFaces, ml - fl + 1);
    }
  }

  private newPair() {
    const pair = document.createElement("ranki-faces-pair") as RankiFacesPair;
    this.shadowRoot!.appendChild(pair);
    const div = document.createElement("div") as HTMLDivElement;
    div.classList.add("container");
    pair.appendChild(div);
    return pair;
  }

  private populatePair(
    pair: RankiFacesPair,
    newFaces: RenderedFaces,
    start?: number,
    end?: number,
  ) {
    const startDefinite = start !== undefined ? start : 0;
    const endDefinite = end !== undefined ? end : this.curr.faces.length;
    const container = pair.getContainer();
    for (let i = startDefinite; i < endDefinite; i++) {
      const f = this.curr.faces[i];
      switch (f) {
        case "ranki:hr":
          this.hr(container, i);
          break;
        case "ranki:vr":
          this.vr(container, i);
          break;
        default:
          const newFace = newFaces[f];
          container.appendChild(newFace);
      }
    }
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
