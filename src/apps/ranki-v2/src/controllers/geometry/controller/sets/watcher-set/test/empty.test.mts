import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import { WatcherSet } from "../watcher-set.mjs";

const Host = vi.fn(class {});
let watchers: WatcherSet<any>;

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new WatcherSet(host, {
    selector: () => [],
  });
});

afterEach(() => {
  Host.mockClear();
});

test("empty props", async () => {
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
  const response = await watchers.inform(props, sizing);
  expect(response).toEqual(undefined);
});
