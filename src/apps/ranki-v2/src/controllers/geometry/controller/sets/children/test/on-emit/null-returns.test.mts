// @vitest-environment jsdom
import { expect, test, vi } from "vitest";
import { GeometryChildren } from "../../children.mjs";
import type { LitElement } from "lit";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { R2CNewChildSizeEvent } from "_controllers/geometry/controller/events/geometry-events.types.mjs";

const host = vi.fn() as unknown as LitElement;
const target = vi.fn() as unknown as R2C;
const props = {
  layout: () => () => null,
  selector: () => [],
};

/**
 * @dev
 * #1 This ignores additional properties some of these `intents` require
 */
["leave", "disconnected", "connected"].forEach((intent) => {
  test("returns null for certain emits", async () => {
    const children = new GeometryChildren<LitElement>(host, props);
    const detail: R2CNewChildSizeEvent = {
      // @ts-expect-error #1
      intent,
    };
    const response = await children.onEmit(target, detail);
    const expected = null;
    expect(response).toBe(expected);
  });
});
