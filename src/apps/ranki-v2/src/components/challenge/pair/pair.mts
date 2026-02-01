import { renderDqm } from "_/dqm/render-dqm.mts";
import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesFace } from "_components/challenge/pair/face/face.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { RankiRule } from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mjs";
import {
  assertNever,
  assertNotNull,
  assertNotUndefined,
} from "_error/assertions.mjs";
import type { CardFace } from "_config/collect/collect.types.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

export type PairChildren = RankiFacesFace | RankiRule;
type RenderedFaces = Record<string, RankiFacesFace>;

export class RankiFacesPair extends RankiFacesWc<RankiChallengeState> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.slideUpFadeIn(this),
    exit: RankiAnimation.slideUpFadeOut(this),
  };
  private active: PairChildren[] = [];
  private timeout: number | undefined;

  canReconcile(props: RankiChallengeState): boolean {
    if (!this.active.length) {
      return true;
    }
    const face = props.dqm.inputs.find((v) => v.theater === props.order[0]);
    if (!face) {
      return false;
    }

    // TODO this is temporary. it assumes the key is the source
    if (this.active[0].getKey() === face.dqm) {
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
    const firstNew = this.reconcile(newFaces);
    this.delayedScroll(firstNew, "smooth");
    return this;
  }

  private delayedScroll(
    firstNew: number,
    behavior: ScrollBehavior,
  ): Promise<void> {
    const LATENCY = 500;
    const EVENTS = ["scroll", "wheel", "touchstart", "keydown"];
    return new Promise((resolve) => {
      const cancel = () => {
        clearTimeout(this.timeout);
        resolve();
      };
      EVENTS.forEach((e) => {
        window.addEventListener(e, cancel, { once: true, passive: true });
      });
      if (this.timeout) {
        cancel();
      }
      this.timeout = setTimeout(() => {
        EVENTS.forEach((e) => {
          window.removeEventListener(e, cancel);
        });
        if (!firstNew) {
          window.scrollTo({ top: 0, behavior });
          return;
        }
        const elem = this.active[firstNew];
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              elem.scrollIntoView({ behavior, block: "center" });
            }
            observer.disconnect();
          },
          {
            root: null,
            threshold: 0,
          },
        );

        observer.observe(elem);
        resolve();
      }, LATENCY);
    });
  }

  private renderDqm(): RenderedFaces {
    const curr = this.getCurr();
    const faces: [string, RankiFacesFace][] = [];
    const theaters: [string, () => HTMLDivElement][] = [];
    curr.dqm.inputs.forEach((n) => {
      const face = RankiFacesFace.create<{}, RankiFacesFace>({});
      face.setKey(n.dqm);
      faces.push([n.theater, face as RankiFacesFace]);
      theaters.push([n.theater, () => face as unknown as HTMLDivElement]);
    });
    renderDqm(this.getCurr().dqm, {
      theaters: Object.fromEntries(theaters),
    });
    return Object.fromEntries(faces);
  }

  private reconcile(newTheaters: RenderedFaces) {
    const curr = this.getCurr();
    const container = this.getContainer();
    const active: (PairChildren | null)[] = this.active;
    let fi = 0; // face index
    let ai = 0; // active index
    let firstNew: number = 0;

    while (fi < curr.order.length || ai < active.length) {
      const faceName = curr.order[fi];
      const incumbent = active[ai];
      assertNotNull(incumbent, {
        why: "Null means this.items is not filtered",
      });
      let action: ReconciliationAction;
      if (!incumbent && faceName) {
        action = "create";
      } else if (incumbent && !faceName) {
        action = "remove";
      } else {
        action = this.canChildReconcile(incumbent, fi, faceName, newTheaters);
        // const isValid = this.canChildReconcile(incumbent, fi, faceName, newTheaters);
        // if (isValid) {
        //   action = "advance";
        // } else {
        //   action = "remove";
        // }
      }

      switch (action) {
        case "advance":
          fi++;
          ai++;
          break;
        case "remove":
          incumbent.remove();
          active[ai] = null;
          ai++;
          break;
        case "create":
          const elem = this.createChild(faceName, fi, container, newTheaters);
          container.appendChild(elem);
          this.active.push(elem);
          firstNew === 0 && (firstNew = ai);
          fi++;
          ai++;
          break;
        default:
          assertNever({ why: "Unrecognized action", details: { action } });
      }
    }
    this.active = active.filter((v) => v !== null);
    return firstNew;
  }

  private createChild(
    order: CardFace,
    oi: number,
    container: HTMLDivElement,
    newTheaters: RenderedFaces,
  ) {
    let elem: PairChildren;
    switch (order) {
      case "ranki:rule":
        elem = RankiRule.createAndAttach<number, RankiRule>(
          oi,
          container,
        ).setVariant("horizontal");
        return elem;
      default:
        elem = newTheaters[order];
        assertNotUndefined(elem, {
          why: "Undefined face is required",
          details: { order },
        });
        return elem;
    }
  }

  private canChildReconcile(
    incumbent: PairChildren,
    oi: number,
    order: CardFace,
    newTheaters: RenderedFaces,
  ) {
    switch (order) {
      case "ranki:rule":
        return (incumbent as RankiRule).canReconcile(oi);
      default:
        return (incumbent as RankiFacesFace).canReconcile(newTheaters[order]);
    }
  }
}
