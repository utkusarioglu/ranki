import { expect, test, vi } from "vitest";
import { LayoutEngines } from "../../layout-engine.mjs";
import type { ReconcilableSubtree } from "_controllers/reconciler/utils/shapes.types.mjs";
import type { LitElement } from "lit";
import { ReconciliationShapes } from "_controllers/reconciler/reconciler.mjs";
import { IdCounter } from "_controllers/reconciler/utils/id-counter.mjs";

const DEFAULT_DATE = 1234;
const DEFAULT_ID = 1;

vi.spyOn(Date, "now").mockReturnValue(DEFAULT_DATE);
vi.spyOn(IdCounter, "getNewId").mockReturnValue(DEFAULT_ID);

const PROPS = {};
const LIST_ENTRY1 = {
  id: DEFAULT_ID,
  leave: false,
  props: PROPS,
};
// const LIST_ENTRY2 = {
//   id: DEFAULT_ID + 1,
//   leave: false,
//   props: PROPS,
// };
const LIST = [LIST_ENTRY1];

const ACTIONS = ["add", "retain"] as const;

ACTIONS.forEach((action) => {
  /**
   * Tests an empty previous state vs an empty current state that has no
   * elements.
   * it uses `hasChanged` method that returns a static `action` to ensure that
   * the behavior doesn't change in this empty case.
   */
  test(`One existing with action "${action}"`, () => {
    const response = LayoutEngines.last(
      {
        ...ReconciliationShapes.emptyState(),
        list: LIST,
      },
      [],
      () => action,
    );
    const expected: ReconcilableSubtree<LitElement> = {
      ...ReconciliationShapes.emptyState(),
      epoch: DEFAULT_DATE,
    };
    expect(response).toEqual(expected);
  });
});
