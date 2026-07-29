import { expect, test } from "vitest";
import { LayoutParser } from "../../layout-parser.mts";

test("empty", () => {
  const response = LayoutParser.parse({
    curr: {
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      container: {
        intent: "enter",
        style: {
          height: 11,
        },
      },
      item: {
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
