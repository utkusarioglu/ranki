import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import { WatcherSet } from "../../../single/single.mjs";
const inform = vi.spyOn(WatcherSet.prototype, "inform");
import { GeometryWatchers } from "../../watcher.mjs";
const getSet = vi.spyOn(GeometryWatchers.prototype as any, "getSet");

const Host = vi.fn(class {});
let watchers: GeometryWatchers<any>;

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new GeometryWatchers(host, {
    one: {
      selector: () => [],
    },
    two: {
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
  expect(inform).toHaveBeenCalledTimes(2);
  expect(getSet).toHaveBeenNthCalledWith(1, "one");
  expect(getSet).toHaveBeenNthCalledWith(2, "two");
  expect(inform).toHaveBeenNthCalledWith(1, props, sizing);
  expect(inform).toHaveBeenNthCalledWith(2, props, sizing);
});
