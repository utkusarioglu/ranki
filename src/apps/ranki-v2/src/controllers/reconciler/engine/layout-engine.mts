import { assertNever, assertTrue } from "_error/assertions.mjs";

import type {
  HasChangedCallback2,
  ReconcileSingle,
  ReconciliationAction,
  ReconciliationActionRec,
} from "../events/reconciliation-events.types.mjs";
import type {
  ReconcilableSubtree,
  ReconciliationContainer,
} from "../utils/shapes.types.mjs";

import { IdCounter } from "../utils/id-counter.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";

export const LayoutEngines = {
  // eslint-disable-next-line sonarjs/cognitive-complexity
  flat2<G>(
    prev: ReconcilableSubtree<G>,
    curr: G[],
    hasChanged: HasChangedCallback2<G>,
  ): ReconcilableSubtree<G> {
    const curLen = curr.length;
    const prevLen = prev.list.length;
    const update: number[] = [];
    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];
    const list: ReconciliationContainer<G>[] = [];

    let ci = 0;
    let pi = 0;
    let iterCount = 0;
    while (ci < curLen || pi < prevLen) {
      if (iterCount++ > 100) {
        throw new RankiAppError({
          code: "TOO_LONG",
          why: "layout engine ran longer than allowed",
          details: { ci, pi, iterCount, prev, curr },
          cause: null,
        });
      }
      const isCurr = curr[ci] !== undefined;
      const isPrev = prev.list[pi] !== undefined;

      const actions: ReconciliationActionRec[] = [];
      if (isCurr && isPrev) {
        actions.push(...hasChanged(curr[ci], prev.list[pi].props));
      } else if (isCurr && !isPrev) {
        actions.push({
          type: "curr",
          action: "add",
        });
      } else if (!isCurr && isPrev) {
        actions.push({
          type: "prev",
          action: "keep",
        });
      } else {
        break;
      }

      assertTrue(actions.filter((v) => v.type === "curr").length < 2, {
        why: "cannot have more than 1 curr action",
      });
      assertTrue(actions.filter((v) => v.type === "prev").length < 2, {
        why: "cannot have more than 1 prev action",
      });

      actions.forEach(({ type, action }) => {
        switch (type) {
          case "curr":
            switch (action) {
              case "add":
                add.push(list.length);
                list.push({
                  id: IdCounter.getNewId(),
                  leave: false,
                  props: curr[ci],
                });
                break;
              case "update":
                update.push(list.length - 1);
                list.push({ ...prev.list[pi], props: curr[ci] });
                break;
              default:
                assertNever({
                  why: "Unrecognized curr action",
                  details: { action: action, actions },
                });
            }
            ci++;
            break;
          case "prev":
            switch (action) {
              case "keep":
                list.push(prev.list[pi]);
                break;
              case "remove":
                list.push({ ...prev.list[pi], leave: true });
            }
            pi++;
            break;
          default:
            assertNever({
              why: "Unrecognized type",
              details: { action: action, actions },
            });
        }
      });
    }
    // for (let i = 0; i < end; i++) {
    //   const isCurr = curr[i] !== undefined;
    //   const isPrev = prev.list[i] !== undefined;
    //   let actions: ReconciliationAction[];
    //   if (isCurr && isPrev) {
    //     actions = hasChanged(curr[i], prev.list[i].props);
    //   } else if (isCurr && !isPrev) {
    //     action = "add";
    //   } else if (!isCurr && isPrev) {
    //     action = "remove";
    //   } else {
    //     assertNever({
    //       details: {
    //         curr,
    //         isCurr,
    //         isPrev,
    //         prev,
    //       },
    //       why: "Impossible reconciliation state",
    //     });
    //   }

    //   switch (actions) {
    //     case "add":
    //       add.push(i);
    //       list.push({
    //         id: IdCounter.getNewId(),
    //         leave: false,
    //         props: curr[i],
    //       });
    //       break;
    //     case "remove":
    //       remove.push(i);
    //       list.push({ ...prev.list[i], leave: true });
    //       break;
    //     case "retain":
    //       retain.push(i);
    //       list.push(prev.list[i]);
    //       break;
    //     case "update":
    //       update.push(i);
    //       list.push({
    //         id: IdCounter.getNewId(),
    //         leave: false,
    //         props: curr[i],
    //       });
    //       break;
    //     default:
    //       assertNever({
    //         details: { action: actions },
    //         why: "unrecognized change option",
    //       });
    //   }
    // }

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
  },

  /**
   * @dev
   * #1 Why do we need this? Sometimes an update due to a late loading icon and
   * alike may cause a reconcilliation that throws off the mutation index. in
   * those cases, using the previous index so far shows to be the best option to
   * maintain functionality. It's possible that this is a hack. not maybe due
   * to the reconcilliation mechanism but due to the how updates are being
   * handled.
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  flat<G>(
    prev: ReconcilableSubtree<G>,
    curr: G[],
    hasChanged: ReconcileSingle<G>,
  ): ReconcilableSubtree<G> {
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
      let action: ReconciliationAction;
      if (isCurr && isPrev) {
        action = hasChanged(
          curr[i],
          prev.list[i].props,
        ) as unknown as ReconciliationAction;
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
            id: IdCounter.getNewId(),
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
            id: IdCounter.getNewId(),
            leave: false,
            props: curr[i],
          });
          break;
        default:
          assertNever({
            details: { action: action },
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
  },

  last<G>(
    prev: ReconcilableSubtree<G>,
    curr: G[],
    hasChanged: ReconcileSingle<G>,
  ): ReconcilableSubtree<G> {
    const list: ReconciliationContainer<G>[] = [...prev.list];

    const remove: number[] = [];
    const add: number[] = [];
    const retain: number[] = [];

    const currLast = curr.at(-1);
    const prevLast = list.at(-1)?.props;
    const isCurr = currLast !== undefined;
    const isPrev = prevLast !== undefined;

    let action: ReconciliationAction | "none" = "none";
    if (isCurr && isPrev) {
      action = hasChanged(
        currLast,
        prevLast,
      ) as unknown as ReconciliationAction;
    } else if (isCurr && !isPrev) {
      action = "add";
    } else if (!isCurr && isPrev) {
      action = "remove";
    }

    const i = list.length;
    switch (action) {
      case "add":
        add.push(i);
        list.push({
          id: IdCounter.getNewId(),
          leave: false,
          props: currLast!,
        });
        break;
      case "retain":
        retain.push(i);
        break;
      case "remove":
        remove.push(i);
        list.push({ ...prev.list[i], leave: true });
        break;
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
  },
};
