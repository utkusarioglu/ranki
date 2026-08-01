import { expect, test } from "vitest";
import { LayoutParser } from "../../layout-parser.mjs";

test("empty", () => {
  const response = LayoutParser.parse({
    curr: {
      actions: ["enter"],
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      containerExposed: {
        style: {
          height: 11,
        },
      },
      selfOverrides: {
        intent: "enter",
        style: {
          height: 21,
        },
      },
    },
    prev: null,
    block: {},
  });
  const expected = {
    root: undefined,
    targets: undefined,
    then: undefined,
  };
  expect(response).toEqual(expected);
});
