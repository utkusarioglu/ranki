import { describe, expect, test } from "vitest";
import { Style } from "./style.mts";

interface CaseGroup<T> {
  groupName: string;
  cases: {
    caseName: string;
    arg: Record<string, number>;
    expected: T;
  }[];
}
type SingleGroup = Record<string, string | number>;

type CompositeGroup = Record<string, string | number>;

const SINGLE_CASES: CaseGroup<SingleGroup>[] = [
  {
    groupName: "px",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((left) => ({
        caseName: `Happy case: (left, ${left})`,
        arg: { left: left },
        expected: { transform: `translateX(${left}px)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((top) => ({
        caseName: `Happy case: (top, ${top})`,
        arg: { top },
        expected: { transform: `translateY(${top}px)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((width) => ({
        caseName: `Happy case: (width, ${width})`,
        arg: { width },
        expected: { width: `${width}px` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((height) => ({
        caseName: `Happy case: (height, ${height})`,
        arg: { height },
        expected: { height: `${height}px` },
      })),
    ],
  },
  {
    groupName: "deg",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((rotate) => ({
        caseName: `Happy case: (rotate, ${rotate})`,
        arg: { rotate },
        expected: { rotate: `${rotate}deg` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((skewX) => ({
        caseName: `Happy case: (skewX, ${skewX})`,
        arg: { skewX },
        expected: { transform: `skewX(${skewX}deg)` },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((skewY) => ({
        caseName: `Happy case: (skewY, ${skewY})`,
        arg: { skewY },
        expected: { transform: `skewY(${skewY}deg)` },
      })),
    ],
  },

  {
    groupName: "string",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((scale) => ({
        caseName: `Happy case: (scale, ${scale})`,
        arg: { scale },
        expected: { scale: scale.toString() },
      })),

      ...Array.from({ length: 10 }, (_, i) => i * 100).map((opacity) => ({
        caseName: `Happy case: (opacity, ${opacity})`,
        arg: { opacity },
        expected: { opacity: opacity.toString() },
      })),
    ],
  },

  {
    groupName: "number",
    cases: [
      ...Array.from({ length: 10 }, (_, i) => i * 100).map((offset) => ({
        caseName: `Happy case: (offset, ${offset})`,
        arg: { offset },
        expected: { offset },
      })),
    ],
  },
];

SINGLE_CASES.forEach(({ groupName, cases }) => {
  describe(groupName, () => {
    cases.forEach(({ caseName, arg, expected }) => {
      test(caseName, () => {
        const response = Style.produceKeyframe(arg);
        expect(response).toEqual(expected);
      });
    });
  });
});

const COMPOSITE_CASES: CaseGroup<CompositeGroup>[] = [
  {
    groupName: "Composite: transform",
    cases: [
      {
        caseName: "combines translation and dimensions",
        arg: { left: 2, top: 3, width: 120, height: 80 },
        expected: {
          transform: "translateX(2px) translateY(3px)",
          width: "120px",
          height: "80px",
        },
      },
      {
        caseName: "combines skew and rotation",
        arg: { skewX: 10, skewY: 20, rotate: 45 },
        expected: {
          transform: "skewX(10deg) skewY(20deg)",
          rotate: "45deg",
        },
      },
      {
        caseName: "combines animation values",
        arg: { left: 4, opacity: 0.5, scale: 2, offset: 0.25 },
        expected: {
          transform: "translateX(4px)",
          opacity: "0.5",
          scale: "2",
          offset: 0.25,
        },
      },
      {
        caseName: "joins all transform functions in order",
        arg: { left: 10, top: 20, skewX: 30, skewY: 40 },
        expected: {
          transform:
            "translateX(10px) translateY(20px) skewX(30deg) skewY(40deg)",
        },
      },
      {
        caseName: "keeps skew values when no translation is present",
        arg: { skewX: 5, skewY: -10 },
        expected: {
          transform: "skewX(5deg) skewY(-10deg)",
        },
      },
      {
        caseName: "includes zero-valued transform properties",
        arg: { left: 0, top: 0, skewX: 0, skewY: 0 },
        expected: {
          transform: "translateX(0px) translateY(0px) skewX(0deg) skewY(0deg)",
        },
      },
      {
        caseName: "combines transform with sizing and rotation",
        arg: { left: 6, top: 7, width: 100, height: 50, rotate: 90 },
        expected: {
          transform: "translateX(6px) translateY(7px)",
          width: "100px",
          height: "50px",
          rotate: "90deg",
        },
      },
    ],
  },
];

COMPOSITE_CASES.forEach(({ groupName, cases }) => {
  describe(groupName, () => {
    cases.forEach(({ caseName, arg, expected }) => {
      test(caseName, () => {
        const response = Style.produceKeyframe(arg);
        expect(response).toEqual(expected);
      });
    });
  });
});
