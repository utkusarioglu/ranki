import { describe, expect, test } from "vitest";

import type { Cases } from "./keyframe-utils.test.types.mjs";

import { KeyframeUtils } from "../keyframe-utils.mjs";

const CASES: Cases = [
  {
    cases: [
      {
        expected: {
          transform:
            "translateX(10px) translateY(20px) skewX(15deg) skewY(30deg)",
        },
        input: { left: 10, skewX: 15, skewY: 30, top: 20 },
        name: "left + top + skewX + skewY",
      },
      {
        expected: { height: "80px", opacity: 0.5, width: "120px" },
        input: { height: 80, opacity: 0.5, width: 120 },
        name: "width + height + opacity",
      },
      {
        expected: { offset: 0.25, rotate: "45deg", scale: 1.5 },
        input: { offset: 0.25, rotate: 45, scale: 1.5 },
        name: "rotate + scale + offset",
      },
      {
        expected: { transform: "translateX(5px) skewY(10deg)" },
        input: { left: 5, skewX: 0, skewY: 10, top: 0 },
        name: "mixed values with empty transform entries",
      },
    ],
    group: "combined transform properties",
  },
];

CASES.forEach(({ cases, group }) => {
  describe(group, () => {
    cases.forEach(({ expected, input, name }) => {
      test(name, () => {
        const response = KeyframeUtils.produceKeyframe(input);
        expect(response).toEqual(expected);
      });
    });
  });
});
