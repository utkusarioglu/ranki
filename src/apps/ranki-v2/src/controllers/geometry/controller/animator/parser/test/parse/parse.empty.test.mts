import { expect, test } from "vitest";

import { LayoutParser } from "../../layout-parser.mjs";

test("empty", () => {
  const response = LayoutParser.parse({
    block: {},
    curr: {
      actions: ["enter"],
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
        intent: "enter",
        style: {
          height: 21,
          width: 0,
          top: 0,
          left: 0,
        },
      },
    },
    prev: null,
  });
  const expected = {
    root: undefined,
    targets: undefined,
    then: undefined,
  };
  expect(response).toEqual(expected);
});
