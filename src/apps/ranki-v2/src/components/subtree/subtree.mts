import { assertNever, assertNotNull } from "_error/assertions.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

interface ElemMin<Props> extends Node {
  canReconcile(p: Props): ReconciliationAction;
  remove(): Promise<void>;
  setProps(p: Props): void;
}

interface SubtreeHooks<ElemType, Props> {
  create(p: Props): ElemType;
  remove(e: ElemType): void;
}

type CreateChildFn<ElemType, Props> = (p: Props) => ElemType;
type RemoveChildFn<ElemType> = (e: ElemType) => void;

export class Subtree<ElemType extends ElemMin<Props>, Props> {
  private container!: HTMLElement;
  private subtree: (ElemType | null)[] = [];
  private create!: CreateChildFn<ElemType, Props>;
  private remove!: RemoveChildFn<ElemType>;

  constructor(h: SubtreeHooks<ElemType, Props>) {
    this.create = h.create;
    this.remove = h.remove;
  }

  getLast() {
    return this.subtree.at(-1);
  }

  getSize() {
    return this.subtree.length;
  }

  reconcile(curr: Props[]) {
    const container = this.container;
    assertNotNull(container, {
      why: "Component needs to be built before reconciliation",
    });
    let ii = 0; // incoming items index;
    let ci = 0; // active items index;
    const working = this.subtree;
    while (ii < curr.length || ci < this.subtree.length) {
      let action: ReconciliationAction;
      const active = working[ci];
      const inc = curr[ii];
      assertNotNull(active, {
        why: "Active element being null means filtering is broken",
      });
      if (!active && inc) {
        action = "create";
      } else if (active && !inc) {
        action = "remove";
      } else {
        action = active.canReconcile(inc);
      }

      switch (action) {
        case "advance":
          ci++;
          ii++;
          break;
        case "remove":
          this.remove(active);
          working[ci] = null;
          ci++;
          break;
        case "mutate":
          active.setProps(inc);
          ci++;
          ii++;
          break;
        case "create":
          const elem = this.create(inc);
          working.push(elem);
          ci++;
          ii++;
          break;
        default:
          assertNever({ why: "Unrecognized action", details: { action } });
      }
    }
    this.subtree = working.filter((v) => v !== null);
  }
}
