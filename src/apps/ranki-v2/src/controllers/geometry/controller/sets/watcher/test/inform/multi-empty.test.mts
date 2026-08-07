import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";
const inform = vi.spyOn(WatcherSet.prototype, "inform");
import type { LayoutSizing } from "../../../children/layout/layout-utils.types.mjs";

import { WatcherSet } from "../../../watcher-set/watcher-set.mjs";
import { GeometryWatchers } from "../../watcher.mjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSet = vi.spyOn(GeometryWatchers.prototype as any, "getSet");

const Host = vi.fn(class {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    containerExposed: { style: {} },
    selfOverrides: { style: {} },
    setName: "f",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
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
