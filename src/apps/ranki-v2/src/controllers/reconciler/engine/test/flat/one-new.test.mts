import { expect, test, vi } from "vitest";
import { LayoutEngines } from "../../layout-engine.mjs";
import type { ReconcilableSubtree } from "_controllers/reconciler/utils/shapes.types.mjs";
import { ReconciliationShapes } from "_controllers/reconciler/reconciler.mjs";
import type { ReconciliationActions } from "_controllers/reconciler/events/reconciliation-events.types.mjs";
import { IdCounter } from "_controllers/reconciler/utils/id-counter.mjs";

const DEFAULT_DATE = 1234;
const DEFAULT_ID = 1;

vi.spyOn(Date, "now").mockReturnValue(DEFAULT_DATE);
vi.spyOn(IdCounter, "getNewId").mockReturnValue(DEFAULT_ID);

const ACTIONS: ReconciliationActions[] = ["add", "remove", "remove", "retain"];

ACTIONS.forEach((action) => {
  /**
   * Tests an empty previous state vs an empty current state that has no
   * elements.
   * it uses `hasChanged` method that returns a static `action` to ensure that
   * the behavior doesn't change in this empty case.
   */
  test(`One new element with action "${action}"`, () => {
    const props1 = {};
    const response = LayoutEngines.flat(
      ReconciliationShapes.emptyState(),
      [props1],
      () => action,
    );
    const expected: ReconcilableSubtree<typeof props1> = {
      diff: {
        ...ReconciliationShapes.noChanges(0),
        add: [0],
        stagger: {
          first: 0,
          indices: [0],
        },
      },
      epoch: DEFAULT_DATE,
      list: [
        {
          id: DEFAULT_ID,
          leave: false,
          props: props1,
        },
      ],
    };
    expect(response).toEqual(expected);
  });
});
