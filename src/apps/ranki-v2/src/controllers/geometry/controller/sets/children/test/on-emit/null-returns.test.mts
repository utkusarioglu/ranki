import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";

// @vitest-environment jsdom
import { expect, test, vi } from "vitest";

import type {
  ChildrenUpdateSizingReturn,
  GeometryChildrenProps,
} from "../../children.types.mjs";

import { GeometryChildren } from "../../children.mjs";

const host = vi.fn() as unknown as LitElement;
const target = vi.fn() as unknown as R2C;
const props: GeometryChildrenProps<LitElement> = {
  selector: () => [],
};

/**
 * @dev
 * #1 This ignores additional properties some of these `intents` require
 */
["disconnected" as const, "connected" as const].forEach((intent) => {
  test("returns null for certain emits", async () => {
    const children = new GeometryChildren<LitElement>(host, props);
    const detail: R2CNewChildSizeEvent = {
      type: "intent",
      intent,
      mode: "idle",
    };
    const response = await children.onEmit(target, detail);
    const expected: Awaited<ChildrenUpdateSizingReturn> = null;
    expect(response).toEqual(expected);
  });
});
