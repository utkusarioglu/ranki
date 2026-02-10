import { renderDqm } from "_/dqm/render-dqm.mts";
import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RPairDqm } from "_components/challenge/pair/face/face.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import {
  RPairRule,
  type RankiRuleVariants,
} from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";
import { Wc } from "_components/wc/wc.mjs";
import { WcSub } from "_components/wc/sub.mjs";

export type PairChildren = RPairDqm | RPairRule;
type RenderedFaces = Record<string, RPairDqm>;

interface InternalState extends RankiChallengeState {
  rendered: RenderedFaces;
}

type ChildState = RPairDqm | RankiRuleVariants;

export class RPair extends Wc<RankiChallengeState, InternalState> {
  public static readonly tag = "r-pair" as const;
  // protected animations: AnimationTypes = {
  //   enter: RankiAnimation_OLD.slideUpFadeIn(this),
  //   exit: RankiAnimation_OLD.slideUpFadeOut(this),
  // };
  // @ts-expect-error
  private subtree = new WcSub<PairChildren, ChildState>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  private timeout: number | undefined;

  setProps(s: RankiChallengeState) {
    this.state.set(s);
  }

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
    }
    return "remove";
  }

  initialize(): void {
    this.state.setTransformer((props) => {
      const rendered = this.renderFaces(props);
      return { ...props, rendered };
    });

    this.elements.create("container", {
      tag: "div",
      classes: ["container"],
    });

    this.animation
      .pushPreset("enter", () => ({
        keyframes: [
          {
            opacity: 0,
            transform: "translateY(50px)",
          },
          {
            opacity: 1,
            transform: "translateY(0)",
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [
          {
            opacity: 1,
            transform: "translateY(0)",
          },
          {
            opacity: 0,
            transform: "translateY(-50px)",
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }));
  }

  // protected override buildInternalState(
  //   props: RankiChallengeState,
  // ): InternalState {
  // }

  // getContainer(): HTMLDivElement {
  //   return this.querySelector("ranki-faces-pair > .container")!;
  // }

  isActive(): boolean {
    return !!this.subtree.getSize();
  }

  // build() {
  //   let div = this.querySelector(
  //     "ranki-faces-pair > .container",
  //   ) as HTMLDivElement;
  //   if (div) {
  //     return div;
  //   }
  //   div = document.createElement("div") as HTMLDivElement;
  //   div.classList.add("container");
  //   this.appendChild(div);
  // }

  protected onStateChange(curr: InternalState): void {
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
  }

  // render() {
  //   this.build();

  //   const curr = this.getCurr();
  //   const l: any[] = [];
  //   curr.order.forEach((type) => {
  //     switch (type) {
  //       case "ranki:rule":
  //         l.push({ type, state: "horizontal" });
  //         break;
  //       default:
  //         l.push({ type, state: curr.rendered[type] });
  //     }
  //   });

  //   const firstNew = this.subtree.reconcile(l);
  //   this.delayedScroll(firstNew, "smooth");
  //   return this;
  // }

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
    const faces: [string, RPairDqm][] = [];
    const theaters: [string, () => HTMLDivElement][] = [];
    rawCurr.dqm.inputs.forEach((n) => {
      const face = RPairDqm.create.instance(null);
      face.setKey(n.dqm);
      faces.push([n.theater, face as RPairDqm]);
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
    const container = this.elements.get<HTMLDivElement>("container")!;
    let elem: PairChildren;
    switch (s.type) {
      case "ranki:rule":
        elem = RPairRule.create.instance(
          s.state as RankiRuleVariants,
          container,
        );
        break;
      default:
        elem = s.state as RPairDqm;
        assertNotUndefined(elem, {
          why: "Undefined face is required",
          details: { face: s.state },
        });
        container.appendChild(elem as RPairDqm);
    }
    elem.animation.runPreset("show");
    return elem;
  }
}
