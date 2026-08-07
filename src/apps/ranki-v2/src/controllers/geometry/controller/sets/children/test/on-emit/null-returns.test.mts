// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { GeometryChildren } from "../../children.mjs";
import type { LitElement } from "lit";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type {
  ChildrenUpdateSizingReturn,
  GeometryChildrenProps,
} from "../../children.types.mjs";

const host = vi.fn() as unknown as LitElement;
const target = vi.fn() as unknown as R2C;
const props: GeometryChildrenProps<LitElement> = {
  selector: () => [],
};

/**
 * @dev
 * #1 This ignores additional properties some of these `intents` require
 */
["disconnected", "connected"].forEach((intent) => {
  test("returns null for certain emits", async () => {
    const children = new GeometryChildren<LitElement>(host, props);
    const detail: R2CNewChildSizeEvent = {
      // @ts-expect-error #1
      intent,
      mode: "idle",
    };
    const response = await children.onEmit(target, detail);
    const expected: Awaited<ChildrenUpdateSizingReturn> = null;
    expect(response).toEqual(expected);
  });
});
