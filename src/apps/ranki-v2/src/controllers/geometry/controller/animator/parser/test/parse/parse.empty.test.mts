import { expect, test } from "vitest";

import { LayoutParser } from "../../layout-parser.mjs";

test("empty", () => {
  const response = LayoutParser.parse({
    curr: {
      actions: ["lifecycle.enter"],
      container: {
        style: {
          height: 11,
        },
      },
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      self: {
        interaction: {
          drag: "none",
          focus: "none",
          hover: "none",
          press: "none",
        },
        lifecycle: "enter",
        mode: "default",
        style: {
          height: 21,
          left: 0,
          top: 0,
          width: 0,
        },
      },
    },
    prev: null,
    recipe: {},
  });
  const expected = {
    root: undefined,
    targets: undefined,
    then: undefined,
  };
  expect(response).toEqual(expected);
});
