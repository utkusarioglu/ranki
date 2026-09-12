import { expect, test, vi } from "vitest";
import { LayoutEngines } from "../../layout-engine.mjs";
import type { ReconcilableSubtree } from "_controllers/reconciler/utils/shapes.types.mjs";
import { ReconciliationShapes } from "_controllers/reconciler/reconciler.mjs";
import { IdCounter } from "_controllers/reconciler/utils/id-counter.mjs";

const DEFAULT_DATE = 1234;
const DEFAULT_ID = 1;

const PROPS = {};
const LIST_ENTRY1 = {
  id: DEFAULT_ID,
  leave: false,
  props: PROPS,
};
const LIST_ENTRY2 = {
  id: DEFAULT_ID + 1,
  leave: false,
  props: PROPS,
};
const LIST = [LIST_ENTRY1];

vi.spyOn(Date, "now").mockReturnValue(DEFAULT_DATE);
vi.spyOn(IdCounter, "getNewId").mockReturnValue(DEFAULT_ID);

/**
 * Tests how the flat engine behaves when the previous state contains the same
 * single element on the next turn
 *
 * @dev
 * This is broken until the `append` & `prepend` logic is figured
 */
test.skip(`One existing element with action "add"`, () => {
  const response = LayoutEngines.flat(
    {
      ...ReconciliationShapes.emptyState(),
      list: LIST,
    },
    [PROPS],
    () => "add",
  );
  const expected: ReconcilableSubtree<typeof PROPS> = {
    diff: {
      ...ReconciliationShapes.noChanges(0),
      add: [0],
    },
    epoch: DEFAULT_DATE,
    list: [LIST_ENTRY1, LIST_ENTRY2],
  };
  expect(response).toEqual(expected);
});

/**
 * Tests how the flat engine behaves when the previous state contains the same
 * single element on the next turn
 */
test(`One existing element with action "retain"`, () => {
  const response = LayoutEngines.flat(
    {
      ...ReconciliationShapes.emptyState(),
      list: LIST,
    },
    [PROPS],
    () => "retain",
  );
  const expected: ReconcilableSubtree<typeof PROPS> = {
    diff: {
      ...ReconciliationShapes.noChanges(0),
      retain: [0],
    },
    epoch: DEFAULT_DATE,
    list: LIST,
  };
  expect(response).toEqual(expected);
});
