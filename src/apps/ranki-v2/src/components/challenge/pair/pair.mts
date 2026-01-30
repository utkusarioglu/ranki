import { renderDqm } from "_/dqm/render-dqm.mts";
import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesFace } from "_components/challenge/pair/face/face.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { RankiRule } from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mjs";
import { assertNotNull, assertNotUndefined } from "_error/assertions.mjs";

export type PairChildren = RankiFacesFace | RankiRule;
type RenderedFaces = Record<string, RankiFacesFace>;

export class RankiFacesPair extends RankiFacesWc<RankiChallengeState> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.slideUpFadeIn(this),
    exit: RankiAnimation.slideUpFadeOut(this),
  };
  private items: PairChildren[] = [];

  canReconcile(props: RankiChallengeState): boolean {
    if (!this.items.length) {
      return true;
    }
    const a = props.dqm.inputs.find((v) => v.theater === props.order[0]);
    if (!a) {
      return false;
    }

    // TODO this is temporary. it assumes the key is the source
    if (this.items[0].getKey() === a.dqm) {
      return true;
    } else {
      return false;
    }
  }

  getContainer(): HTMLDivElement {
    return this.querySelector("ranki-faces-pair > .container")!;
  }

  build() {
    let div = this.querySelector(
      "ranki-faces-pair > .container",
    ) as HTMLDivElement;
    if (div) {
      return div;
    }
    div = document.createElement("div") as HTMLDivElement;
    div.classList.add("container");
    this.appendChild(div);
  }

  render() {
    this.build();
    const newFaces = this.renderDqm();
    const firstNew = this.populatePair(newFaces);
    if (firstNew) {
      const elem = this.items[firstNew];
      elem.scrollIntoView({
        behavior: "smooth",
      });
    }
    return this;
  }

  private renderDqm(): RenderedFaces {
    const curr = this.getCurr();
    const faceEntries: [string, RankiFacesFace][] = [];
    const theaterEntries: [string, () => HTMLDivElement][] = [];
    curr.dqm.inputs.forEach((n) => {
      const face = RankiFacesFace.create<{}, RankiFacesFace>({});
      face.setKey(n.dqm);
      faceEntries.push([n.theater, face as RankiFacesFace]);
      theaterEntries.push([n.theater, () => face as unknown as HTMLDivElement]);
    });
    renderDqm(this.getCurr().dqm, {
      theaters: Object.fromEntries(theaterEntries),
    });
    return Object.fromEntries(faceEntries);
  }

  private populatePair(newTheaters: RenderedFaces) {
    const curr = this.getCurr();
    const container = this.getContainer();
    let oi = 0;
    let ii = 0;
    const workingItems: (PairChildren | null)[] = this.items;
    let firstNew: number | null = null;

    while (oi < curr.order.length || ii < workingItems.length) {
      const order = curr.order[oi];
      const incumbent = workingItems[ii];
      assertNotNull(incumbent, {
        why: "Null means this.items is not filtered",
      });
      if (!incumbent && order) {
        let elem: PairChildren;
        switch (order) {
          case "ranki:rule":
            elem = RankiRule.createAndAttach<number, RankiRule>(
              oi,
              container,
            ).setVariant("horizontal");
            // container.appendChild(elem);
            // this.items.push(elem);
            break;
          default:
            elem = newTheaters[order];
            assertNotUndefined(elem, {
              why: "Undefined face is required",
              details: { order, curr },
            });
            if (firstNew === null) firstNew = ii;
        }
        container.appendChild(elem);
        this.items.push(elem);
        oi++;
        ii++;
      } else if (incumbent && !order) {
        incumbent.remove();
        workingItems[ii] = null;
        ii++;
      } else {
        switch (order) {
          case "ranki:rule":
            const ruleKey = `${order}:${oi}`;
            if (incumbent.getKey() === ruleKey) {
              oi++;
              ii++;
            } else {
              incumbent.remove();
              workingItems[ii] = null;
              ii++;
            }
            break;
          default:
            const f = newTheaters[order];
            assertNotUndefined(f, {
              why: "Undefined face is required",
              details: { order, curr },
            });
            const faceKey = f.getKey();
            if (incumbent.getKey() === faceKey) {
              oi++;
              ii++;
            } else {
              incumbent.remove();
              workingItems[ii] = null;
              ii++;
            }
        }
      }
    }
    this.items = workingItems.filter((v) => v !== null);
    return firstNew;
  }
}
