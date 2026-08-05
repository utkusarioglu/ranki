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

let elemOne: R2C;
let elemTwo: R2C;

beforeEach(() => {
  elemOne = singleElem() as unknown as R2C;
  elemTwo = singleElem() as unknown as R2C;
});

test("2 set 1 elem each", async () => {
  const props = {
    one: {
      selector: () => [elemOne as unknown as R2C],
    },
    two: {
      selector: () => [elemTwo as unknown as R2C],
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
  expect(elemOne.informStyle).toHaveBeenCalledTimes(1);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expected);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(1);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(1, expected);
});

test("2 set 2 elems each", async () => {
  const props = {
    one: {
      selector: () => [elemOne as unknown as R2C, elemOne as unknown as R2C],
    },
    two: {
      selector: () => [elemTwo as unknown as R2C, elemTwo as unknown as R2C],
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
  expect(elemOne.informStyle).toHaveBeenCalledTimes(2);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expected[0]);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(2, expected[1]);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(2);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(1, expected[0]);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(2, expected[1]);
});

test("2 set varied elem count", async () => {
  const props = {
    one: {
      selector: () => [elemOne as unknown as R2C],
    },
    two: {
      selector: () => [
        elemTwo as unknown as R2C,
        elemTwo as unknown as R2C,
        elemTwo as unknown as R2C,
      ],
    },
  };
  const expectedOne: InformedChildStyle[] = [
    {
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      containerExposed: {
        style: sizing.container,
      },
      selfOverrides: { style: {} },
    },
  ];
  const expectedTwo: InformedChildStyle[] = [
    {
      context: {
        index: 0,
        length: 3,
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
        length: 3,
        stagger: 0,
      },
      containerExposed: {
        style: sizing.container,
      },
      selfOverrides: { style: {} },
    },
    {
      context: {
        index: 2,
        length: 3,
        stagger: 0,
      },
      containerExposed: {
        style: sizing.container,
      },
      selfOverrides: { style: {} },
    },
  ];
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(1);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expectedOne[0]);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(3);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(1, expectedTwo[0]);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(2, expectedTwo[1]);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(3, expectedTwo[2]);
});
