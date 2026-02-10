import { renderDqm } from "_/dqm/render-dqm.mts";
import { RPairDqm } from "_components/challenge/pair/face/face.mts";
import {
  RPairRule,
  type RankiRuleVariants,
} from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { WcSub, type WrappedState } from "_components/wc/sub.mjs";
import { Scroll } from "_utils/scroll.mjs";

export type PairChildren = RPairDqm | RPairRule;
type RenderedFaces = Record<string, RPairDqm>;
const LATENCY = 500;
const DUR = 4e2;

interface InternalState extends RankiChallengeState {
  rendered: RenderedFaces;
}

type ChildState = RPairDqm | RankiRuleVariants;

export class RPair extends Wc<RankiChallengeState, InternalState> {
  public static readonly tag = "r-pair" as const;
  // @ts-expect-error
  private subtree = new WcSub<PairChildren, ChildState>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

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
      .pushPreset("enter", () => {
        const SCROLL_HIDDEN = "scroll-hidden";
        const els = [document.body, document.querySelector("html")!];
        els.forEach((e) => e.classList.add(SCROLL_HIDDEN));
        setTimeout(() => {
          els.forEach((e) => e.classList.remove(SCROLL_HIDDEN));
        }, DUR + 0.1);
        return {
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
            duration: DUR,
            fill: "both",
          },
        };
      })
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
          duration: DUR,
          fill: "both",
        },
      }));
  }

  isActive(): boolean {
    return !!this.subtree.getSize();
  }

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
    Scroll.delayed(firstNew, "smooth", LATENCY);
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
