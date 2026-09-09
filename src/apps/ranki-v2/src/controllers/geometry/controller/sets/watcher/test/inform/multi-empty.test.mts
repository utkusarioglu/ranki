import type { InformSetProps } from "_controllers/geometry/controller/animator/types/animator.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";
const inform = vi.spyOn(WatcherSet.prototype, "inform");
import type { LayoutSizing } from "../../../children/layout/layout-utils.types.mjs";

import { WatcherSet } from "../../../watcher-set/watcher-set.mjs";
import { GeometryWatchers } from "../../watcher.mjs";
import { ChildrenRegistry } from "../../../children/registry/children-registry.mjs";

const Host = vi.fn(class {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let watchers: GeometryWatchers<any>;

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new GeometryWatchers(host);
});

afterEach(() => {
  Host.mockClear();
});

test("no set no elems", async () => {
  const props: InformSetProps = {
    containerExposed: { style: {} },
    selfOverrides: {
      interaction: ChildrenRegistry.DEFAULT_INTERACTION,
      lifecycle: "enter",
      mode: "default",
      style: {},
    },
    setName: "one",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [],
  };
  await watchers.inform(props, sizing);
  expect(inform).toHaveBeenCalledTimes(0);
});
