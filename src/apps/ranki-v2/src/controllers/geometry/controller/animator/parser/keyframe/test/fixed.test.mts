import { expect, test } from "vitest";

import { KeyframeParser } from "../keyframe-parser.mjs";

const FIXED_CSS_VALUES = [
  // Colors
  "red",
  "transparent",
  "currentColor",
  "#FF0000",
  "#00ff00",
  "#12345678",
  "rgb(255 0 0)",
  "rgba(255, 0, 0, 0.5)",
  "hsl(120 100% 50%)",

  // Dimensions
  "10px",
  "1.5rem",
  "50vw",
  "25vh",
  "10vmin",
  "5vmax",

  // Compound values
  "1px solid red",
  "0 10px 20px rgba(0, 0, 0, 0.5)",
  "center center",
  "translate(10px, 20px)",

  // CSS functions
  "var(--my-color)",
  "calc(100% - 20px)",
  "min(100px, 50%)",
  "max(10px, 2vw)",
  "clamp(10px, 5vw, 100px)",

  // Keywords
  "none",
  "auto",
  "inherit",
  "initial",
  "unset",
];

const CONTEXT = { index: 1, length: 2, stagger: 0 };

for (const expected of FIXED_CSS_VALUES) {
  test(`fixed CSS value: ${expected}`, () => {
    const response = KeyframeParser.evalOptionValue(CONTEXT, expected);

    expect(response).toEqual(expected);
  });
}
