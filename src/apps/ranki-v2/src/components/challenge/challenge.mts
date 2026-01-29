import styles from "./challenge.component.css?inline";
import { renderDqm } from "../../dqm/render-dqm.mts";
import type { RankiChallengeState } from "../../config/config.types.mts";
import { RankiFacesFace } from "./pair/face/face.mts";
import { assertNotUndefined, assertNotNull } from "../../error/assertions.mts";
import { RankiFacesPair, type PairChildren } from "./pair/pair.mts";
import { RankiFacesWc } from "./faces-wc/faces-wc.mts";
import { RankiRule, ruleStyles } from "./pair/rule/rule.mts";

type RenderedFaces = Record<string, RankiFacesFace>;

export class RankiChallenge extends RankiFacesWc<RankiChallengeState> {
  public static name = "ranki-challenge" as const;
  constructor() {
    super(true);
    this.pushStyles(styles, ruleStyles);
  }

  private build() {
    this.pairs();
  }

  private rule(container: HTMLElement, index: number) {
    const hr = RankiRule.createAndAttach<{}, RankiRule>(
      {},
      container,
    ).setVariant("horizontal");
    hr.setAttribute("data-index", index.toString());
  }

  private renderDqm(): RenderedFaces {
    const curr = this.getCurr();
    const faceEntries: [string, RankiFacesFace][] = [];
    const theaterEntries: [string, () => HTMLDivElement][] = [];
    curr.dqm.inputs.forEach((n) => {
      const face = RankiFacesFace.create<{}, RankiFacesFace>({});
      face.setAttribute("dqm-source", n.dqm);
      faceEntries.push([n.theater, face as RankiFacesFace]);
      theaterEntries.push([n.theater, () => face as unknown as HTMLDivElement]);
    });
    renderDqm(this.getCurr().dqm, {
      theaters: Object.fromEntries(theaterEntries),
    });
    return Object.fromEntries(faceEntries);
  }

  private pairs() {
    const curr = this.getCurr();
    // TODO
    const pairs = Array.from(this.shadowRoot!.children) as RankiFacesPair[];
    const newFaces = this.renderDqm();

    if (!pairs.length) {
      this.populatePair(this.newPair(), newFaces);
      return;
    }

    pairs.slice(0, -1).forEach((v) => v.remove());
    const last = pairs.at(-1)!;
    const matches: boolean[] = [];
    curr.order.forEach((f, i) => {
      const prev = last.getChildren()[i];
      if (!prev) {
        return matches.push(false);
      }
      switch (f) {
        case "ranki:rule":
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
          const newFace = newFaces[prevTheater];
          if (!newFace) {
            matches.push(false);
            return;
          }
          // const newKey = curr.getAttribute("dqm-key");
          const newKey = newFace.getAttribute("dqm-source");
          assertNotUndefined(newKey, { why: "dqm-key attribute is required" });
          matches.push(prevKey === newKey);
      }
    });
    let failIndex = matches.indexOf(false);
    if (failIndex === 0) {
      last.remove();
      // pairs.forEach((p) => p.exit());
      return this.populatePair(this.newPair(), newFaces);
    }

    const ml = matches.length;
    const ch = last.getChildren();
    if (ml < ch.length) {
      for (let i = ml; i < ch.length; i++) {
        (ch[i] as PairChildren).remove();
      }
    } else {
      const fl = curr.order.length;
      this.populatePair(last, newFaces, ml - fl + 1);
    }
  }

  private newPair() {
    return RankiFacesPair.createAndAttach<{}, RankiFacesPair>(
      {},
      this.shadowRoot!,
    );
  }

  private populatePair(
    pair: RankiFacesPair,
    newFaces: RenderedFaces,
    start?: number,
    end?: number,
  ) {
    const curr = this.getCurr();
    const startDefinite = start !== undefined ? start : 0;
    const endDefinite = end !== undefined ? end : curr.order.length;
    const container = pair.getContainer();
    for (let i = startDefinite; i < endDefinite; i++) {
      const f = curr.order[i];
      switch (f) {
        case "ranki:rule":
          this.rule(container, i);
          break;
        default:
          const newFace = newFaces[f];
          container.appendChild(newFace);
      }
    }
  }

  render() {
    this.build();
    return this;
  }
}
