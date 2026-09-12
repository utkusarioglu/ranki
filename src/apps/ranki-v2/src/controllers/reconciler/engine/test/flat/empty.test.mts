import { expect, test, vi } from "vitest";
import { LayoutEngines } from "../../layout-engine.mjs";
import type { ReconcilableSubtree } from "_controllers/reconciler/utils/shapes.types.mjs";
import type { LitElement } from "lit";
import { ReconciliationShapes } from "_controllers/reconciler/reconciler.mjs";
import type { ReconciliationActions } from "_controllers/reconciler/events/reconciliation-events.types.mjs";

const DEFAULT_DATE = 1234;

vi.spyOn(Date, "now").mockReturnValue(DEFAULT_DATE);

const ACTIONS: ReconciliationActions[] = ["add", "remove", "remove", "retain"];

ACTIONS.forEach((action) => {
  /**
   * Tests an empty previous state vs an empty current state that has no
   * elements.
   * it uses `hasChanged` method that returns a static `action` to ensure that
   * the behavior doesn't change in this empty case.
   */
  test(`Empty with action "${action}"`, () => {
    const response = LayoutEngines.flat(
      ReconciliationShapes.emptyState(),
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
