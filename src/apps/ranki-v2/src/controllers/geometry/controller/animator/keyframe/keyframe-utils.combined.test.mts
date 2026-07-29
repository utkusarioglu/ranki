import { describe, expect, test } from "vitest";
import { KeyframeUtils } from "./keyframe-utils.mjs";
import type { Cases } from "./keyframe-utils.test.types.mjs";

const CASES: Cases = [
  {
    group: "combined transform properties",
    cases: [
      {
        name: "left + top + skewX + skewY",
        input: { left: 10, top: 20, skewX: 15, skewY: 30 },
        expected: {
          transform:
            "translateX(10px) translateY(20px) skewX(15deg) skewY(30deg)",
        },
      },
      {
        name: "width + height + opacity",
        input: { width: 120, height: 80, opacity: 0.5 },
        expected: { width: "120px", height: "80px", opacity: 0.5 },
      },
      {
        name: "rotate + scale + offset",
        input: { rotate: 45, scale: 1.5, offset: 0.25 },
        expected: { rotate: "45deg", scale: 1.5, offset: 0.25 },
      },
      {
        name: "mixed values with empty transform entries",
        input: { left: 5, top: 0, skewX: 0, skewY: 10 },
        expected: { transform: "translateX(5px) skewY(10deg)" },
      },
    ],
  },
];

CASES.forEach(({ cases, group }) => {
  describe(group, () => {
    cases.forEach(({ input, expected, name }) => {
      test(name, () => {
        const response = KeyframeUtils.produceKeyframe(input);
        expect(response).toEqual(expected);
      });
    });
  });
});
