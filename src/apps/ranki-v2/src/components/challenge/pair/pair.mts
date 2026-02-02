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
import type { WrappedState } from "_components/subtree/subtree.mjs";

export type PairChildren = RankiFacesFace | RankiRule;
type RenderedFaces = Record<string, RankiFacesFace>;

interface InternalState extends RankiChallengeState {
  rendered: RenderedFaces;
}

export class RankiFacesPair extends RankiFacesWc<
  RankiChallengeState,
  InternalState
> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.slideUpFadeIn(this),
    exit: RankiAnimation.slideUpFadeOut(this),
  };
  private active: PairChildren[] = [];
  private timeout: number | undefined;

  canReconcile({
    state,
  }: WrappedState<RankiChallengeState>): ReconciliationAction {
    console.log(state, this.active);
    if (!this.active.length) {
      return "create";
    }
    const face = state.dqm.inputs.find((v) => v.theater === state.order[0]);
    if (!face) {
      return "remove";
    }

    // TODO this is temporary. it assumes the key is the source
    if (this.active[0].getKey() === face.dqm) {
      return "mutate";
    } else {
      return "remove";
    }
  }

  protected override buildInternalState(
    props: RankiChallengeState,
  ): InternalState {
    const rendered = this.renderFaces(props);
    return { ...props, rendered };
  }

  getContainer(): HTMLDivElement {
    return this.querySelector("ranki-faces-pair > .container")!;
  }

  isActive(): boolean {
    return !!this.active.length;
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

    // REMOVE
    const newFaces = this.renderDqm();
    // REMOVE
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

  private renderFaces(rawCurr: RankiChallengeState): RenderedFaces {
    // const curr = this.getCurr();
    console.log("c", rawCurr);
    const faces: [string, RankiFacesFace][] = [];
    const theaters: [string, () => HTMLDivElement][] = [];
    rawCurr.dqm.inputs.forEach((n) => {
      const face = RankiFacesFace.create<{}, RankiFacesFace>({});
      face.setKey(n.dqm);
      faces.push([n.theater, face as RankiFacesFace]);
      theaters.push([n.theater, () => face as unknown as HTMLDivElement]);
    });
    renderDqm(rawCurr.dqm, {
      theaters: Object.fromEntries(theaters),
    });
    return Object.fromEntries(faces);
  }

  // REMOVE
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

  // REMOVE
  private reconcile(newTheaters: RenderedFaces) {
    const curr = this.getCurr();
    const container = this.getContainer();
    const active: (PairChildren | null)[] = this.active;
    let ii = 0; // face index
    let ci = 0; // active index
    let firstNew: number = 0;

    while (ii < curr.order.length || ci < active.length) {
      const faceName = curr.order[ii];
      const incumbent = active[ci];
      assertNotNull(incumbent, {
        why: "Null means this.items is not filtered",
      });
      let action: ReconciliationAction;
      if (!incumbent && faceName) {
        action = "create";
      } else if (incumbent && !faceName) {
        action = "remove";
      } else {
        action = this.canChildReconcile(incumbent, ii, faceName, newTheaters);
      }

      switch (action) {
        case "advance":
          ii++;
          ci++;
          break;
        case "remove":
          incumbent.remove();
          active[ci] = null;
          ci++;
          break;
        case "create":
          const elem = this.createChild(faceName, ii, container, newTheaters);
          container.appendChild(elem);
          this.active.push(elem);
          firstNew === 0 && (firstNew = ci);
          ii++;
          ci++;
          break;
        default:
          assertNever({ why: "Unrecognized action", details: { action } });
      }
    }
    this.active = active.filter((v) => v !== null);
    return firstNew;
  }
  private removeSubtreeChild(e: PairChildren) {
    e.remove();
  }

  private createSubtreeChild(
    s: WrappedState<InternalState>,
    index: number,
    // order: CardFace,
    // oi: number,
    // container: HTMLDivElement,
    // newTheaters: RenderedFaces,
  ) {
    const container = this.getContainer();
    let elem: PairChildren;
    switch (s.type) {
      case "ranki:rule":
        elem = RankiRule.create<number, RankiRule>(
          index,
          // container,
        ).setVariant("horizontal");
        this.appendChild(container);
        return elem;
      default:
        elem = s.state.rendered[s.state.face];
        // elem = newTheaters[order];
        assertNotUndefined(elem, {
          why: "Undefined face is required",
          details: { face: s.state.face },
        });

        return elem;
    }
  }

  // REMOVE
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
        container.appendChild(elem);
        return elem;
    }
  }

  // REMOVE
  private canChildReconcile(
    incumbent: PairChildren,
    oi: number,
    order: CardFace,
    newTheaters: RenderedFaces,
  ) {
    switch (order) {
      case "ranki:rule":
        return (incumbent as RankiRule).canReconcile({
          type: order,
          state: oi,
        });
      default:
        return (incumbent as RankiFacesFace).canReconcile_old({
          type: order,
          state: newTheaters[order],
        });
    }
  }
}
