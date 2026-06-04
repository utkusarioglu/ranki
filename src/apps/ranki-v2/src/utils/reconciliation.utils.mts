import { assertNever } from "_error/assertions.mjs";
import { TimingUtils } from "./timing,utils.mjs";
import type { BeforeLeaveCb } from "_/controllers/reconciler/reconciler.mjs";

export type ReconciliationActions = "retain" | "update" | "remove" | "add";

export type ReconciliationDiff = {
  add: number[];
  remove: number[];
  update: number[];
  retain: number[];
  stagger: {
    first: number;
    indices: number[];
  };
  // mutateOrder: number[];
  // mutateIndex: number;
};

export type ReconcileSingle<G> = (curr: G, prev: G) => ReconciliationActions;

export interface ReconcileableSubtree<T> {
  list: ReconciliationContainer<T>[];
  diff: ReconciliationDiff;
  epoch: number;
}

export interface ReconcileableType {
  leave: boolean;
}

export interface ReconciliationContainer<T extends any> {
  props: T;
  id: number;
  leave: boolean;
}

export class ReconciliationUtils {
  private static idCounter = 0;
  private static leaving: number[] = [];
  private static willLeave = false;

  public static empty<G>(): ReconcileableSubtree<G> {
    return {
      list: [],
      epoch: 0,
      diff: ReconciliationUtils.noChanges(),
    };
  }

  public static noChanges(): ReconciliationDiff {
    return {
      add: [],
      remove: [],
      retain: [],
      update: [],
      stagger: {
        first: 0,
        indices: [0],
      },
    };
  }

  /**
   * @dev
   * #1 Why do we need this? Sometimes an update due to a late loading icon and
   * alike may cause a reconcilliation that throws off the mutation index. in
   * those cases, using the previous index so far shows to be the best option to
   * maintain functionality. It's possible that this is a hack. not maybe due
   * to the reconcilliation mechanism but due to the how updates are being
   * handled.
   */
  public static flat<G>(
    prev: ReconcileableSubtree<G>,
    curr: G[],
    hasChanged: ReconcileSingle<G>,
  ): ReconcileableSubtree<G> {
    const curLen = curr.length;
    const prevLen = prev.list.length;
    const update: number[] = [];
    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];
    const list: ReconciliationContainer<G>[] = [];
    const end = Math.max(curLen, prevLen);

    for (let i = 0; i < end; i++) {
      const isCurr = curr[i] !== undefined;
      const isPrev = prev.list[i] !== undefined;
      let action: ReconciliationActions;
      if (isCurr && isPrev) {
        action = hasChanged(curr[i], prev.list[i].props);
      } else if (isCurr && !isPrev) {
        action = "add";
      } else if (!isCurr && isPrev) {
        action = "remove";
      } else {
        assertNever({
          why: "Impossible reconciliation state",
          details: {
            curr,
            prev,
            isCurr,
            isPrev,
          },
        });
      }

      switch (action) {
        case "add":
          add.push(i);
          list.push({
            props: curr[i],
            id: this.getId(),
            leave: false,
          });
          break;
        case "remove":
          remove.push(i);
          list.push({ ...prev.list[i], leave: true });
          break;
        case "retain":
          retain.push(i);
          list.push(prev.list[i]);
          break;
        case "update":
          update.push(i);
          list.push({
            props: curr[i],
            id: this.getId(),
            leave: false,
          });
          break;
        default:
          assertNever({
            why: "unrecognized change option",
            details: { action },
          });
      }
    }

    // #1
    let mutateIndices = [remove[0], add[0]].filter((v) => v !== undefined);
    mutateIndices = !mutateIndices.length
      ? [prev.diff.stagger.first]
      : mutateIndices;
    const mutateIndex = Math.min(...mutateIndices);

    let indices = Array.from(
      { length: Math.max(curLen, prevLen) },
      () => Number.NaN,
    );
    if (curLen > prevLen) {
      for (let i = mutateIndex; i < curLen; i++) {
        indices[i] = i - mutateIndex;
      }
    } else if (curLen < prevLen) {
      for (let i = prevLen - 1; i >= mutateIndex; i--) {
        indices[i] = prevLen - i - 1;
      }
    } else {
      indices = prev.diff.stagger.indices;
    }

    // if (beforeLeave) {
    //   indices
    //     .filter((v) => v > 0)
    //     .forEach((i) => {
    //       beforeLeave(i);
    //     });
    // }

    return {
      list,
      epoch: Date.now(),
      diff: {
        add,
        remove,
        retain,
        update,
        stagger: {
          first: mutateIndex,
          indices,
        },
      },
    };
  }

  public static single<G>(
    prev: ReconcileableSubtree<G>,
    curr: G[],
    hasChanged: ReconcileSingle<G>,
  ): ReconcileableSubtree<G> {
    if (curr.length > 1) {
      assertNever({ why: "`single` reconciler expects a single update" });
    }
    const curLen = curr.length;
    const prevLen = prev.list.length;
    const list: ReconciliationContainer<G>[] = [];
    const end = Math.max(curLen, prevLen);

    const update: number[] = [];
    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];
    for (let i = 0; i < end; i++) {
      const isCurr = curr[i] !== undefined;
      const isPrev = prev.list[i] !== undefined;
      let action: ReconciliationActions;
      if (i === 0) {
        if (isCurr && isPrev) {
          action = hasChanged(curr[i], prev.list[i].props);
        } else if (isCurr && !isPrev) {
          action = "add";
        } else if (!isCurr && isPrev) {
          action = "remove";
        } else {
          assertNever({
            why: "Impossible reconciliation state",
            details: {
              curr,
              prev,
              isCurr,
              isPrev,
            },
          });
        }
      } else {
        action = "remove";
      }
      // if (isCurr && isPrev) {
      //   action = hasChanged(curr[i], prev.list[i].props);
      // } else if (isCurr && !isPrev) {
      //   action = "add";
      // } else if (!isCurr && isPrev) {
      //   action = "remove";
      // } else {
      //   assertNever({
      //     why: "Impossible reconciliation state",
      //     details: {
      //       curr,
      //       prev,
      //       isCurr,
      //       isPrev,
      //     },
      //   });
      // }

      switch (action) {
        case "add":
          add.push(i);
          list.push({
            props: curr[i],
            id: this.getId(),
            leave: false,
          });
          break;
        case "remove":
          remove.push(i);
          list.push({ ...prev.list[i], leave: true });
          break;
        case "retain":
          retain.push(i);
          list.push({ ...prev.list[i], leave: true });
          break;
        // case "update":
        //   update.push(i);
        //   list.push({
        //     props: curr[i],
        //     id: this.getId(),
        //     leave: false,
        //   });
        //   break;
        default:
          assertNever({
            why: "unrecognized change option",
            details: { action },
          });
      }
    }

    // if (last && last.text === this.text) return;
    // const updated = prev.list.map((p) => ({ ...p, leave: true }));
    // const lis2 = [
    //   ...updated,
    //   {
    //     id: this.idCounter++,
    //     props: { ...curr },
    //     leave: false,
    //   },
    // ];

    const indices = Array.from({ length: list.length }, (_) => 1);
    // if (beforeLeave) {
    //   indices.forEach((st, i) => {
    //     if (st > 0) {
    //       beforeLeave(st, i);
    //     }
    //   });
    // }

    return {
      list,
      epoch: Date.now(),
      diff: {
        add,
        remove,
        retain,
        update,
        stagger: {
          first: 0,
          indices,
        },
      },
    };
  }

  private static getId() {
    return this.idCounter++;
  }

  static leaveEventName = "r2-child-leave";

  static leaveEvent() {
    return new CustomEvent(this.leaveEventName, {
      bubbles: true,
      composed: true,
    });
  }

  public static async leave<G>(
    subtree: ReconcileableSubtree<G>,
    id: number,
    updateCb: (subtree: ReconcileableSubtree<G>) => void,
  ): Promise<void> {
    this.leaving.push(id);
    if (!this.willLeave) {
      this.willLeave = true;
      await TimingUtils.waitLayout();
      if (!this.leaving.length) {
        return;
      }
      const remove = [...this.leaving];
      const list = subtree.list.filter((i) => !remove.includes(i.id));
      this.leaving = [];
      this.willLeave = false;
      const retain = Array.from(
        { length: subtree.list.length - remove.length },
        (_, i) => i,
      );

      updateCb({
        list,
        diff: {
          add: [],
          remove,
          retain,
          update: [],
          stagger: {
            first: id,
            indices: subtree.diff.stagger.indices,
          },
        },
        epoch: Date.now(),
      });
    }
  }
}
