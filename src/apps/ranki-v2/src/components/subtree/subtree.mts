import { assertNever, assertNotNull } from "_error/assertions.mjs";
import type {
  RankiWc,
  ReconciliationAction,
} from "_components/ranki-wc/ranki-wc.mjs";

export type WrappedState<State> = { type: string; state: State };

export interface ReconciliationInfo<State> {
  index: number;
  subtree: WrappedState<State>[];
}

interface ElemMin<State> extends RankiWc<State> {
  canReconcile(s: WrappedState<State>): ReconciliationAction;
  remove(): Promise<void>;
  setProps(p: State): void;
  hasNext?: (b: boolean) => void;
}

interface SubtreeHooks<ElemType, State> {
  create(state: WrappedState<State>, info: ReconciliationInfo<State>): ElemType;
  remove(elem: ElemType): void;
}

type CreateChildFn<ElemType, State> = (
  p: WrappedState<State>,
  info: ReconciliationInfo<State>,
) => ElemType;
type RemoveChildFn<ElemType> = (e: ElemType) => void;

type SubtreeType<ElemType, State> = {
  element: ElemType;
  state: WrappedState<State>;
};

type SubtreeList<ElemType, State> = SubtreeType<ElemType, State>[];

type WorkingList<ElemType, State> = (SubtreeType<ElemType, State> | null)[];

export class Subtree<ElemType extends ElemMin<State>, State> {
  private subtree: SubtreeList<ElemType, State> = [];
  private create!: CreateChildFn<ElemType, State>;
  private remove!: RemoveChildFn<ElemType>;

  constructor(h: SubtreeHooks<ElemType, State>) {
    this.create = h.create;
    this.remove = h.remove;
  }

  getLast(): ElemType | undefined {
    return this.subtree.at(-1)?.element;
  }
  getFirst(): ElemType | undefined {
    return this.subtree[0]?.element;
  }

  getAll() {
    return this.subtree.map((e) => e.element);
  }

  getSize() {
    return this.subtree.length;
  }

  reconcile(curr: WrappedState<State>[]): ElemType | undefined {
    let ii = 0; // incoming items index;
    let ci = 0; // active items index;
    let firstNew: number = 0;
    const working = this.subtree as WorkingList<ElemType, State>;
    while (ii < curr.length || ci < this.subtree.length) {
      let action: ReconciliationAction;
      const active = working[ci];
      const state = curr[ii];
      assertNotNull(active, {
        why: "Active element being null means filtering is broken",
      });
      if (!active && state) {
        action = "create";
      } else if (active && !state) {
        action = "remove";
      } else {
        action = active.element.canReconcile(state);
      }

      switch (action) {
        case "advance":
          ci++;
          ii++;
          break;
        case "remove":
          this.remove(active.element);
          working[ci] = null;
          ci++;
          break;
        case "mutate":
          active.element.setProps(state.state);
          ci++;
          ii++;
          break;
        case "create":
          const element = this.create(state, { index: ii, subtree: curr });
          working.push({ element, state });
          firstNew === 0 && (firstNew = ci);
          ci++;
          ii++;
          break;
        default:
          assertNever({ why: "Unrecognized action", details: { action } });
      }
    }
    this.subtree = working.filter((v) => v !== null);
    this.callHasNext();
    return this.subtree[firstNew]?.element;
  }

  private callHasNext() {
    const hasNext: boolean[] = [];
    let seenActive = false;

    for (let i = this.subtree.length - 1; i >= 0; i--) {
      hasNext[i] = seenActive;
      if (this.subtree[i].element.isActive()) {
        seenActive = true;
      }
    }

    this.subtree.forEach(({ element }, i) => {
      const h = element.isActive() && hasNext[i];
      element.hasNext && element.hasNext(h);
    });
  }
}
