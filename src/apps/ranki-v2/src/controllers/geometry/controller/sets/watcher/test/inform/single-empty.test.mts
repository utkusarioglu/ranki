import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { GeometryWatchers } from "../../watcher.mjs";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

const Host = vi.fn(class {});
let watchers: GeometryWatchers<any>;

const getElements = vi.spyOn(GeometryWatchers.prototype as any, "getElements");

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new GeometryWatchers(host, {
    one: {
      selector: () => [],
    },
  });
});

afterEach(() => {
  Host.mockClear();
});

test("Single set no elems", async () => {
  const props: InformSetProps = {
    setName: "f",
    containerExposed: { style: {} },
    selfOverrides: { style: {} },
  };
  const sizing: LayoutSizing = {
    container: {
      width: 1,
      height: 3,
    },
    set: [],
  };
  await watchers.inform(props, sizing);
  expect(getElements).toHaveBeenCalledTimes(1);
  expect(getElements).toHaveBeenNthCalledWith(1, "one");
});
