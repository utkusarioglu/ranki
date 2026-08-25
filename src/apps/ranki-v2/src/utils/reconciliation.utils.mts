import type { LitElement } from "lit";

import { assertNever } from "_error/assertions.mjs";

export type R2ReconcilerEmit = {
  type: "leave";
};

export interface ReconcileableSubtree<T> {
  diff: ReconciliationDiff;
  epoch: number;
  list: ReconciliationContainer<T>[];
}

export interface ReconcileableType {
  leave: boolean;
}

export type ReconcileSingle<G> = (curr: G, prev: G) => ReconciliationActions;

export type ReconciliationActions = "add" | "remove" | "retain" | "update";

export interface ReconciliationContainer<T> {
  id: number;
  leave: boolean;
  props: T;
}

export type ReconciliationDiff = {
  add: number[];
  remove: number[];
  retain: number[];
  stagger: {
    first: number;
    indices: number[];
  };
  update: number[];
};

export class ReconciliationUtils {
  static leaveEventName = "r2-reconciler";
  private static idCounter = 0;

  public static emitLeave(el: LitElement) {
    el.dispatchEvent(ReconciliationUtils.leaveEvent());
  }

  public static empty<G>(): ReconcileableSubtree<G> {
    return {
      diff: ReconciliationUtils.noChanges(),
      epoch: 0,
      list: [],
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
          details: {
            curr,
            isCurr,
            isPrev,
            prev,
          },
          why: "Impossible reconciliation state",
        });
      }

      switch (action) {
        case "add":
          add.push(i);
          list.push({
            id: this.getId(),
            leave: false,
            props: curr[i],
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
            id: this.getId(),
            leave: false,
            props: curr[i],
          });
          break;
        default:
          assertNever({
            details: { action },
            why: "unrecognized change option",
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

    return {
      diff: {
        add,
        remove,
        retain,
        stagger: {
          first: mutateIndex,
          indices,
        },
        update,
      },
      epoch: Date.now(),
      list,
    };
  }

  public static last<G>(
    prev: ReconcileableSubtree<G>,
    curr: G[],
    hasChanged: ReconcileSingle<G>,
  ): ReconcileableSubtree<G> {
    const list: ReconciliationContainer<G>[] = [...prev.list];

    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];

    const currLast = curr.at(-1);
    const prevLast = list.at(-1)?.props;
    const isCurr = currLast !== undefined;
    const isPrev = prevLast !== undefined;

    let action: ReconciliationActions;
    if (isCurr && isPrev) {
      action = hasChanged(currLast, prevLast);
    } else if (isCurr && !isPrev) {
      action = "add";
    } else if (!isCurr && isPrev) {
      action = "remove";
    } else {
      assertNever({
        details: {
          curr,
          isCurr,
          isPrev,
          prev,
        },
        why: "Impossible reconciliation state",
      });
    }

    const i = list.length;
    switch (action) {
      case "add":
        add.push(i);
        list.push({
          id: this.getId(),
          leave: false,
          props: currLast!,
        });
        break;
      case "retain":
        retain.push(i);
        break;
      default:
        assertNever({
          details: { action },
          why: "unrecognized change option",
        });
    }

    if (list.length > 1) {
      for (let i = 0; i < list.length - 1; i++) {
        list[i].leave = true;
      }
    }

    const indices = Array.from({ length: list.length }, (_) => 0);

    return {
      diff: {
        add,
        remove,
        retain,
        stagger: {
          first: 0,
          indices,
        },
        update: [],
      },
      epoch: Date.now(),
      list,
    };
  }

  public static noChanges(length: number = 0): ReconciliationDiff {
    return {
      add: [],
      remove: [],
      retain: [],
      stagger: {
        first: 0,
        indices: Array.from({ length }, (_) => 0),
      },
      update: [],
    };
  }

  private static getId() {
    return this.idCounter++;
  }

  private static leaveEvent() {
    const detail = {
      type: "leave" as const,
    };
    return new CustomEvent<R2ReconcilerEmit>(this.leaveEventName, {
      bubbles: true,
      composed: true,
      detail,
    });
  }
}
