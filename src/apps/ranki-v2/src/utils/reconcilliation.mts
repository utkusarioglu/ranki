import { assertNever } from "_error/assertions.mjs";

export type ReconciliationActions = "retain" | "update" | "remove" | "add";

export type ReconciliationChanges = {
  add: number[];
  remove: number[];
  update: number[];
  retain: number[];
  mutateIndex: number;
};

export interface ReconcileableSubtree<T> {
  list: ReconciliationContainer<T>[];
  changes: ReconciliationChanges;
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
  public static empty<G>(): ReconcileableSubtree<G> {
    return {
      list: [],
      epoch: 0,
      changes: {
        add: [],
        remove: [],
        retain: [],
        update: [],
        mutateIndex: 0,
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
    getId: () => number,
    hasChanged: (curr: G, prev: G | undefined) => ReconciliationActions,
  ): ReconcileableSubtree<G> {
    const update: number[] = [];
    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];
    const list: ReconciliationContainer<G>[] = [];
    const end = Math.max(curr.length, prev.list.length);

    for (let i = 0; i < end; i++) {
      const change = hasChanged(
        curr[i],
        prev.list[i] ? prev.list[i].props : undefined,
      );
      switch (change) {
        case "add":
          add.push(i);
          list.push({
            props: curr[i],
            // ...curr[i],
            id: getId(),
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
            id: getId(),
            leave: false,
          });
          break;
        default:
          assertNever({
            why: "unrecognized change option",
            details: { change },
          });
      }
    }

    // #1
    let mutateIndices = [remove[0], add[0]].filter((v) => v !== undefined);
    mutateIndices = !mutateIndices.length
      ? [prev.changes.mutateIndex]
      : mutateIndices;
    const mutateIndex = Math.min(...mutateIndices);

    return {
      list,
      epoch: Date.now(),
      changes: {
        add,
        remove,
        retain,
        update,
        mutateIndex,
      },
    };
  }

  public static leave<G>(
    subtree: ReconcileableSubtree<G>,
    index: number,
  ): ReconcileableSubtree<G> {
    const list = [...subtree.list];
    list.splice(index, 1);
    return {
      list,
      changes: {
        add: [],
        remove: [index],
        retain: Array.from({ length: subtree.list.length }, (_, i) => i).filter(
          (i) => i !== index,
        ),
        update: [],
        mutateIndex: index,
      },
      epoch: Date.now(),
    };
  }
}
