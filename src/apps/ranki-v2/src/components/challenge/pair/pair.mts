import { renderDqm } from "_/dqm/render-dqm.mts";
import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesFace } from "_components/challenge/pair/face/face.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import {
  RRule,
  type RankiRuleVariants,
} from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";

export type PairChildren = RankiFacesFace | RRule;
type RenderedFaces = Record<string, RankiFacesFace>;

interface InternalState extends RankiChallengeState {
  rendered: RenderedFaces;
}

type ChildState = RankiFacesFace | RankiRuleVariants;

export class RankiFacesPair extends RankiFacesWc<
  RankiChallengeState,
  InternalState
> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation_OLD.slideUpFadeIn(this),
    exit: RankiAnimation_OLD.slideUpFadeOut(this),
  };
  private subtree = new Subtree<PairChildren, ChildState>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  private timeout: number | undefined;

  canReconcile({
    state,
  }: WrappedState<RankiChallengeState>): ReconciliationAction {
    if (!this.subtree.getSize()) {
      return "create";
    }
    const face = state.dqm.inputs.find((v) => v.theater === state.order[0]);
    if (!face) {
      return "remove";
    }

    // TODO this is temporary. it assumes the key is the source
    if (this.subtree.getFirst()!.getKey() === face.dqm) {
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
    return !!this.subtree.getSize();
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

    const curr = this.getCurr();
    const l: any[] = [];
    curr.order.forEach((type) => {
      switch (type) {
        case "ranki:rule":
          l.push({ type, state: "horizontal" });
          break;
        default:
          l.push({ type, state: curr.rendered[type] });
      }
    });

    const firstNew = this.subtree.reconcile(l);
    this.delayedScroll(firstNew, "smooth");
    return this;
  }

  private delayedScroll(
    firstNew: PairChildren | undefined,
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
          window.scrollTo({ top: 0, left: 0, behavior });
          return;
        }
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              firstNew.scrollIntoView({ behavior, block: "center" });
            }
            observer.disconnect();
          },
          {
            root: null,
            threshold: 0,
          },
        );

        observer.observe(firstNew);
        resolve();
      }, LATENCY);
    });
  }

  private renderFaces(rawCurr: RankiChallengeState): RenderedFaces {
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

  private removeSubtreeChild(e: PairChildren) {
    e.remove();
  }

  private createSubtreeChild(s: WrappedState<ChildState>) {
    const container = this.getContainer();
    let elem: PairChildren;
    switch (s.type) {
      case "ranki:rule":
        elem = RRule.create.instance(s.state as RankiRuleVariants, container);
        // container.appendChild(elem);
        return elem;
      default:
        const face = s.state as RankiFacesFace;
        assertNotUndefined(face, {
          why: "Undefined face is required",
          details: { face: s.state },
        });
        container.appendChild(face as RankiFacesFace);

        return face;
    }
  }
}
