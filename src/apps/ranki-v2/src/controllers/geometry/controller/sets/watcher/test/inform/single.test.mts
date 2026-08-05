import { beforeEach, expect, test, vi } from "vitest";
import { GeometryWatchers } from "../../watcher.mjs";
import type { LitElement } from "lit";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { InformedChildStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";

const Host = vi.fn(class {});
const host = new Host() as unknown as LitElement;

const singleElem = () => ({ informStyle: vi.fn() });

const informProps: InformSetProps = {
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

let elem: R2C;

beforeEach(() => {
  elem = singleElem() as unknown as R2C;
});

test("Single set 1 elem", async () => {
  const props = {
    one: {
      selector: () => [elem as unknown as R2C],
    },
  };
  const expected: InformedChildStyle = {
    containerExposed: {
      style: sizing.container,
    },
    context: {
      index: 0,
      length: 1,
      stagger: 0,
    },
    selfOverrides: {
      style: {},
    },
  };
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elem.informStyle).toHaveBeenCalledTimes(1);
  expect(elem.informStyle).toHaveBeenNthCalledWith(1, expected);
});

test("Single set 2 elems", async () => {
  const props = {
    one: {
      selector: () => [elem as unknown as R2C, elem as unknown as R2C],
    },
  };
  const expected: InformedChildStyle[] = [
    {
      context: {
        index: 0,
        length: 2,
        stagger: 0,
      },
      containerExposed: {
        style: sizing.container,
      },
      selfOverrides: { style: {} },
    },
    {
      context: {
        index: 1,
        length: 2,
        stagger: 0,
      },
      containerExposed: {
        style: sizing.container,
      },
      selfOverrides: { style: {} },
    },
  ];
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elem.informStyle).toHaveBeenCalledTimes(2);
  expect(elem.informStyle).toHaveBeenNthCalledWith(1, expected[0]);
  expect(elem.informStyle).toHaveBeenNthCalledWith(2, expected[1]);
});
