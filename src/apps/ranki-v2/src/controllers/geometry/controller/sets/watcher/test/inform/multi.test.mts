import type { R2C } from "_components/r2c/r2c.mjs";
import type { InformSetProps } from "_controllers/geometry/controller/animator/animator.types.mjs";
import type { InformedChildStyle } from "_controllers/geometry/controller/types/geometry-controller.types.mjs";
import type { LitElement } from "lit";

import { beforeEach, expect, test, vi } from "vitest";

import type { LayoutSizing } from "../../../children/layout/layout-utils.types.mjs";

import { GeometryWatchers } from "../../watcher.mjs";

const Host = vi.fn(class {});
const host = new Host() as unknown as LitElement;

const singleElem = () => ({ informStyle: vi.fn() });

const informProps: InformSetProps = {
  containerExposed: { style: {} },
  selfOverrides: {
    intent: "enter",
    mode: "idle",
    style: {},
  },
  setName: "one",
};

const sizing: LayoutSizing = {
  container: {
    height: 3,
    width: 1,
  },
  set: [
    {
      intent: "enter",
      mode: "hover-end",
      style: {
        width: 400,
        height: 17,
        top: 13,
        left: 11,
      },
    },
  ],
};

let elemOne: R2C;
let elemTwo: R2C;

beforeEach(() => {
  elemOne = singleElem() as unknown as R2C;
  elemTwo = singleElem() as unknown as R2C;
});

test("2 set 1 elem each call first", async () => {
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
    selfOverrides: sizing.set[0],
  };
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(1);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expected);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(0);
});

test("2 set 1 elem each call second", async () => {
  const informProps: InformSetProps = {
    containerExposed: { style: {} },
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {},
    },
    setName: "two",
  };
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
    selfOverrides: sizing.set[0],
  };
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(0);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(1);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(1, expected);
});

test("2 set 2 elems each", async () => {
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [
      {
        intent: "enter",
        mode: "hover-end",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
      {
        intent: "none",
        mode: "idle",
        style: {
          width: 4000,
          height: 170,
          top: 130,
          left: 110,
        },
      },
    ],
  };
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
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 0,
        length: 2,
        stagger: 0,
      },
      selfOverrides: sizing.set[0],
      // {
      //   intent: "enter",
      //   mode: "idle",
      //   style: {},
      // },
    },
    {
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 1,
        length: 2,
        stagger: 0,
      },
      selfOverrides: sizing.set[1],
      // {
      //   intent: "enter",
      //   mode: "idle",
      //   style: {},
      // },
    },
  ];
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(2);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expected[0]);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(2, expected[1]);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(0);
});

test.only("2 set varied elem count 1", async () => {
  const informPropsOne: InformSetProps = {
    containerExposed: { style: {} },
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {},
    },
    setName: "one",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [
      {
        intent: "enter",
        mode: "hover-end",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
      {
        intent: "leave",
        mode: "idle",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
      {
        intent: "update",
        mode: "hover-start",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
    ],
  };
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
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      selfOverrides: sizing.set[0],
    },
  ];
  await new GeometryWatchers(host, props).inform(informPropsOne, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(1);
  expect(elemOne.informStyle).toHaveBeenNthCalledWith(1, expectedOne[0]);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(0);
});

test("2 set varied elem count 2", async () => {
  const informPropsTwo: InformSetProps = {
    containerExposed: { style: {} },
    selfOverrides: {
      intent: "enter",
      mode: "idle",
      style: {},
    },
    setName: "two",
  };
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [
      {
        intent: "enter",
        mode: "hover-end",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
      {
        intent: "leave",
        mode: "idle",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
      {
        intent: "update",
        mode: "hover-start",
        style: {
          width: 400,
          height: 17,
          top: 13,
          left: 11,
        },
      },
    ],
  };
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
  const expectedTwo: InformedChildStyle[] = [
    {
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 0,
        length: 3,
        stagger: 0,
      },
      selfOverrides: sizing.set[0],
    },
    {
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 1,
        length: 3,
        stagger: 0,
      },
      selfOverrides: sizing.set[1],
    },
    {
      containerExposed: {
        style: sizing.container,
      },
      context: {
        index: 2,
        length: 3,
        stagger: 0,
      },
      selfOverrides: sizing.set[2],
    },
  ];
  await new GeometryWatchers(host, props).inform(informPropsTwo, sizing);
  expect(elemOne.informStyle).toHaveBeenCalledTimes(0);
  expect(elemTwo.informStyle).toHaveBeenCalledTimes(3);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(1, expectedTwo[0]);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(2, expectedTwo[1]);
  expect(elemTwo.informStyle).toHaveBeenNthCalledWith(3, expectedTwo[2]);
});
