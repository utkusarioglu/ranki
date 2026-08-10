import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LitElement } from "lit";

import { afterEach, beforeEach, expect, test, vi } from "vitest";

import type { LayoutSizing } from "../../../children/layout/layout-utils.types.mjs";

import { GeometryWatchers } from "../../watcher.mjs";

const Host = vi.fn(class {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let watchers: GeometryWatchers<any>;

beforeEach(() => {
  const host = new Host() as unknown as LitElement;
  watchers = new GeometryWatchers(host, {
    f: {
      selector: () => [],
    },
  });
});

afterEach(() => {
  Host.mockClear();
});

test("empty props", async () => {
  const props: InformSetProps = {
    containerExposed: { style: {} },
    selfOverrides: {
      lifecycle: "enter",
      interaction: {
        hover: "none",
        focus: "none",
        press: "none",
        drag: "none",
      },
      style: {},
    },
    setName: "f",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [],
  };
  const response = await watchers.inform(props, sizing);
  expect(response).toEqual(undefined);
});
