import type { ReconcilableSubtree } from "./shapes.types.mjs";
import type { ReconciliationDiff } from "./shapes.types.mjs";

export class ReconciliationShapes {
  public static emptyState<G>(): ReconcilableSubtree<G> {
    return {
      diff: ReconciliationShapes.noChanges(),
      epoch: 0,
      list: [],
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
}
