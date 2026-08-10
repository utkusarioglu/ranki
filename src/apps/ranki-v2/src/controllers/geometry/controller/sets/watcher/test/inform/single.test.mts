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
    lifecycle: "enter",
    interaction: {
      hover: "none",
      focus: "none",
      press: "none",
      drag: "none",
    },
    style: {},
  },
  setName: "one",
};

let elem: R2C;

beforeEach(() => {
  elem = singleElem() as unknown as R2C;
});

test("Single set 1 elem", async () => {
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [
      {
        lifecycle: "enter",
        interaction: {
          hover: "none",
          focus: "none",
          press: "none",
          drag: "none",
        },
        style: {
          top: 2,
          left: 5,
          height: 30,
          width: 10,
        },
      },
    ],
  };
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
      lifecycle: "enter",
      interaction: {
        hover: "none",
        focus: "none",
        press: "none",
        drag: "none",
      },
      style: sizing.set[0].style,
    },
  };
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elem.informStyle).toHaveBeenCalledTimes(1);
  expect(elem.informStyle).toHaveBeenNthCalledWith(1, expected);
});

test("Single set 2 elems", async () => {
  const sizing: LayoutSizing = {
    container: {
      height: 3,
      width: 1,
    },
    set: [
      {
        lifecycle: "enter",
        interaction: {
          hover: "none",
          focus: "none",
          press: "none",
          drag: "none",
        },
        style: {
          top: 2,
          left: 5,
          height: 30,
          width: 10,
        },
      },
      {
        lifecycle: "update",
        interaction: {
          hover: "end",
          focus: "none",
          press: "none",
          drag: "none",
        },
        style: {
          top: 20,
          left: 50,
          height: 300,
          width: 100,
        },
      },
    ],
  };
  const props = {
    one: {
      selector: () => [elem as unknown as R2C, elem as unknown as R2C],
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
      selfOverrides: {
        lifecycle: "enter",
        interaction: {
          hover: "none",
          focus: "none",
          press: "none",
          drag: "none",
        },
        style: sizing.set[0].style,
      },
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
      selfOverrides: {
        lifecycle: "update",
        interaction: {
          hover: "end",
          focus: "none",
          press: "none",
          drag: "none",
        },
        style: sizing.set[1].style,
      },
    },
  ];
  await new GeometryWatchers(host, props).inform(informProps, sizing);
  expect(elem.informStyle).toHaveBeenCalledTimes(2);
  expect(elem.informStyle).toHaveBeenNthCalledWith(1, expected[0]);
  expect(elem.informStyle).toHaveBeenNthCalledWith(2, expected[1]);
});
