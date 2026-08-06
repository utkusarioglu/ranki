import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { GeometryWatchers } from "../../watcher.mjs";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";

const Host = vi.fn(class {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let watchers: GeometryWatchers<any>;

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new GeometryWatchers(host, {});
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
