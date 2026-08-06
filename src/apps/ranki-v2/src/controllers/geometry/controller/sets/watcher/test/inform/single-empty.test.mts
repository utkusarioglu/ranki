import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

const inform = vi.spyOn(WatcherSet.prototype, "inform");
import { GeometryWatchers } from "../../watcher.mjs";
import { WatcherSet } from "../../../watcher-set/watcher-set.mjs";

const getSet = vi.spyOn(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GeometryWatchers.prototype as any,
  "getSet",
);

const Host = vi.fn(class {});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let watchers: GeometryWatchers<any>;

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
  expect(inform).toHaveBeenCalledTimes(1);
  expect(getSet).toHaveBeenNthCalledWith(1, "one");
  expect(inform).toHaveBeenNthCalledWith(1, props, sizing);
});
